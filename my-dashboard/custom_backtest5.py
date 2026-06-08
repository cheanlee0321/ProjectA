import json
import yfinance as yf
import pandas as pd
import numpy as np

# Load FINRA data
with open('public/data/strategy_data.json', 'r') as f:
    strategy_data = json.load(f)

df_finra = pd.DataFrame(strategy_data)
df_finra = df_finra.dropna(subset=['finraToM0', 'cape']).copy()
df_finra['month_dt'] = pd.to_datetime(df_finra['month'])
df_finra = df_finra.sort_values('month_dt').reset_index(drop=True)

start_date = '1999-01-01'
end_date = '2026-04-30'

raw_data = yf.download(['QQQ', 'SPY'], start=start_date, end=end_date)
if 'Adj Close' in raw_data.columns.get_level_values(0):
    prices = raw_data['Adj Close']
else:
    prices = raw_data['Close']
    if isinstance(prices.columns, pd.MultiIndex):
        prices.columns = prices.columns.get_level_values(1)

returns = prices.pct_change().dropna()

sim_returns = returns.copy()
sim_returns['TQQQ_sim'] = returns['QQQ'] * 3
sim_returns['SHV_sim'] = (1.02) ** (1/252) - 1

sim_returns = sim_returns.reset_index()
sim_returns['trading_month'] = sim_returns['Date'].dt.to_period('M')
df_finra['finra_month'] = df_finra['month_dt'].dt.to_period('M')

df_finra['effective_trading_month'] = df_finra['finra_month'] + 2

signal_map_m0 = df_finra.set_index('effective_trading_month')['finraToM0'].to_dict()
signal_map_cape = df_finra.set_index('effective_trading_month')['cape'].to_dict()

sim_returns['finraToM0'] = sim_returns['trading_month'].map(signal_map_m0)
sim_returns['cape'] = sim_returns['trading_month'].map(signal_map_cape)

sim_returns['finraToM0'] = sim_returns['finraToM0'].ffill()
sim_returns['cape'] = sim_returns['cape'].ffill()

sim_returns = sim_returns[sim_returns['Date'] >= '1999-03-01'].reset_index(drop=True)
sim_returns = sim_returns.dropna(subset=['finraToM0', 'cape']).reset_index(drop=True)

YELLOW_TH = 0.24
RED_TH = 0.41
BUY_SPEED = 1/4  # 0.25
SELL_SPEED = 1/10 # 0.10

def run_strategy(df, base_ticker, lev_ticker, cash_ticker, target_lev_weight=0.5, target_base_weight=0.5):
    nav_series = []
    nav = 100000.0
    w_lev = 0.0
    w_base = 0.0
    w_cash = 1.0
    
    current_month = None
    trend_state = 'GREEN'
    
    for i, row in df.iterrows():
        n_lev = nav * w_lev * (1 + row[lev_ticker])
        n_base = nav * w_base * (1 + row[base_ticker])
        n_cash = nav * w_cash * (1 + row[cash_ticker])
        nav = n_lev + n_base + n_cash
        
        if nav > 0:
            w_lev = n_lev / nav
            w_base = n_base / nav
            w_cash = n_cash / nav
            
        month = row['trading_month']
        if current_month is None or month != current_month:
            current_month = month
            signal = row['finraToM0']
            cape = row['cape']
            
            is_red_signal = False
            if signal > 0.45:
                is_red_signal = True
            elif signal > RED_TH and cape > 30:
                is_red_signal = True
                
            is_green_signal = (signal < YELLOW_TH)
            
            if is_red_signal:
                trend_state = 'RED'
            elif is_green_signal:
                trend_state = 'GREEN'
                
            # Execute logic based on trend_state
            if trend_state == 'RED':
                # Continue selling until fully cleared or state changes to GREEN
                shift = SELL_SPEED
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, shift)
                    ratio_lev = w_lev / w_eq
                    ratio_base = w_base / w_eq
                    w_lev -= trade_amt * ratio_lev
                    w_base -= trade_amt * ratio_base
                    w_cash += trade_amt
            elif trend_state == 'GREEN' and not is_green_signal:
                # State is GREEN, but signal is in YELLOW zone (>= 0.24 and not RED)
                shift = BUY_SPEED
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_base += trade_amt
            elif trend_state == 'GREEN' and is_green_signal:
                # State is GREEN, and signal is < 0.24
                shift = BUY_SPEED
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_lev += trade_amt * target_lev_weight
                    w_base += trade_amt * target_base_weight
                    
        nav_series.append(nav)
    
    return pd.Series(nav_series)

s4_nav = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', target_lev_weight=0.5, target_base_weight=0.5)

def get_stats(nav_series):
    initial = nav_series.iloc[0]
    final = nav_series.iloc[-1]
    ret = (final / initial) - 1
    
    running_max = nav_series.cummax()
    drawdown = (nav_series - running_max) / running_max
    max_dd = drawdown.min()
    
    years = len(nav_series) / 252
    cagr = (final / initial) ** (1/years) - 1
    return ret, cagr, max_dd, final, drawdown

ret, cagr, max_dd, final, drawdown = get_stats(s4_nav)

max_dd_idx = drawdown.idxmin()
date_of_max_dd = sim_returns.loc[max_dd_idx, 'Date']

print("=== BACKTEST RESULTS (CONTINUOUS CLEARANCE) ===")
print(f"Final Nav: ${final:,.0f}")
print(f"CAGR: {cagr*100:.2f}%")
print(f"Max DD: {max_dd*100:.2f}% (occurred on {date_of_max_dd.strftime('%Y-%m-%d')})")
print(f"Total Return: {ret*100:.0f}%")
print("---")
