import json
with open('public/data/strategy_data.json', 'r') as f:
    data = json.load(f)
for row in data:
    month = row.get('month', '')
    if month.startswith('2007') or month.startswith('2008') or month.startswith('2009'):
        if 'finraToM0' in row:
            print(f"{month} | FINRA/M0: {row['finraToM0']:.4f} | CAPE: {row.get('cape', 0):.2f}")
