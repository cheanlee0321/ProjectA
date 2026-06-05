import urllib.request
import os

url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=BOGMBASE"
dest = r"C:\Users\chean\OneDrive\Desktop\Antigravity\ProjectA\Data\M0_Historical_Data.csv"

try:
    print(f"Downloading M0 data from {url}...")
    urllib.request.urlretrieve(url, dest)
    print(f"Successfully downloaded to {dest}")
except Exception as e:
    print(f"Error downloading: {e}")
