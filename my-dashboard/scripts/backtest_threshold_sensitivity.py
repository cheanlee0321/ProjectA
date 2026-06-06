import json
import yfinance as yf
import pandas as pd
import numpy as np
import os

print("Starting threshold sensitivity backtest...")

# Load FINRA data
data_path = 'public/data/strategy_data.json'
if not os.path.exists(data_path):
    # Try one level up if run from scripts folder
    data_path = '../public/data/strategy_data.json'

with open(data_path, 'r') as f:
    strategy_data = json.load(f)

# Convert to DataFrame
df_finra = pd.DataFrame(strategy_data)
# Ensure we only consider rows with finraToM0
df_finra = df_finra.dropna(subset=['finraToM0']).copy()
df_finra['month_dt'] = pd.to_datetime(df_finra['month'])

# Sort
df_finra = df_finra.sort_values('month_dt').reset_index(drop=True)
min_month = df_finra['month_dt'].min()
print(f"FINRA data starts at {min_month.strftime('%Y-%m')}")

# Download QQQ starting from that date
start_date = min_month.strftime('%Y-%m-%d')
end_date = '2026-04-30'

print(f"Downloading QQQ from {start_date} to {end_date}...")
raw_data = yf.download(['QQQ'], start=start_date, end=end_date)
if 'Adj Close' in raw_data.columns.get_level_values(0):
    prices = raw_data['Adj Close']
else:
    prices = raw_data['Close']
    if isinstance(prices.columns, pd.MultiIndex):
        prices.columns = prices.columns.get_level_values(1)

# Sometimes it comes as a Series if only 1 ticker
if isinstance(prices, pd.Series):
    prices = prices.to_frame('QQQ')
elif 'QQQ' not in prices.columns:
    prices = prices.to_frame('QQQ')

# Calculate daily returns
returns = prices.pct_change().dropna()

# We need to simulate 3x daily return
sim_returns = returns.copy()
sim_returns['TQQQ_sim'] = returns['QQQ'] * 3

# Also simulate SHV (Cash proxy). Just assume 2% annual return for simplicity
sim_returns['SHV_sim'] = (1.02) ** (1/252) - 1

# Let's map daily dates to their signal
sim_returns = sim_returns.reset_index()
# get year and month of the trading day
sim_returns['trading_month'] = sim_returns['Date'].dt.to_period('M')

df_finra['finra_month'] = df_finra['month_dt'].dt.to_period('M')
sim_returns_raw = sim_returns.copy()

def prepare_sim_returns(delay_months=0):
    sim_returns_loop = sim_returns_raw.copy()
    # delay_months = 0 means finra_month + 2 (standard 1-month publication lag)
    df_finra['effective_trading_month'] = df_finra['finra_month'] + 2 + delay_months
    
    signal_map = df_finra.set_index('effective_trading_month')['finraToM0'].to_dict()
    
    sim_returns_loop['finraToM0'] = sim_returns_loop['trading_month'].map(signal_map)
    sim_returns_loop['finraToM0'] = sim_returns_loop['finraToM0'].ffill()
    
    sim_returns_loop = sim_returns_loop.dropna(subset=['finraToM0']).reset_index(drop=True)
    return sim_returns_loop

# Use 0 delay months as standard
sim_returns = prepare_sim_returns(0)
print(f"Backtest period: {sim_returns['Date'].min().strftime('%Y-%m-%d')} to {sim_returns['Date'].max().strftime('%Y-%m-%d')}")


def run_strategy(df, base_ticker, lev_ticker, cash_ticker, threshold_yellow, threshold_red, shift_amount=0.10, mode="50_50"):
    """
    Run backtest with dynamic thresholds.
    mode can be "qqq_100", "50_50", "tqqq_100"
    """
    nav_series = []
    nav = 100000.0
    w_lev = 0.0
    w_base = 0.0
    w_cash = 1.0
    
    current_month = None
    
    # Target allocations based on mode
    # For 100% QQQ, lev is basically base.
    
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
            
            if signal > threshold_red: # RED
                # shift from equity to cash
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, shift_amount)
                    ratio_lev = w_lev / w_eq
                    ratio_base = w_base / w_eq
                    w_lev -= trade_amt * ratio_lev
                    w_base -= trade_amt * ratio_base
                    w_cash += trade_amt
            elif signal < threshold_yellow: # GREEN
                # shift from cash to equity target
                if w_cash > 0:
                    trade_amt = min(w_cash, shift_amount)
                    w_cash -= trade_amt
                    if mode == "50_50":
                        w_lev += trade_amt * 0.5
                        w_base += trade_amt * 0.5
                    elif mode == "tqqq_100":
                        w_lev += trade_amt
                    elif mode == "qqq_100":
                        w_base += trade_amt
            else: # YELLOW
                # deploy cash to base only
                if w_cash > 0:
                    trade_amt = min(w_cash, shift_amount)
                    w_cash -= trade_amt
                    w_base += trade_amt
                    
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

# Scan parameters
yellow_range = [round(x, 2) for x in np.arange(0.20, 0.42, 0.02)]
red_range = [round(x, 2) for x in np.arange(0.25, 0.57, 0.02)]

results = []

print(f"Scanning thresholds... Yellow: {min(yellow_range)}-{max(yellow_range)}, Red: {min(red_range)}-{max(red_range)}")

total_combinations = 0
for yellow in yellow_range:
    for red in red_range:
        if red > yellow:
            total_combinations += 1

print(f"Total valid combinations: {total_combinations}")
count = 0

for yellow in yellow_range:
    for red in red_range:
        if red <= yellow:
            continue
            
        count += 1
        if count % 10 == 0:
            print(f"Processing {count}/{total_combinations}...")
            
        # Run the 3 modes
        nav_qqq = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', yellow, red, mode="qqq_100")
        nav_5050 = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', yellow, red, mode="50_50")
        nav_tqqq = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', yellow, red, mode="tqqq_100")
        
        results.append({
            "yellow": yellow,
            "red": red,
            "qqq_100": get_stats(nav_qqq),
            "mix_50_50": get_stats(nav_5050),
            "tqqq_100": get_stats(nav_tqqq)
        })

output_data = {
    "metadata": {
        "period": f"{sim_returns['Date'].min().strftime('%Y-%m')} ~ {sim_returns['Date'].max().strftime('%Y-%m')}",
        "batch_months": 10,
        "delay_months": 0,
        "yellow_range": [min(yellow_range), max(yellow_range)],
        "red_range": [min(red_range), max(red_range)],
        "step": 0.02
    },
    "results": results
}

out_path = 'public/data/threshold_sensitivity.json'
if not os.path.exists('public/data'):
    out_path = '../public/data/threshold_sensitivity.json'

with open(out_path, 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"Saved results to {out_path}")
