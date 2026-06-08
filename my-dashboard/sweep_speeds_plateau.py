import json
import yfinance as yf
import pandas as pd
import numpy as np

with open('public/data/strategy_data.json', 'r') as f:
    strategy_data = json.load(f)

df_finra = pd.DataFrame(strategy_data)
df_finra = df_finra.dropna(subset=['finraToM0']).copy()
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

signal_map = df_finra.set_index('effective_trading_month')['finraToM0'].to_dict()
sim_returns['finraToM0'] = sim_returns['trading_month'].map(signal_map)
sim_returns['finraToM0'] = sim_returns['finraToM0'].ffill()

sim_returns = sim_returns[sim_returns['Date'] >= '1999-03-01'].reset_index(drop=True)
sim_returns = sim_returns.dropna(subset=['finraToM0']).reset_index(drop=True)

YELLOW_TH = 0.34
RED_TH = 0.41

def run_strategy(df, buy_speed_months, sell_speed_months):
    nav_series = []
    nav = 100000.0
    w_lev = 0.0
    w_base = 0.0
    w_cash = 1.0
    
    current_month = None
    trend_state = 'GREEN'
    
    buy_speed = 1.0 / buy_speed_months
    sell_speed = 1.0 / sell_speed_months
    
    for i, row in df.iterrows():
        n_lev = nav * w_lev * (1 + row['TQQQ_sim'])
        n_base = nav * w_base * (1 + row['QQQ'])
        n_cash = nav * w_cash * (1 + row['SHV_sim'])
        nav = n_lev + n_base + n_cash
        
        if nav > 0:
            w_lev = n_lev / nav
            w_base = n_base / nav
            w_cash = n_cash / nav
            
        month = row['trading_month']
        if current_month is None or month != current_month:
            current_month = month
            signal = row['finraToM0']
            
            if signal > RED_TH:
                trend_state = 'RED'
                shift = sell_speed
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, shift)
                    ratio_lev = w_lev / w_eq
                    ratio_base = w_base / w_eq
                    w_lev -= trade_amt * ratio_lev
                    w_base -= trade_amt * ratio_base
                    w_cash += trade_amt
            elif signal < YELLOW_TH:
                trend_state = 'GREEN'
                shift = buy_speed
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_lev += trade_amt * 0.5
                    w_base += trade_amt * 0.5
            else:
                if trend_state == 'GREEN':
                    shift = buy_speed
                    if w_cash > 0:
                        trade_amt = min(w_cash, shift)
                        w_cash -= trade_amt
                        w_base += trade_amt
                else:
                    pass
                    
        nav_series.append(nav)
    
    nav_series = pd.Series(nav_series)
    initial = nav_series.iloc[0]
    final = nav_series.iloc[-1]
    ret = (final / initial) - 1
    
    running_max = nav_series.cummax()
    drawdown = (nav_series - running_max) / running_max
    max_dd = drawdown.min()
    
    years = len(nav_series) / 252
    cagr = (final / initial) ** (1/years) - 1
    return cagr, max_dd

speeds = [1, 2, 3, 4, 6, 8, 10, 12, 18, 24]

results = []

for buy in speeds:
    for sell in speeds:
        cagr, max_dd = run_strategy(sim_returns, buy, sell)
        # Using a pseudo-calmar ratio or just storing both
        calmar = cagr / abs(max_dd) if max_dd != 0 else 0
        
        # We will map to X (Sell Speed), Y (Buy Speed), Z (Calmar)
        results.append({
            "buySpeed": buy,
            "sellSpeed": sell,
            "cagr": round(cagr * 100, 2),
            "maxDD": round(max_dd * 100, 2),
            "calmar": round(calmar, 2)
        })

print(json.dumps(results, indent=2))
with open('public/data/plateau_speed_sweep.json', 'w') as f:
    json.dump(results, f, indent=2)

print("Saved to plateau_speed_sweep.json")
