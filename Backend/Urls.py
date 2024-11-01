import os
import requests
from Utils import Utils
import json


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
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }

    symbol_list = {
        'NIFTY': 13, 
        'BANKNIFTY': 25, 
        'FINNIFTY': 27, 
        'MIDCPNIFTY': 442, 
        'CRUDEOIL': 294,
        'NIFTYNXT50': 38,
        'SENSEX':51,
        'BANKEX':69,
        'SHRIRAMFIN':4306,
        'MM':2031,
        'HDFCLIFE':467,
        'DIVISLAB':10940,
        'LT':11483,
        }
    seg_list = {
        'NIFTY': 0, 
        'BANKNIFTY': 0, 
        'FINNIFTY': 0, 
        'MIDCPNIFTY': 0, 
        'NIFTYNXT50': 0,
        'SENSEX': 0,
        'BANKEX': 0,
        'SHRIRAMFIN': 1,
        'MM':1,
        'HDFCLIFE':1,
        'DIVISLAB':1,
        'LT':1,
        'CRUDEOIL': 5
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
        fut_response = requests.post(Urls.fut_url, headers=Urls.headers, json=Urls.create_fut_payload(symbol, seg))
        fut_response.raise_for_status()
        fut_data = fut_response.json()
        return Utils.filter_fut_data(fut_data)

    @staticmethod
    def fetch_data(symbol, exp, seg):
        # print()
        # print(f"Fetching data for symbol: {symbol}, exp: {exp}, seg: {seg}")
        # print()
        response = requests.post(Urls.url, headers=Urls.headers, json=Urls.create_payload(symbol, exp, seg))
        spot_response = requests.post(Urls.spot_url, headers=Urls.headers, json=Urls.create_spot_payload(symbol, seg))

        response.raise_for_status()
        spot_response.raise_for_status()

        # print(response.json())

        manipulated_data = Utils.modify_oc_keys(response.json())
        option_chain = manipulated_data['data']['oc']
        atm_price = spot_response.json()['data']['Ltp']
        result = Utils.find_strikes(option_chain, atm_price)

        filtered_data = {key: value for key, value in option_chain.items() if int(key) in result}
        manipulated_data['data']['oc'] = filtered_data
        manipulated_data = Utils.fetch_percentage(manipulated_data)

        fut_data = Urls.fetch_expiry(symbol, seg)

        # with open('data.json', 'w') as file:
        #     json.dump(manipulated_data, file, indent=4)


        return manipulated_data, spot_response.json(), fut_data