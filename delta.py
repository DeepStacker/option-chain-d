import requests

url = "https://scanx.dhan.co/scanx/optchain"
headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8",
    "auth": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwiZW50aXR5X2lkIjoiNzIwOTY4MzY5OSIsImV4cCI6MTcyOTY2NDExOH0.FW9TPQpbz6zeFLcHn3_eVOXzxHi_rqm9DtpubtdKbLEaujwkcXZPc6tu_JP6pWS448u6vRPoRDXSmC2i1viQaw",
    "content-type": "application/json",
    "origin": "https://web.dhan.co",
    "referer": "https://web.dhan.co/",
    "sec-ch-ua": '"Chromium";v="130", "Brave";v="130", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
}

payload = {
    "Data": {
        "Seg": 0,
        "Sid": 13,
        "Exp": 1415989800
    }
}

response = requests.post(url, headers=headers, json=payload)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()

    oc_data = data['data']['oc']
    
    # Extract and filter strike keys within the specified range
    strikes = [
        int(float(strike)) 
        for strike in oc_data.keys() 
        if strike.replace('.', '', 1).isdigit() and 23250 <= int(float(strike)) <= 25250
    ]
    
    ce_delta = []
    pe_delta = []

    # Populate ce_delta and pe_delta lists
    for strike in strikes:
        strike_key = f"{strike:.6f}"  # Convert back to string format with six decimal places
        try:
            ce_delta.append(oc_data[strike_key]['ce']['optgeeks']['delta'])
            pe_delta.append(oc_data[strike_key]['pe']['optgeeks']['delta'])
        except KeyError as e:
            print(f"Warning: Missing data for strike {strike} - {e}")
            continue

    # print("CE Deltas:", ce_delta)
    # print("PE Deltas:", pe_delta)

    # Define a function to calculate average delta
    def calculate_average(delta_list):
        valid_values = [item for item in delta_list if isinstance(item, (int, float))]
        if valid_values:
            return round(sum(valid_values) / len(valid_values), 4)
        else:
            return 0.0

    # Calculate and print averages
    average_ce_delta = calculate_average(ce_delta)
    average_pe_delta = calculate_average(pe_delta)

    print("Average CE Delta:", average_ce_delta)
    print("Average PE Delta:", average_pe_delta)

else:
    print(f"Request failed with status code: {response.status_code}")
