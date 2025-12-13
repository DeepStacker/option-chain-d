"""
Dhan API Raw Data Fetcher for NIFTY

This script fetches raw data from all Dhan API endpoints for NIFTY
and saves the responses to JSON files for debugging.

Usage:
    python fetch_dhan_raw_data.py
"""
import requests
import json
import os
from datetime import datetime


# Dhan API Configuration
DHAN_BASE_URL = "https://scanx.dhan.co/scanx"

# Endpoints
OPT_CHAIN_URL = f"{DHAN_BASE_URL}/optchain"
SPOT_URL = f"{DHAN_BASE_URL}/rtscrdt"
FUT_URL = f"{DHAN_BASE_URL}/futoptsum"

# Auth token from .env
AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwiZXhwIjoxNzY1NjEwOTYwLCJjbGllbnRfaWQiOiIxMTAwMjExMTIwIn0.1r3SZvih9FKxzt6VgFdWcvruYtOZDqRPMkvy2AMFAAIYvdUN2DU-9bqrcHd0ijRK_XNC1gwtgSdJg7mU7TRDIw"

# Headers (exactly as in Urls.py)
HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.7",
    "auth": AUTH_TOKEN,
    "content-type": "application/json",
    "origin": "https://web.dhan.co",
    "referer": "https://web.dhan.co/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
}

# Symbol Configuration (from Urls.py)
NIFTY_SID = 13  # Symbol ID for NIFTY
NIFTY_SEG = 0   # Segment for NIFTY (0 = Index)


def save_to_json(data, filename):
    """Save data to JSON file"""
    os.makedirs("raw_dhan_data", exist_ok=True)
    filepath = os.path.join("raw_dhan_data", filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved: {filepath}")
    return filepath


def fetch_futures_data():
    """
    Fetch futures/options summary data
    This returns expiry list and futures data
    Payload: {"Data": {"Seg": 0, "Sid": 13}}
    """
    print("\n" + "="*60)
    print("1. Fetching Futures/Options Summary")
    print("="*60)
    
    payload = {
        "Data": {
            "Seg": NIFTY_SEG,
            "Sid": NIFTY_SID
        }
    }
    
    print(f"URL: {FUT_URL}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(FUT_URL, headers=HEADERS, json=payload, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            save_to_json(data, "1_futures_summary_raw.json")
            
            # Extract expiry list
            try:
                opsum = data.get("data", {}).get("opsum", {})
                expiry_list = [int(exp) for exp in opsum.keys() if exp.isdigit()]
                expiry_list.sort()
                print(f"Found {len(expiry_list)} expiry dates")
                if expiry_list:
                    print(f"First 5 expiries: {expiry_list[:5]}")
                return data, expiry_list
            except Exception as e:
                print(f"Error parsing expiry: {e}")
                return data, []
        else:
            print(f"Error: {response.text[:500]}")
            return None, []
            
    except Exception as e:
        print(f"Request failed: {e}")
        return None, []


def fetch_spot_data():
    """
    Fetch spot/index data
    Payload: {"Data": {"Seg": 0, "Secid": 13}}
    """
    print("\n" + "="*60)
    print("2. Fetching Spot/Index Data")
    print("="*60)
    
    payload = {
        "Data": {
            "Seg": NIFTY_SEG,
            "Secid": NIFTY_SID  # Note: Secid not Sid for spot
        }
    }
    
    print(f"URL: {SPOT_URL}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(SPOT_URL, headers=HEADERS, json=payload, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            save_to_json(data, "2_spot_data_raw.json")
            return data
        else:
            print(f"Error: {response.text[:500]}")
            return None
            
    except Exception as e:
        print(f"Request failed: {e}")
        return None


def fetch_option_chain(expiry):
    """
    Fetch option chain data
    Payload: {"Data": {"Seg": 0, "Sid": 13, "Exp": expiry}}
    """
    print("\n" + "="*60)
    print(f"3. Fetching Option Chain (Expiry: {expiry})")
    print("="*60)
    
    payload = {
        "Data": {
            "Seg": NIFTY_SEG,
            "Sid": NIFTY_SID,
            "Exp": expiry
        }
    }
    
    print(f"URL: {OPT_CHAIN_URL}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(OPT_CHAIN_URL, headers=HEADERS, json=payload, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            save_to_json(data, "3_option_chain_raw.json")
            
            # Print some stats
            try:
                oc = data.get("data", {}).get("oc", {})
                print(f"Number of strikes: {len(oc)}")
                if oc:
                    first_strike = list(oc.keys())[0]
                    print(f"Sample strike key: {first_strike}")
            except Exception as e:
                print(f"Error parsing: {e}")
                
            return data
        else:
            print(f"Error: {response.text[:500]}")
            return None
            
    except Exception as e:
        print(f"Request failed: {e}")
        return None


def main():
    print("\n" + "#"*60)
    print("# DHAN API RAW DATA FETCHER - NIFTY")
    print("#"*60)
    print(f"\nTimestamp: {datetime.now().isoformat()}")
    print(f"Symbol ID: {NIFTY_SID}, Segment: {NIFTY_SEG}")
    
    # 1. Fetch futures summary first (to get expiry list)
    futures_data, expiry_list = fetch_futures_data()
    
    # 2. Fetch spot data
    spot_data = fetch_spot_data()
    
    # 3. Fetch option chain (use first expiry)
    option_data = None
    if expiry_list:
        expiry = expiry_list[0]
        option_data = fetch_option_chain(expiry)
    else:
        print("\n⚠ Skipping option chain - no expiry dates found")
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Futures Summary: {'✓ Success' if futures_data else '✗ Failed'}")
    print(f"Spot Data: {'✓ Success' if spot_data else '✗ Failed'}")
    print(f"Option Chain: {'✓ Success' if option_data else '✗ Failed'}")
    print(f"\nAll files saved to: ./raw_dhan_data/")
    

if __name__ == "__main__":
    main()
