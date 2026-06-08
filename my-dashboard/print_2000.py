import json
with open('public/data/strategy_data.json', 'r') as f:
    data = json.load(f)
for row in data:
    month = row.get('month', '')
    if month.startswith('1999') or month.startswith('2000') or month.startswith('2001') or month.startswith('2018') or month.startswith('2022'):
        if 'finraToM0' in row:
            if row['finraToM0'] > 0.41:
                print(f"{month} | FINRA: {row['finraToM0']:.4f} | CAPE: {row.get('cape', 0):.2f}")
