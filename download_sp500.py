import yfinance as yf
import os

data_dir = r"C:\Users\chean\OneDrive\Desktop\Antigravity\ProjectA\Data"
os.makedirs(data_dir, exist_ok=True)

print("Downloading S&P 500 historical data...")
# "^GSPC" is the ticker symbol for S&P 500 on Yahoo Finance
sp500 = yf.Ticker("^GSPC")

# Fetch maximum available historical data
df = sp500.history(period="max")

if not df.empty:
    output_path = os.path.join(data_dir, "SP500_historical_data.csv")
    df.to_csv(output_path)
    print(f"Successfully downloaded and saved {len(df)} rows to {output_path}")
else:
    print("Failed to download data. The dataframe is empty.")
