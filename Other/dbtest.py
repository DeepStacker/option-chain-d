import requests
import time
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# Step 1: Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["Delta"]
collection = db["my_collection"]

url = "https://scanx.dhan.co/scanx/optchain"
headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8",
    "auth": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwiZW50aXR5X2lkIjoiNzIwOTY4MzY5OSIsImV4cCI6MTcyOTY2NDExOH0.FW9TPQpbz6zeFLcHn3_eVOXzxHi_rqm9DtpubtdKbLEaujwkcXZPc6tu_JP6pWS448u6vRPoRDXSmC2i1viQaw",
    "content-type": "application/json",
    "origin": "https://web.dhan.co",
    "referer": "https://web.dhan.co/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
}

payload = {
    "Data": {"Seg": 5, "Sid": 294, "Exp": 1416076200}  # Unix timestamp for expiry date
}


def fetch_data(url, headers, payload):
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        # Extract the data from the response
        data = response.json().get("data", {}).get("oc", {})

        # Extract expiry date from payload (Unix timestamp)
        expiry_date = payload.get("Data", {}).get("Exp")
        expiry_date = datetime.fromtimestamp(expiry_date)  # Convert to datetime object

        # Get the current time
        current_time = datetime.now()

        # Call the read_data function and pass expiry date and current time
        read_data(data, expiry_date, current_time)

    else:
        print(f"Request failed with status code: {response.status_code}")


def read_data(data, exp_date, current_time):
    strikes = [
        int(float(strike))
        for strike in data.keys()
        if strike.replace(".", "", 1).isdigit()
    ]

    ce_delta, pe_delta = [], []
    ce_oi, pe_oi = [], []
    ce_ltp_chng, pe_ltp_chng = [], []
    ce_ltp, pe_ltp = [], []

    for strike in strikes:
        strike_key = f"{strike:.6f}"
        try:
            ce_delta.append(data[strike_key]["ce"]["optgeeks"]["delta"])
            pe_delta.append(data[strike_key]["pe"]["optgeeks"]["delta"])
            ce_oi.append(data[strike_key]["ce"]["vol"])
            pe_oi.append(data[strike_key]["pe"]["vol"])
            ce_ltp_chng.append(data[strike_key]["ce"]["p_chng"])
            pe_ltp_chng.append(data[strike_key]["pe"]["p_chng"])
            ce_ltp.append(data[strike_key]["ce"]["ltp"])
            pe_ltp.append(data[strike_key]["pe"]["ltp"])
        except KeyError as e:
            print(f"Warning: Missing data for strike {strike} - {e}")
            continue

    def calculate_weighted_sum(values, weights):
        return sum(v * w for v, w in zip(values, weights))

    def calculate_percentage(value, total):
        return (value / total) * 100 if total != 0 else 0.0

    ce_delta_total = calculate_weighted_sum(ce_delta, ce_oi)
    pe_delta_total = calculate_weighted_sum(pe_delta, pe_oi)
    delta_total = ce_delta_total + abs(pe_delta_total)

    ce_delta_percent = calculate_percentage(ce_delta_total, delta_total)
    pe_delta_percent = calculate_percentage(abs(pe_delta_total), delta_total)

    ce_ltp_chng_total = sum(ce_ltp_chng)
    pe_ltp_chng_total = sum(pe_ltp_chng)
    ltp_chng_total = ce_ltp_chng_total + abs(pe_ltp_chng_total)

    ce_ltp_total = sum(ce_ltp)
    pe_ltp_total = sum(pe_ltp)
    ltp_total = ce_ltp_total + abs(pe_ltp_total)

    ce_ltp_chng_percent = calculate_percentage(ce_ltp_chng_total, ltp_chng_total)
    pe_ltp_chng_percent = calculate_percentage(abs(pe_ltp_chng_total), ltp_chng_total)

    ce_ltp_percent = calculate_percentage(ce_ltp_total, ltp_total)
    pe_ltp_percent = calculate_percentage(abs(pe_ltp_total), ltp_total)

    result = {
        "ce_delta_percent": round(ce_delta_percent, 2),
        "pe_delta_percent": round(pe_delta_percent, 2),
        "ce_ltp_chng_percent": round(ce_ltp_chng_percent, 2),
        "pe_ltp_chng_percent": round(pe_ltp_chng_percent, 2),
        "ce_ltp_percent": round(ce_ltp_percent, 2),
        "pe_ltp_percent": round(pe_ltp_percent, 2),
        "expiry_date": exp_date,
        "timestamp": current_time,
    }

    # Define a fixed document ID or query criteria
    # doc_id = "unique_calculations_doc"

    # # Check if the document already exists
    # existing_doc = collection.find_one({"_id": doc_id})

    # if not existing_doc:
    #     # If it doesn't exist, create it with an empty calculations array
    #     collection.insert_one({
    #         "_id": doc_id,
    #         "calculations": [result]  # Initialize with the first result
    #     })
    # else:
    # If it exists, check if the result's expiry date and timestamp are earlier than the stored ones
    # latest_result = existing_doc["calculations"][-1]  # Get the last result
    # latest_expiry_date = latest_result.get("expiry_date")
    # latest_timestamp = latest_result.get("timestamp")

    # # Convert latest expiry dates to datetime objects for comparison
    # if isinstance(latest_expiry_date, int):  # If stored as Unix timestamp
    #     latest_expiry_date = datetime.fromtimestamp(latest_expiry_date)

    # # Compare expiry dates and timestamps
    # if latest_expiry_date and latest_timestamp:
    #     if exp_date < latest_expiry_date or (exp_date == latest_expiry_date and current_time < latest_timestamp):
    #         # If the new result is earlier, append it to the calculations array
    #         collection.update_one(
    #             {"_id": doc_id},
    #             {"$push": {"calculations": result}}  # Appends the new result into the calculations array
    #         )
    #         print(f"Stored result: {result}")
    #     else:
    #         print("New result is not before the stored expiry date or timestamp, not storing.")
    # else:
    #     # Handle the case where latest_expiry_date or latest_timestamp is None
    #     collection.update_one(
    #         {"_id": doc_id},
    #         {"$push": {"calculations": result}}  # Appends the new result into the calculations array
    #     )
    #     print(f"Stored result: {result}")


if __name__ == "__main__":
    while True:
        fetch_data(url, headers, payload)
        time.sleep(1)
