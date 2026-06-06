import json
import yfinance as yf
import pandas as pd
import numpy as np
import os

print("Starting 2D speed sensitivity grid search...")

# Load FINRA data
data_path = 'public/data/strategy_data.json'
if not os.path.exists(data_path):
    data_path = '../public/data/strategy_data.json'

with open(data_path, 'r') as f:
    strategy_data = json.load(f)

# Convert to DataFrame
df_finra = pd.DataFrame(strategy_data)
df_finra = df_finra.dropna(subset=['finraToM0']).copy()
df_finra['month_dt'] = pd.to_datetime(df_finra['month'])

# Sort
df_finra = df_finra.sort_values('month_dt').reset_index(drop=True)
min_month = df_finra['month_dt'].min()

# Download QQQ
start_date = min_month.strftime('%Y-%m-%d')
end_date = '2026-04-30'

raw_data = yf.download(['QQQ'], start=start_date, end=end_date)
if 'Adj Close' in raw_data.columns.get_level_values(0):
    prices = raw_data['Adj Close']
else:
    prices = raw_data['Close']
    if isinstance(prices.columns, pd.MultiIndex):
        prices.columns = prices.columns.get_level_values(1)

if isinstance(prices, pd.Series):
    prices = prices.to_frame('QQQ')
elif 'QQQ' not in prices.columns:
    prices = prices.to_frame('QQQ')

returns = prices.pct_change().dropna()
sim_returns = returns.copy()
sim_returns['TQQQ_sim'] = returns['QQQ'] * 3
sim_returns['SHV_sim'] = (1.02) ** (1/252) - 1

sim_returns = sim_returns.reset_index()
sim_returns['trading_month'] = sim_returns['Date'].dt.to_period('M')
df_finra['finra_month'] = df_finra['month_dt'].dt.to_period('M')

sim_returns_raw = sim_returns.copy()

def prepare_sim_returns(delay_months=0):
    sim_returns_loop = sim_returns_raw.copy()
    df_finra['effective_trading_month'] = df_finra['finra_month'] + 2 + delay_months
    signal_map = df_finra.set_index('effective_trading_month')['finraToM0'].to_dict()
    sim_returns_loop['finraToM0'] = sim_returns_loop['trading_month'].map(signal_map)
    sim_returns_loop['finraToM0'] = sim_returns_loop['finraToM0'].ffill()
    sim_returns_loop = sim_returns_loop.dropna(subset=['finraToM0']).reset_index(drop=True)
    return sim_returns_loop

sim_returns = prepare_sim_returns(0)


def run_strategy(df, base_ticker, lev_ticker, cash_ticker, buy_shift=0.10, sell_shift=0.10, mode="50_50"):
    nav_series = []
    nav = 100000.0
    w_lev = 0.0
    w_base = 0.0
    w_cash = 1.0
    current_month = None
    threshold_yellow = 0.30
    threshold_red = 0.40
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
            
            if signal > threshold_red: # RED -> SELL
                trend_state = 'RED'
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, sell_shift)
                    ratio_lev = w_lev / w_eq
                    ratio_base = w_base / w_eq
                    w_lev -= trade_amt * ratio_lev
                    w_base -= trade_amt * ratio_base
                    w_cash += trade_amt
            elif signal < threshold_yellow: # GREEN -> BUY
                trend_state = 'GREEN'
                if w_cash > 0:
                    trade_amt = min(w_cash, buy_shift)
                    w_cash -= trade_amt
                    if mode == "50_50":
                        w_lev += trade_amt * 0.5
                        w_base += trade_amt * 0.5
                    elif mode == "tqqq_100":
                        w_lev += trade_amt
                    elif mode == "qqq_100":
                        w_base += trade_amt
            else: # YELLOW -> BUY BASE
                if trend_state == 'GREEN':
                    if w_cash > 0:
                        trade_amt = min(w_cash, buy_shift)
                        w_cash -= trade_amt
                        w_base += trade_amt
                else:
                    pass
                    
        nav_series.append(nav)
        
    return pd.Series(nav_series)

def get_stats(nav_series):
    initial = nav_series.iloc[0]
    final = nav_series.iloc[-1]
    ret = (final / initial) - 1
    
    running_max = nav_series.cummax()
    drawdown = (nav_series - running_max) / running_max
    max_dd = drawdown.min()
    
    years = len(nav_series) / 252
    cagr = (final / initial) ** (1/years) - 1
    
    calmar = cagr / abs(max_dd) if max_dd < 0 else 0
    
    return {
        "cagr": round(cagr, 4),
        "maxDD": round(max_dd, 4),
        "totalReturn": round(ret * 100, 2),
        "calmar": round(calmar, 4)
    }

# Grid Search ranges
months_range = [1, 2, 3, 4, 6, 8, 10, 12, 15, 18, 24]
results = []

total_runs = len(months_range) * len(months_range)
count = 0

print(f"Running {total_runs} combinations...")
for buy_months in months_range:
    for sell_months in months_range:
        count += 1
        if count % 10 == 0:
            print(f"Processing {count}/{total_runs}...")
            
        buy_shift = 1.0 / buy_months
        sell_shift = 1.0 / sell_months
        
        nav_qqq = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', buy_shift=buy_shift, sell_shift=sell_shift, mode="qqq_100")
        nav_5050 = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', buy_shift=buy_shift, sell_shift=sell_shift, mode="50_50")
        nav_tqqq = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', buy_shift=buy_shift, sell_shift=sell_shift, mode="tqqq_100")
        
        results.append({
            "buy_months": buy_months,
            "sell_months": sell_months,
            "buy_shift": round(buy_shift, 4),
            "sell_shift": round(sell_shift, 4),
            "qqq_100": get_stats(nav_qqq),
            "mix_50_50": get_stats(nav_5050),
            "tqqq_100": get_stats(nav_tqqq)
        })

output_data = {
    "metadata": {
        "period": f"{sim_returns['Date'].min().strftime('%Y-%m')} ~ {sim_returns['Date'].max().strftime('%Y-%m')}",
        "yellow": 0.30,
        "red": 0.40,
        "delay_months": 0
    },
    "results": results
}

out_path = 'public/data/speed_sensitivity.json'
if not os.path.exists('public/data'):
    out_path = '../public/data/speed_sensitivity.json'

with open(out_path, 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"Saved results to {out_path}")
