import requests
import time
from pymongo import MongoClient
from bson import ObjectId

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

payload = {"Data": {"Seg": 5, "Sid": 294, "Exp": 1416076200}}


def fetch_data(url, headers, payload):
    response = requests.post(url, headers=headers, json=payload)
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json().get("data", {}).get("oc", {})

        # Insert into MongoDB
        # collection.insert_one(data)
        # Insert data and get the result
        result = collection.insert_one(data)

        # Get the automatically generated _id
        inserted_id = result.inserted_id
        print(f"Inserted document ID: {inserted_id}")
        read_data(inserted_id)

    else:
        print(f"Request failed with status code: {response.status_code}")


def read_data(id=None):
    # Fetch data from MongoDB
    data = collection.find_one({"_id": ObjectId(id)})
    # collection.delete_one({"_id": ObjectId(id)})

    # Remove _id field from the result if needed
    if data and "_id" in data:
        del data["_id"]

    strikes = [
        int(float(strike))
        for strike in data.keys()
        if strike.replace(".", "", 1).isdigit()  # Ensure valid keys
    ]

    ce_delta, pe_delta = [], []
    ce_oi, pe_oi = [], []
    ce_ltp_chng, pe_ltp_chng = [], []
    ce_ltp, pe_ltp = [], []

    # Populate lists for calculations
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

    # Define a function to calculate weighted delta
    def calculate_weighted_sum(values, weights):
        return sum(v * w for v, w in zip(values, weights))

    def calculate_percentage(value, total):
        return (value / total) * 100 if total != 0 else 0.0

    ce_delta_total = calculate_weighted_sum(ce_delta, ce_oi)
    pe_delta_total = calculate_weighted_sum(pe_delta, pe_oi)
    delta_total = ce_delta_total + abs(pe_delta_total)

    # Calculate Delta Percentages
    ce_delta_percent = calculate_percentage(ce_delta_total, delta_total)
    pe_delta_percent = calculate_percentage(abs(pe_delta_total), delta_total)

    print(f"CE Delta Percentage: {round(ce_delta_percent, 2)}")
    print(f"PE Delta Percentage: {round(pe_delta_percent, 2)}")

    # Calculate LTP Changes and Percentages
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

    print(f"CE LTP Change Percentage: {round(ce_ltp_chng_percent, 2)}")
    print(f"PE LTP Change Percentage: {round(pe_ltp_chng_percent, 2)}")
    print(f"CE LTP Percentage: {round(ce_ltp_percent, 2)}")
    print(f"PE LTP Percentage: {round(pe_ltp_percent, 2)}")


if __name__ == "__main__":
    while True:
        fetch_data(url, headers, payload)
        time.sleep(1)
