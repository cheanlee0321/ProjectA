import json
import yfinance as yf
import pandas as pd
import numpy as np

# Load FINRA data
with open('public/data/strategy_data.json', 'r') as f:
    strategy_data = json.load(f)

df_finra = pd.DataFrame(strategy_data)
df_finra = df_finra.dropna(subset=['finraToM0']).copy()
df_finra['month_dt'] = pd.to_datetime(df_finra['month'])
df_finra = df_finra.sort_values('month_dt').reset_index(drop=True)

# 1999-01 is the start of FINRA, applying 1 month delay means starting trading in 1999-03
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
sim_returns['QLD_sim'] = returns['QQQ'] * 2
sim_returns['SHV_sim'] = (1.02) ** (1/252) - 1

sim_returns = sim_returns.reset_index()
sim_returns['trading_month'] = sim_returns['Date'].dt.to_period('M')
df_finra['finra_month'] = df_finra['month_dt'].dt.to_period('M')

# 1 month delay (delay_months = 1 => finra_month + 3? Wait, the old code had + 2 + delay_months.
# Let's see: FINRA 1999-01 (published end of Feb) + 1 month delay = effective 1999-03.
# 1999-01 + 2 = 1999-03. So delay_months = 0 was effective 1999-03. 
# Wait, user said "1個月延遲". The original text said "FINRA數據約有3~4週落後, +1月延遲".
# Let's use `finra_month + 2 + 0` which is exactly 1 month delay from publication.
df_finra['effective_trading_month'] = df_finra['finra_month'] + 2

signal_map = df_finra.set_index('effective_trading_month')['finraToM0'].to_dict()
sim_returns['finraToM0'] = sim_returns['trading_month'].map(signal_map)
sim_returns['finraToM0'] = sim_returns['finraToM0'].ffill()

# Filter to start from 1999-03-01
sim_returns = sim_returns[sim_returns['Date'] >= '1999-03-01'].reset_index(drop=True)
sim_returns = sim_returns.dropna(subset=['finraToM0']).reset_index(drop=True)

YELLOW_TH = 0.24
RED_TH = 0.41
BUY_SPEED = 1/4  # 0.25
SELL_SPEED = 1/10 # 0.10

def run_strategy(df, base_ticker, lev_ticker, cash_ticker, target_lev_weight=1.0, target_base_weight=0.0):
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
            
            if signal > RED_TH: # RED
                trend_state = 'RED'
                # Sell 10% of total portfolio from equity to cash
                shift = SELL_SPEED
                w_eq = w_lev + w_base
                if w_eq > 0:
                    trade_amt = min(w_eq, shift)
                    ratio_lev = w_lev / w_eq
                    ratio_base = w_base / w_eq
                    w_lev -= trade_amt * ratio_lev
                    w_base -= trade_amt * ratio_base
                    w_cash += trade_amt
            elif signal < YELLOW_TH: # GREEN
                trend_state = 'GREEN'
                # Buy 25% of total portfolio from cash to equity target
                shift = BUY_SPEED
                if w_cash > 0:
                    trade_amt = min(w_cash, shift)
                    w_cash -= trade_amt
                    w_lev += trade_amt * target_lev_weight
                    w_base += trade_amt * target_base_weight
            else: # YELLOW
                if trend_state == 'GREEN':
                    # Shift cash to base only, using BUY_SPEED
                    shift = BUY_SPEED
                    if w_cash > 0:
                        trade_amt = min(w_cash, shift)
                        w_cash -= trade_amt
                        w_base += trade_amt
                else:
                    # from RED -> YELLOW, hold
                    pass
                    
        nav_series.append(nav)
    return pd.Series(nav_series)

# 1. 無腦 All-in QQQ (Buy & Hold)
s1_nav = 100000 * (1 + sim_returns['QQQ']).cumprod()
# 2. 無腦 All-in TQQQ (模擬)
s2_nav = 100000 * (1 + sim_returns['TQQQ_sim']).cumprod()
# 3. 策略 100% QQQ
s3_nav = run_strategy(sim_returns, 'QQQ', 'QQQ', 'SHV_sim', target_lev_weight=0.0, target_base_weight=1.0)
# 4. 50% QQQ / 50% TQQQ
s4_nav = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', target_lev_weight=0.5, target_base_weight=0.5)
# 5. 100% QLD
s5_nav = run_strategy(sim_returns, 'QQQ', 'QLD_sim', 'SHV_sim', target_lev_weight=1.0, target_base_weight=0.0)
# 6. 100% TQQQ
s6_nav = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', target_lev_weight=1.0, target_base_weight=0.0)

def get_stats(nav_series):
    initial = nav_series.iloc[0]
    final = nav_series.iloc[-1]
    ret = (final / initial) - 1
    
    running_max = nav_series.cummax()
    drawdown = (nav_series - running_max) / running_max
    max_dd = drawdown.min()
    
    years = len(nav_series) / 252
    cagr = (final / initial) ** (1/years) - 1
    return ret, cagr, max_dd, final

results = [
    ("1. 無腦 All-in QQQ", get_stats(s1_nav)),
    ("2. 無腦 All-in TQQQ", get_stats(s2_nav)),
    ("3. 策略 100% QQQ", get_stats(s3_nav)),
    ("4. 策略 50% QQQ / 50% TQQQ", get_stats(s4_nav)),
    ("5. 策略 100% QLD", get_stats(s5_nav)),
    ("6. 策略 100% TQQQ", get_stats(s6_nav))
]

print("=== BACKTEST RESULTS ===")
for name, (ret, cagr, max_dd, final) in results:
    print(f"{name}:")
    print(f"  Final Nav: ${final:,.0f}")
    print(f"  CAGR: {cagr*100:.2f}%")
    print(f"  Max DD: {max_dd*100:.2f}%")
    print(f"  Total Return: {ret*100:.0f}%")
    print("---")
