import pandas as pd
import numpy as np
from itertools import product
import datetime

class FINRAWFOBacktester:
    def __init__(self, data_path=None):
        """
        初始化 WFO 回測引擎。
        期望的資料包含：Date, FINRA_Margin, M0, SPY_Close, QQQ_Close, TQQQ_Close
        以及濾網資料: CAPE, SAHM, TIPS_Yield
        """
        # 這裡以產生模擬測試資料為例，實戰中請替換為讀取您的真實 CSV
        if data_path:
            self.df = pd.read_csv(data_path, index_col='Date', parse_dates=True)
        else:
            self.df = self._generate_mock_data()
            
    def _generate_mock_data(self):
        """產生用於測試回測引擎架構的假資料 (1999 - 2026)"""
        dates = pd.date_range(start='1999-01-01', end='2026-04-01', freq='M')
        n = len(dates)
        
        # 隨機漫步模擬指數
        qqq = np.exp(np.cumsum(np.random.normal(0.01, 0.05, n))) * 100
        tqqq = np.exp(np.cumsum(np.random.normal(0.01, 0.05, n) * 3)) * 100
        
        # 模擬 FINRA/M0 指標 (0 到 1 之間震盪)
        finra_m0_ratio = np.sin(np.linspace(0, 10 * np.pi, n)) * 0.3 + 0.5 + np.random.normal(0, 0.05, n)
        
        df = pd.DataFrame({
            'QQQ': qqq,
            'TQQQ': tqqq,
            'FINRA_M0': finra_m0_ratio
        }, index=dates)
        
        return df

    def calculate_metrics(self, equity_curve):
        """計算機構級風險指標：Sharpe, Max DD, CAGR"""
        returns = equity_curve.pct_change().dropna()
        
        if len(returns) == 0:
            return {'CAGR': 0, 'Max_DD': 0, 'Sharpe': 0}
            
        cagr = (equity_curve.iloc[-1] / equity_curve.iloc[0]) ** (12 / len(equity_curve)) - 1
        
        # 計算 Max DD
        roll_max = equity_curve.cummax()
        drawdown = equity_curve / roll_max - 1.0
        max_dd = drawdown.min()
        
        # 假設無風險利率 2%
        rf = 0.02
        ann_return = returns.mean() * 12
        ann_vol = returns.std() * np.sqrt(12)
        sharpe = (ann_return - rf) / ann_vol if ann_vol > 0 else 0
        
        return {'CAGR': cagr, 'Max_DD': max_dd, 'Sharpe': sharpe}

    def run_strategy(self, data, yellow_thresh, red_thresh):
        """
        執行單次策略回測 (向量化運算)
        假設: 
        - 低於 Yellow: 100% TQQQ
        - Yellow 到 Red: 50% QQQ / 50% 現金 (降低槓桿)
        - 高於 Red: 100% 現金 (避險)
        * 註：此處為了程式碼簡潔，簡化了原本 4/10 個月的分批進出邏輯
        """
        df = data.copy()
        
        # 產生訊號 (Shift 1 避免未來函數)
        indicator = df['FINRA_M0'].shift(1)
        
        # 定義資金部位 (Position Sizing)
        # 1.0 代表 100% 滿倉 TQQQ, 0.5 代表 50% QQQ, 0 代表現金
        df['Position_TQQQ'] = np.where(indicator < yellow_thresh, 1.0, 0.0)
        df['Position_QQQ'] = np.where((indicator >= yellow_thresh) & (indicator < red_thresh), 1.0, 0.0)
        
        # 計算逐月報酬率
        df['TQQQ_Ret'] = df['TQQQ'].pct_change()
        df['QQQ_Ret'] = df['QQQ'].pct_change()
        
        # 策略總報酬 = TQQQ部位 * TQQQ報酬 + QQQ部位 * QQQ報酬
        df['Strategy_Ret'] = (df['Position_TQQQ'].shift(1) * df['TQQQ_Ret']) + \
                             (df['Position_QQQ'].shift(1) * df['QQQ_Ret'])
                             
        df['Strategy_Ret'].fillna(0, inplace=True)
        df['Equity'] = (1 + df['Strategy_Ret']).cumprod() * 100
        
        return df['Equity']

    def grid_search(self, train_data):
        """在 In-Sample 訓練集上尋找最佳參數 (最大化 Sharpe 且限制 Max DD)"""
        print(f"--- 執行 Grid Search (訓練區間: {train_data.index[0].date()} 到 {train_data.index[-1].date()}) ---")
        
        yellow_options = np.arange(0.20, 0.40, 0.05)
        red_options = np.arange(0.35, 0.55, 0.05)
        
        best_sharpe = -999
        best_params = (0.24, 0.41) # Default fallback
        
        for y, r in product(yellow_options, red_options):
            if y >= r: continue
            
            equity = self.run_strategy(train_data, y, r)
            metrics = self.calculate_metrics(equity)
            
            # 條件：尋找最高夏普值，且 Max DD 不超過 -40%
            if metrics['Sharpe'] > best_sharpe and metrics['Max_DD'] > -0.40:
                best_sharpe = metrics['Sharpe']
                best_params = (y, r)
                
        print(f"最佳參數: 黃燈={best_params[0]:.2f}, 紅燈={best_params[1]:.2f} (Sharpe: {best_sharpe:.2f})")
        return best_params

    def run_wfo(self, train_years=10, trade_years=3):
        """
        執行前進推進最佳化 (Walk-Forward Optimization)
        將 Out-of-Sample 的資金曲線無縫拼接。
        """
        print("\n===========================================")
        print("啟動 Walk-Forward Optimization (WFO) 引擎")
        print("===========================================\n")
        
        start_year = self.df.index[0].year
        end_year = self.df.index[-1].year
        
        oos_equities = []
        last_equity_value = 100.0 # 起始資金
        
        # 滾動視窗迴圈
        current_year = start_year
        while current_year + train_years < end_year:
            # 1. 定義切分點
            train_start = f"{current_year}-01-01"
            train_end = f"{current_year + train_years - 1}-12-31"
            trade_start = f"{current_year + train_years}-01-01"
            trade_end = f"{min(current_year + train_years + trade_years - 1, end_year)}-12-31"
            
            # 2. 切分資料
            train_data = self.df[train_start:train_end]
            trade_data = self.df[trade_start:trade_end]
            
            if len(trade_data) == 0: break
                
            # 3. 執行最佳化 (In-Sample)
            best_y, best_r = self.grid_search(train_data)
            
            # 4. 盲測交易 (Out-of-Sample)
            print(f"-> 盲測交易區間 (OOS): {trade_data.index[0].date()} 到 {trade_data.index[-1].date()}")
            oos_equity = self.run_strategy(trade_data, best_y, best_r)
            
            # 5. 拼接資金曲線 (保持資金延續性)
            # 將 OOS 的曲線轉換為相對於上一段結尾的真實淨值
            oos_ret = oos_equity.pct_change().fillna(0)
            stitched_equity = (1 + oos_ret).cumprod() * last_equity_value
            last_equity_value = stitched_equity.iloc[-1]
            
            oos_equities.append(stitched_equity)
            
            # 推進視窗
            current_year += trade_years
            
        # 組合最終的純 OOS 資金曲線
        final_oos_curve = pd.concat(oos_equities)
        
        # 計算最終 WFO 成績
        final_metrics = self.calculate_metrics(final_oos_curve)
        print("\n===========================================")
        print("WFO 拼接完成！純 OOS 盲測總成績單：")
        print(f"總年化報酬率 (CAGR): {final_metrics['CAGR']*100:.2f}%")
        print(f"最大回撤 (Max DD): {final_metrics['Max_DD']*100:.2f}%")
        print(f"夏普值 (Sharpe): {final_metrics['Sharpe']:.2f}")
        print("===========================================")
        
        return final_oos_curve


if __name__ == "__main__":
    # 若您有真實的 csv，可傳入路徑: backtester = FINRAWFOBacktester('data/historical_data.csv')
    backtester = FINRAWFOBacktester()
    
    # 執行 WFO (10年訓練, 3年盲測)
    final_curve = backtester.run_wfo(train_years=10, trade_years=3)
    
    # 此處可以加入程式碼將 final_curve 繪圖或儲存成 CSV，供前端 Next.js 讀取顯示
    # final_curve.to_csv('wfo_results.csv')
