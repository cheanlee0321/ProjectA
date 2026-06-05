import pandas as pd
import numpy as np
import yfinance as yf
import requests
import json
import os

print(os.listdir('Data'))

# Load margin data
try:
    margin = pd.read_excel('Data/margin-statistics.xlsx')
    print("Margin columns:", margin.columns)
    print(margin.head())
except Exception as e:
    print("Error reading margin:", e)
