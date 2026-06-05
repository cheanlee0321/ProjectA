import pandas as pd
import numpy as np

# We'll just run the script and filter sim_returns
with open("backtest.py", "r", encoding='utf8') as f:
    code = f.read()

# We need to run the data fetching logic, then filter sim_returns to start from '2010-02-11'
code += """
sim_returns_raw = sim_returns_raw[sim_returns_raw['Date'] >= '2010-02-11'].copy().reset_index(drop=True)

sim_returns_d0 = prepare_sim_returns(0)
res_qqq = run_backtest(sim_returns_d0.copy(), 'QQQ', 'TQQQ_sim', 'SHV_sim')
res_spy = run_backtest(sim_returns_d0.copy(), 'SPY', 'UPRO_sim', 'SHV_sim')

def print_stats(nav_series, name):
    initial = nav_series.iloc[0]
    final = nav_series.iloc[-1]
    ret = (final / initial) - 1
    
    running_max = nav_series.cummax()
    drawdown = (nav_series - running_max) / running_max
    max_dd = drawdown.min()
    
    years = len(nav_series) / 252
    cagr = (final / initial) ** (1/years) - 1
    
    print(f"{name}: Final: ${final:,.0f}, Total Return: {ret*100:.2f}%, CAGR: {cagr*100:.2f}%, Max DD: {max_dd*100:.2f}%")

print("--- 2010-2026 QQQ ---")
print_stats(res_qqq['S1_Nav'], "1. QQQ Buy & Hold")
print_stats(res_qqq['S2_Nav'], "2. TQQQ Buy & Hold")
print_stats(res_qqq['S3_Nav'], "3. Strategy 100% QQQ")
print_stats(res_qqq['S4_Nav'], "4. Strategy 50/50")
print_stats(res_qqq['S5_Nav'], "5. Strategy 100% TQQQ")

print("--- 2010-2026 SPY ---")
print_stats(res_spy['S1_Nav'], "1. SPY Buy & Hold")
print_stats(res_spy['S2_Nav'], "2. UPRO Buy & Hold")
print_stats(res_spy['S3_Nav'], "3. Strategy 100% SPY")
print_stats(res_spy['S4_Nav'], "4. Strategy 50/50")
print_stats(res_spy['S5_Nav'], "5. Strategy 100% UPRO")
"""

with open("backtest_2010.py", "w", encoding='utf8') as f:
    f.write(code)
