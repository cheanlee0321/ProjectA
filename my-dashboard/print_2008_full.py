import json
import pandas as pd

with open('public/data/strategy_data.json', 'r') as f:
    data = json.load(f)

# Let's get QQQ prices to show the market context
import yfinance as yf
qqq = yf.download('QQQ', start='2007-01-01', end='2012-12-31', interval='1mo')
# Get month-end prices
if 'Adj Close' in qqq.columns.get_level_values(0):
    prices = qqq['Adj Close']
else:
    prices = qqq['Close']
if isinstance(prices.columns, pd.MultiIndex):
    prices.columns = prices.columns.get_level_values(1)
prices = prices['QQQ']
prices.index = prices.index.to_period('M')

for row in data:
    month = row.get('month', '')
    if '2007' <= month[:4] <= '2012':
        if 'finraToM0' in row:
            finra = row['finraToM0']
            p_idx = pd.Period(month, 'M')
            try:
                price = prices.loc[p_idx]
            except KeyError:
                price = 0
            print(f"{month} | FINRA: {finra:.4f} | QQQ: ${price:.2f}")
