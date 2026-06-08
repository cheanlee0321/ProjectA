import json
with open('public/data/strategy_data.json', 'r') as f:
    data = json.load(f)

count = 0
for row in data:
    if 'finraToM0' in row:
        signal = row['finraToM0']
        cape = row.get('cape', 0)
        # This is the exact condition that gets BLOCKED by the CAPE filter
        if 0.41 < signal <= 0.45 and cape <= 30:
            print(f"{row.get('month', '')} | FINRA: {signal:.4f} | CAPE: {cape:.2f}")
            count += 1
print(f"Total months blocked by CAPE filter: {count}")
