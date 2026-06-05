import pandas as pd
import os

data_dir = r"C:\Users\chean\OneDrive\Desktop\Antigravity\ProjectA\Data"

print("--- M0_Historical_Data.csv ---")
df_m0 = pd.read_csv(os.path.join(data_dir, "M0_Historical_Data.csv"))
print(df_m0.head())

print("\n--- SP500.csv ---")
df_sp500 = pd.read_csv(os.path.join(data_dir, "SP500.csv"))
print(df_sp500.head())

print("\n--- FINRA-margin-statistics.xlsx ---")
try:
    df_finra = pd.read_excel(os.path.join(data_dir, "FINRA-margin-statistics.xlsx"))
    print(df_finra.head())
except Exception as e:
    print(f"Error reading excel: {e}")

