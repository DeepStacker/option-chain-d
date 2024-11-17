import os
import requests
from Utils import Utils
import json
from reversal import reversal_calculator


class Urls:
    url = "https://scanx.dhan.co/scanx/optchain"
    spot_url = "https://scanx.dhan.co/scanx/rtscrdt"
    fut_url = "https://scanx.dhan.co/scanx/futoptsum"
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.7",
        "auth": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwiZW50aXR5X2lkIjoiNzIwOTY4MzY5OSIsImV4cCI6MTcyOTY2NDExOH0.FW9TPQpbz6zeFLcHn3_eVOXzxHi_rqm9DtpubtdKbLEaujwkcXZPc6tu_JP6pWS448u6vRPoRDXSmC2i1viQaw",
        "content-type": "application/json",
        "origin": "https://web.dhan.co",
        "referer": "https://web.dhan.co/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    }

    symbol_list = {
        "NIFTY": 13,
        "BANKNIFTY": 25,
        "FINNIFTY": 27,
        "MIDCPNIFTY": 442,
        "NIFTYNXT50": 38,
        "SENSEX": 51,
        "BANKEX": 69,
        "CRUDEOIL": 294,
        "ADANIENT": 25,
        "ADANIPORTS": 15083,
        "APOLLOHOSP": 157,
        "ASIANPAINT": 236,
        "AXISBANK": 5900,
        "BAJAJ-AUTO": 16669,
        "BAJFINANCE": 317,
        "BAJAJFINSV": 16675,
        "BEL": 383,
        "BPCL": 526,
        "BHARTIARTL": 10604,
        "BRITANNIA": 547,
        "CIPLA": 694,
        "COALINDIA": 20374,
        "DRREDDY": 881,
        "EICHERMOT": 910,
        "GRASIM": 1232,
        "HCLTECH": 7229,
        "HDFCBANK": 1333,
        "HDFCLIFE": 467,
        "HEROMOTOCO": 1348,
        "HINDALCO": 1363,
        "HINDUNILVR": 1394,
        "ICICIBANK": 4963,
        "ITC": 1660,
        "INDUSINDBK": 5258,
        "INFY": 1594,
        "JSWSTEEL": 11723,
        "KOTAKBANK": 1922,
        "LT": 11483,
        "MM": 2031,
        "MARUTI": 10999,
        "NTPC": 11630,
        "NESTLEIND": 17963,
        "ONGC": 2475,
        "POWERGRID": 14977,
        "RELIANCE": 2885,
        "SBILIFE": 21808,
        "SHRIRAMFIN": 4306,
        "SBIN": 3045,
        "SUNPHARMA": 3351,
        "TCS": 11536,
        "TATACONSUM": 3432,
        "TATAMOTORS": 3456,
        "TATASTEEL": 3499,
        "TECHM": 13538,
        "TITAN": 3506,
        "TRENT": 1964,
        "ULTRACEMCO": 11532,
        "WIPRO": 3787,
    }
    seg_list = {
        "CRUDEOIL": 5,
        "NIFTY": 0,
        "BANKNIFTY": 0,
        "FINNIFTY": 0,
        "MIDCPNIFTY": 0,
        "NIFTYNXT50": 0,
        "SENSEX": 0,
        "BANKEX": 0,
        "SHRIRAMFIN": 1,
        "MM": 1,
        "HDFCLIFE": 1,
        "DIVISLAB": 1,
        "LT": 1,
        "ADANIENT": 1,
        "ADANIPORTS": 1,
        "APOLLOHOSP": 1,
        "ASIANPAINT": 1,
        "AXISBANK": 1,
        "BAJAJ-AUTO": 1,
        "BAJFINANCE": 1,
        "BAJAJFINSV": 1,
        "BEL": 1,
        "BPCL": 1,
        "BHARTIARTL": 1,
        "BRITANNIA": 1,
        "CIPLA": 1,
        "COALINDIA": 1,
        "DRREDDY": 1,
        "EICHERMOT": 1,
        "GRASIM": 1,
        "HCLTECH": 1,
        "HDFCBANK": 1,
        "HDFCLIFE": 1,
        "HEROMOTOCO": 1,
        "HINDALCO": 1,
        "HINDUNILVR": 1,
        "ICICIBANK": 1,
        "ITC": 1,
        "INDUSINDBK": 1,
        "INFY": 1,
        "JSWSTEEL": 1,
        "KOTAKBANK": 1,
        "LT": 1,
        "MARUTI": 1,
        "NTPC": 1,
        "NESTLEIND": 1,
        "ONGC": 1,
        "POWERGRID": 1,
        "RELIANCE": 1,
        "SBILIFE": 1,
        "SHRIRAMFIN": 1,
        "SBIN": 1,
        "SUNPHARMA": 1,
        "TCS": 1,
        "TATACONSUM": 1,
        "TATAMOTORS": 1,
        "TATASTEEL": 1,
        "TECHM": 1,
        "TITAN": 1,
        "TRENT": 1,
        "ULTRACEMCO": 1,
        "WIPRO": 1,
    }

    @staticmethod
    def create_payload(symbol, exp, seg):
        return {"Data": {"Seg": seg, "Sid": symbol, "Exp": exp}}

    @staticmethod
    def create_spot_payload(symbol, seg):
        return {"Data": {"Seg": seg, "Secid": symbol}}

    @staticmethod
    def create_fut_payload(symbol, seg):
        return {"Data": {"Seg": seg, "Sid": symbol}}

    @staticmethod
    def fetch_expiry(symbol, seg):
        fut_response = requests.post(
            Urls.fut_url,
            headers=Urls.headers,
            json=Urls.create_fut_payload(symbol, seg),
        )
        fut_response.raise_for_status()
        fut_data = fut_response.json()
        return Utils.filter_fut_data(fut_data)

    @staticmethod
    def fetch_fut_data(symbol, seg):
        fut_response = requests.post(
            Urls.fut_url,
            headers=Urls.headers,
            json=Urls.create_fut_payload(symbol, seg),
        )
        fut_response.raise_for_status()
        fut_data = fut_response.json()
        return fut_data

    @staticmethod
    def fetch_data(symbol, exp, seg):
        # print()
        # print(f"Fetching data for symbol: {symbol}, exp: {exp}, seg: {seg}")
        # print()
        response = requests.post(
            Urls.url, headers=Urls.headers, json=Urls.create_payload(symbol, exp, seg)
        )
        spot_response = requests.post(
            Urls.spot_url,
            headers=Urls.headers,
            json=Urls.create_spot_payload(symbol, seg),
        )

        response.raise_for_status()
        spot_response.raise_for_status()

        # print(response.json())

        manipulated_data = Utils.modify_oc_keys(response.json())
        option_chain = manipulated_data["data"]["oc"]
        atm_price = spot_response.json()["data"]["Ltp"]
        result = Utils.find_strikes(option_chain, atm_price)

        filtered_data = {
            key: value for key, value in option_chain.items() if int(key) in result
        }
        manipulated_data["data"]["oc"] = filtered_data
        manipulated_data = Utils.fetch_percentage(manipulated_data)
        manipulated_data = reversal_calculator(manipulated_data, exp)

        fut_data = Urls.fetch_expiry(symbol, seg)

        # with open('data.json', 'w') as file:
        #     json.dump(manipulated_data, file, indent=4)

        return manipulated_data, spot_response.json(), fut_data
