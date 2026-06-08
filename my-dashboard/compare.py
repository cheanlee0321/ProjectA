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

YELLOW_TH = 0.24
RED_TH = 0.41
BUY_SPEED = 1/4
SELL_SPEED = 1/10

def run_orig(df):
    nav = 100000.0
    w_lev, w_base, w_cash = 0.0, 0.0, 1.0
    current_month = None
    trend_state = 'GREEN'
    res = []
    for i, row in df.iterrows():
        n_lev = nav * w_lev * (1 + row['TQQQ_sim'])
        n_base = nav * w_base * (1 + row['QQQ'])
        n_cash = nav * w_cash * (1 + row['SHV_sim'])
        nav = n_lev + n_base + n_cash
        if nav > 0:
            w_lev, w_base, w_cash = n_lev/nav, n_base/nav, n_cash/nav
        month = row['trading_month']
        if current_month is None or month != current_month:
            current_month = month
            signal = row['finraToM0']
            if signal > RED_TH:
                trend_state = 'RED'
                shift = SELL_SPEED
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, shift)
                    w_lev -= trade_amt * (w_lev/w_eq)
                    w_base -= trade_amt * (w_base/w_eq)
                    w_cash += trade_amt
            elif signal < YELLOW_TH:
                trend_state = 'GREEN'
                shift = BUY_SPEED
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_lev += trade_amt * 0.5
                    w_base += trade_amt * 0.5
            else:
                if trend_state == 'GREEN':
                    shift = BUY_SPEED
                    if w_cash > 0:
                        trade_amt = min(w_cash, shift)
                        w_cash -= trade_amt
                        w_base += trade_amt
                else:
                    pass
        res.append((row['Date'], nav, trend_state, w_lev, w_base, w_cash))
    return pd.DataFrame(res, columns=['Date', 'Nav', 'State', 'W_Lev', 'W_Base', 'W_Cash'])

def run_pure(df):
    nav = 100000.0
    w_lev, w_base, w_cash = 0.0, 0.0, 1.0
    current_month = None
    trend_state = 'GREEN'
    res = []
    for i, row in df.iterrows():
        n_lev = nav * w_lev * (1 + row['TQQQ_sim'])
        n_base = nav * w_base * (1 + row['QQQ'])
        n_cash = nav * w_cash * (1 + row['SHV_sim'])
        nav = n_lev + n_base + n_cash
        if nav > 0:
            w_lev, w_base, w_cash = n_lev/nav, n_base/nav, n_cash/nav
        month = row['trading_month']
        if current_month is None or month != current_month:
            current_month = month
            signal = row['finraToM0']
            if signal > RED_TH: trend_state = 'RED'
            elif signal < YELLOW_TH: trend_state = 'GREEN'
            
            if trend_state == 'RED':
                shift = SELL_SPEED
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, shift)
                    w_lev -= trade_amt * (w_lev/w_eq)
                    w_base -= trade_amt * (w_base/w_eq)
                    w_cash += trade_amt
            elif trend_state == 'GREEN':
                shift = BUY_SPEED
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_lev += trade_amt * 0.5
                    w_base += trade_amt * 0.5
        res.append((row['Date'], nav, trend_state, w_lev, w_base, w_cash))
    return pd.DataFrame(res, columns=['Date', 'Nav', 'State', 'W_Lev', 'W_Base', 'W_Cash'])

df_orig = run_orig(sim_returns)
df_pure = run_pure(sim_returns)

df_orig['Year'] = df_orig['Date'].dt.year
df_pure['Year'] = df_pure['Date'].dt.year

print("End of Year Nav Comparison:")
print("Year | Orig Nav | Pure Nav | Ratio | Orig_State | Pure_State | Orig_Lev% | Pure_Lev%")
for year in df_orig['Year'].unique():
    last_orig = df_orig[df_orig['Year'] == year].iloc[-1]
    last_pure = df_pure[df_pure['Year'] == year].iloc[-1]
    ratio = last_orig['Nav'] / last_pure['Nav']
    print(f"{year} | ${last_orig['Nav']:>10,.0f} | ${last_pure['Nav']:>10,.0f} | {ratio:.2f}x | {last_orig['State']:<5} | {last_pure['State']:<5} | {last_orig['W_Lev']*100:>5.1f}% | {last_pure['W_Lev']*100:>5.1f}%")
