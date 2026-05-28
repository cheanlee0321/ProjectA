import sys
import json
import traceback
from finvizfinance.screener.overview import Overview

def main():
    filters = {}
    if len(sys.argv) > 1:
        try:
            filters = json.loads(sys.argv[1])
        except Exception as e:
            print(json.dumps({"error": f"Failed to parse filters: {str(e)}"}))
            sys.exit(1)
            
    try:
        foverview = Overview()
        
        # If filters are provided, set them. For example: {"Index": "S&P 500", "P/E": "Under 15"}
        if filters:
            foverview.set_filter(filters_dict=filters)
            
        # Get the screener dataframe
        df = foverview.screener_view()
        
        # Take the top 50 results to prevent massive payloads and slow rendering
        if len(df) > 50:
            df = df.head(50)
            
        # Convert DataFrame to JSON string
        result_json = df.to_json(orient='records')
        print(result_json)
        
    except Exception as e:
        # Print error as JSON so Next.js API can parse it
        error_msg = str(e)
        # Check if it's a known Finviz block issue
        if "CAPTCHA" in error_msg or "403" in error_msg:
             error_msg = "Finviz 阻擋了請求 (Rate Limit 或 CAPTCHA)，請稍後再試或檢查您的 IP。"
             
        print(json.dumps({"error": error_msg, "traceback": traceback.format_exc()}))
        sys.exit(1)

if __name__ == "__main__":
    main()
