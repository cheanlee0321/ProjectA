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
min_month = df_finra['month_dt'].min()

start_date = min_month.strftime('%Y-%m-%d')
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

df_finra['effective_trading_month'] = df_finra['finra_month'] + 3 # 2 months publication lag + 1 month execution delay

signal_map_m0 = df_finra.set_index('effective_trading_month')['finraToM0'].to_dict()
signal_map_cape = df_finra.set_index('effective_trading_month')['cape'].to_dict()

sim_returns['finraToM0'] = sim_returns['trading_month'].map(signal_map_m0)
sim_returns['cape'] = sim_returns['trading_month'].map(signal_map_cape)

sim_returns['finraToM0'] = sim_returns['finraToM0'].ffill()
sim_returns['cape'] = sim_returns['cape'].ffill()

sim_returns = sim_returns.dropna(subset=['finraToM0', 'cape']).reset_index(drop=True)

nav = 100000.0
w_lev = 0.0
w_base = 0.0
w_cash = 1.0

current_month = None
trend_state = 'GREEN'

nav_history = []

for i, row in sim_returns.iterrows():
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
        cape = row['cape']
        
        if signal > 0.41:
            trend_state = 'RED'
        elif signal < 0.24:
            trend_state = 'GREEN'
        else:
            trend_state = 'YELLOW'
            
        if trend_state == 'RED':
            shift = 0.10
            w_eq = w_lev + w_base
            if w_eq > 0:
                trade_amt = min(w_eq, shift)
                ratio_lev = w_lev / w_eq
                ratio_base = w_base / w_eq
                w_lev -= trade_amt * ratio_lev
                w_base -= trade_amt * ratio_base
                w_cash += trade_amt
        elif trend_state == 'GREEN':
            shift = 0.25
            if w_cash > 0:
                trade_amt = min(w_cash, shift)
                w_cash -= trade_amt
                w_lev += trade_amt * 0.5
                w_base += trade_amt * 0.5
        elif trend_state == 'YELLOW':
            shift = 0.25
            if w_cash > 0:
                trade_amt = min(w_cash, shift)
                w_cash -= trade_amt
                w_base += trade_amt

    nav_history.append(nav)

sim_returns['NAV'] = nav_history

initial = nav_history[0]
final = nav_history[-1]
ret = (final / initial) - 1

nav_series = sim_returns['NAV']
running_max = nav_series.cummax()
drawdown = (nav_series - running_max) / running_max
max_dd = drawdown.min()

years = len(nav_series) / 252
cagr = (final / initial) ** (1/years) - 1

print(f"Backtest period: {sim_returns['Date'].min().strftime('%Y-%m-%d')} to {sim_returns['Date'].max().strftime('%Y-%m-%d')}")
print(f"Final Value: ${final:,.0f}")
print(f"Total Return: {ret*100:.0f}%")
print(f"CAGR: {cagr*100:.2f}%")
print(f"Max DD: {max_dd*100:.2f}%")

max_dd_idx = drawdown.idxmin()
date_of_max_dd = sim_returns.loc[max_dd_idx, 'Date']
print(f"Max DD Date: {date_of_max_dd.strftime('%Y-%m-%d')}")
