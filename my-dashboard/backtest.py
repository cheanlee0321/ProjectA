import json
import yfinance as yf
import pandas as pd
import numpy as np

# Load FINRA data
with open('public/data/strategy_data.json', 'r') as f:
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

# Download QQQ and SPY starting from that date
start_date = min_month.strftime('%Y-%m-%d')
end_date = '2026-04-30'

print(f"Downloading QQQ and SPY from {start_date} to {end_date}...")
raw_data = yf.download(['QQQ', 'SPY'], start=start_date, end=end_date)
if 'Adj Close' in raw_data.columns.get_level_values(0):
    prices = raw_data['Adj Close']
else:
    prices = raw_data['Close']
    if isinstance(prices.columns, pd.MultiIndex):
        prices.columns = prices.columns.get_level_values(1)

# Calculate daily returns
returns = prices.pct_change().dropna()

# We need to simulate 3x daily return
sim_returns = returns.copy()
sim_returns['TQQQ_sim'] = returns['QQQ'] * 3
sim_returns['UPRO_sim'] = returns['SPY'] * 3

# Also simulate SHV (Cash proxy). Just assume 2% annual return for simplicity
sim_returns['SHV_sim'] = (1.02) ** (1/252) - 1

# Now we construct a daily signal
# The finraToM0 value for a month is published at the END of the month (or with a lag).
# We'll assume the signal of "1999-01" is available at the end of Jan 1999, so it applies to Feb 1999.
# The user's note says: FINRA 數據約有 3~4 週落後. 
# But for a standard backtest, we can assume the value of month M applies to month M+1 or M+2.
# Let's apply a 1-month delay: Signal of 1999-01 affects trading from 1999-03-01.

# Let's map daily dates to their signal
sim_returns = sim_returns.reset_index()
# get year and month of the trading day
sim_returns['trading_month'] = sim_returns['Date'].dt.to_period('M')

df_finra['finra_month'] = df_finra['month_dt'].dt.to_period('M')
sim_returns_raw = sim_returns.copy()

def prepare_sim_returns(delay_months):
    sim_returns_loop = sim_returns_raw.copy()
    # delay_months = 0 means finra_month + 2 (standard 1-month publication lag)
    df_finra['effective_trading_month'] = df_finra['finra_month'] + 2 + delay_months
    
    signal_map = df_finra.set_index('effective_trading_month')['finraToM0'].to_dict()
    
    sim_returns_loop['finraToM0'] = sim_returns_loop['trading_month'].map(signal_map)
    sim_returns_loop['finraToM0'] = sim_returns_loop['finraToM0'].ffill()
    
    sim_returns_loop = sim_returns_loop.dropna(subset=['finraToM0']).reset_index(drop=True)
    return sim_returns_loop

sim_returns = prepare_sim_returns(0)


print(f"Backtest period: {sim_returns['Date'].min().strftime('%Y-%m-%d')} to {sim_returns['Date'].max().strftime('%Y-%m-%d')}")

# Run backtest for QQQ / TQQQ
def run_backtest(df, base_ticker, lev_ticker, cash_ticker):
    # Strategy parameters
    # Green: < 0.30 -> buy lev_ticker over 10 months
    # Yellow: 0.30 - 0.40 -> buy base_ticker
    # Red: > 0.40 -> sell all over 10 months to cash_ticker
    
    # We will track portfolio values daily
    cash_val = 100000.0
    lev_val = 0.0
    base_val = 0.0
    
    # 10 month trading rule means 10% of target portfolio shift per month.
    # To implement this easily on daily data: 
    # When signal changes to RED, we want to shift 10% of equity to cash every month.
    # Actually, the user says "分 10 個月買入".
    # Let's do a simplified version: 
    # At the first day of each month, we check the signal.
    # If RED: shift 10% of total portfolio value from equity to cash.
    # If GREEN: shift 10% of total portfolio value from cash to equity.
    # If YELLOW: any cash being deployed goes to base_ticker instead of lev_ticker. Wait, user says "停止加碼槓桿，持續買入1倍指數".
    
    # For a lump sum backtest (like the page $100k):
    # Start with 100k cash.
    # Target weights:
    # Green: 100% Lev (or 50/50). Shift +10% per month towards target.
    # Yellow: 100% Base (for new cash). Let's say target is 100% Base. Shift +10% per month towards target. But "已持有不需急於賣出", so we don't sell Lev.
    # Red: 100% Cash. Shift -10% equity per month towards Cash.
    
    # Let's keep it simple: simulate the 5 scenarios.
    
    # Scenario 1: All-in Base (QQQ/SPY)
    df['S1_Ret'] = df[base_ticker]
    df['S1_Nav'] = 100000 * (1 + df['S1_Ret']).cumprod()
    
    # Scenario 2: All-in Lev (TQQQ/UPRO)
    df['S2_Ret'] = df[lev_ticker]
    df['S2_Nav'] = 100000 * (1 + df['S2_Ret']).cumprod()
    
    # Scenario 3: Strategy 100% Base
    # Scenario 4: Strategy 50/50
    # Scenario 5: Strategy 100% Lev
    
    # Let's do a daily simulation for Strategy 5 (100% Lev)
    nav_s5 = []
    nav = 100000.0
    weight_lev = 0.0
    weight_cash = 1.0
    
    current_month = None
    trend_state = 'GREEN'
    
    for i, row in df.iterrows():
        # Apply daily return
        nav_lev = nav * weight_lev * (1 + row[lev_ticker])
        nav_cash = nav * weight_cash * (1 + row[cash_ticker])
        nav = nav_lev + nav_cash
        
        # update weights based on new nav
        if nav > 0:
            weight_lev = nav_lev / nav
            weight_cash = nav_cash / nav
            
        # Check if it's a new month to execute trades
        month = row['trading_month']
        if current_month is None or month != current_month:
            current_month = month
            
            signal = row['finraToM0']
            
            if signal > 0.40: # RED
                trend_state = 'RED'
                # shift 10% of total portfolio from lev to cash
                shift = 0.10
                if weight_lev > 0:
                    trade_amt = min(weight_lev, shift)
                    weight_lev -= trade_amt
                    weight_cash += trade_amt
            elif signal < 0.30: # GREEN
                trend_state = 'GREEN'
                # shift 10% of total portfolio from cash to lev
                shift = 0.10
                if weight_cash > 0:
                    trade_amt = min(weight_cash, shift)
                    weight_cash -= trade_amt
                    weight_lev += trade_amt
            else: # YELLOW
                # hold
                pass
                
        nav_s5.append(nav)
        
    df['S5_Nav'] = nav_s5
    
    # Strategy 4 (50/50)
    nav_s4 = []
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
            
            if signal > 0.40: # RED
                trend_state = 'RED'
                # shift 10% of total from equity to cash. Pro-rata from lev and base.
                shift = 0.10
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, shift)
                    ratio_lev = w_lev / w_eq
                    ratio_base = w_base / w_eq
                    w_lev -= trade_amt * ratio_lev
                    w_base -= trade_amt * ratio_base
                    w_cash += trade_amt
            elif signal < 0.30: # GREEN
                trend_state = 'GREEN'
                # shift 10% of total from cash to 50/50 equity
                shift = 0.10
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_lev += trade_amt * 0.5
                    w_base += trade_amt * 0.5
            else: # YELLOW
                if trend_state == 'GREEN':
                    # deploy cash to base only
                    shift = 0.10
                    if w_cash > 0:
                        trade_amt = min(w_cash, shift)
                        w_cash -= trade_amt
                        w_base += trade_amt
                else:
                    # from RED -> YELLOW, do nothing
                    pass
                    
        nav_s4.append(nav)
    df['S4_Nav'] = nav_s4
    
    # Strategy 3 (100% Base)
    nav_s3 = []
    nav = 100000.0
    w_base = 0.0
    w_cash = 1.0
    
    current_month = None
    trend_state = 'GREEN'
    for i, row in df.iterrows():
        n_base = nav * w_base * (1 + row[base_ticker])
        n_cash = nav * w_cash * (1 + row[cash_ticker])
        nav = n_base + n_cash
        
        if nav > 0:
            w_base = n_base / nav
            w_cash = n_cash / nav
            
        month = row['trading_month']
        if current_month is None or month != current_month:
            current_month = month
            signal = row['finraToM0']
            
            if signal > 0.40: # RED
                trend_state = 'RED'
                shift = 0.10
                if w_base > 0:
                    trade_amt = min(w_base, shift)
                    w_base -= trade_amt
                    w_cash += trade_amt
            elif signal < 0.30: # GREEN
                trend_state = 'GREEN'
                shift = 0.10
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_base += trade_amt
            else: # YELLOW
                if trend_state == 'GREEN':
                    shift = 0.10
                    if w_cash > 0:
                        trade_amt = min(w_cash, shift)
                        w_cash -= trade_amt
                        w_base += trade_amt
                else:
                    pass
                    
        nav_s3.append(nav)
    df['S3_Nav'] = nav_s3

    return df

res = run_backtest(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim')

def get_stats(nav_series):
    initial = nav_series.iloc[0]
    final = nav_series.iloc[-1]
    ret = (final / initial) - 1
    
    running_max = nav_series.cummax()
    drawdown = (nav_series - running_max) / running_max
    max_dd = drawdown.min()
    
    years = len(nav_series) / 252
    cagr = (final / initial) ** (1/years) - 1
    return ret, cagr, max_dd

for d in [0, 1, 2]:
    print(f"\n========== DELAY {d} ==========")
    sim_returns = prepare_sim_returns(d)
    
    res = run_backtest(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim')
    for s_name, col in [("3. 100% QQQ", "S3_Nav"), ("4. 50/50 QQQ", "S4_Nav"), ("5. 100% TQQQ", "S5_Nav")]:
        ret, cagr, max_dd = get_stats(res[col])
        print(f"QQQ - {s_name}: Total Return: {ret*100:.0f}%, Max DD: {max_dd*100:.2f}%")
        
    res_spy = run_backtest(sim_returns, 'SPY', 'UPRO_sim', 'SHV_sim')
    for s_name, col in [("3. 100% SPY", "S3_Nav"), ("4. 50/50 SPY", "S4_Nav"), ("5. 100% UPRO", "S5_Nav")]:
        ret, cagr, max_dd = get_stats(res_spy[col])
        print(f"SPY - {s_name}: Total Return: {ret*100:.0f}%, Max DD: {max_dd*100:.2f}%")


