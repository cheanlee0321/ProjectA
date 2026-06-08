import pandas as pd
from backtest_2010 import prepare_sim_returns, run_backtest

sim_returns = prepare_sim_returns(0)
res = run_backtest(sim_returns, 'QQQ', 'TQQQ_sim', 'SHV_sim')

for name, col in [("100% QQQ", "S1_Nav"), ("100% TQQQ", "S2_Nav"), ("50% QQQ / 50% TQQQ (Strategy)", "S4_Nav")]:
    nav_series = res[col]
    running_max = nav_series.cummax()
    drawdown = (nav_series - running_max) / running_max
    max_dd = drawdown.min()
    max_dd_idx = drawdown.idxmin()
    date_of_max_dd = res.loc[max_dd_idx, 'Date']
    print(f"2010+ {name} Max DD: {max_dd*100:.2f}% occurred on {date_of_max_dd.strftime('%Y-%m-%d')}")
