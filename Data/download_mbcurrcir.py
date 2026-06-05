import urllib.request
import os

url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=MBCURRCIR"
dest = r"C:\Users\chean\OneDrive\Desktop\Antigravity\ProjectA\Data\MBCURRCIR.csv"

try:
    print(f"Downloading MBCURRCIR data from {url}...")
    urllib.request.urlretrieve(url, dest)
    print(f"Successfully downloaded to {dest}")
except Exception as e:
    print(f"Error downloading: {e}")
