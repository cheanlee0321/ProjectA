import pandas as pd
from custom_backtest7 import run_strategy, sim_returns

s4_nav = run_strategy(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim', target_lev_weight=0.5, target_base_weight=0.5)

running_max = s4_nav.cummax()
drawdown = (s4_nav - running_max) / running_max

min_dd = drawdown.min()
min_idx = drawdown.idxmin()

start_idx = running_max[:min_idx].idxmax()
# find when it recovered
recovery_idx = -1
for i in range(min_idx, len(s4_nav)):
    if s4_nav.iloc[i] >= running_max.iloc[start_idx]:
        recovery_idx = i
        break

print(f"Max DD: {min_dd*100:.2f}%")
print(f"Start: {sim_returns['Date'].iloc[start_idx]}")
print(f"Bottom: {sim_returns['Date'].iloc[min_idx]}")
if recovery_idx != -1:
    print(f"Recovery: {sim_returns['Date'].iloc[recovery_idx]}")
else:
    print("Never recovered fully.")
