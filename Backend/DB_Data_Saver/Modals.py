import json
import time
import os
from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
import gridfs
import sys
import pytz

# import os

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
        )
    ),
)
from Urls import Urls
from dotenv import load_dotenv

username = quote_plus("svmsingh01")
password = quote_plus("Shivam@977140")

uri = f"mongodb+srv://{username}:{password}@stockifydb.wekf6.mongodb.net/stockifydb?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi("1"))

db = client["Percentage"]


def save_data(symbol, expiry, data, timestamp, current_date):
    file_path = f"{symbol}_{expiry }"
    collection = db[file_path]
    fs = gridfs.GridFS(db)  # Initialize GridFS
    if data:
        data_bytes = json.dumps(data).encode("utf-8")

        # Save data bytes to the file system
        file_id = fs.put(data_bytes)

        # Find an existing document by symbol and expiry
        existing_doc = collection.find_one({"symbol": symbol, "expiry": expiry})

        if existing_doc:
            # Add the current_date to dateList if it's not already present
            if current_date not in existing_doc.get("dateList", []):
                collection.update_one(
                    {"symbol": symbol, "expiry": expiry},
                    {"$addToSet": {"dateList": current_date}},
                )

            # Update or set the file_id for the specific timestamp under the current date
            collection.update_one(
                {"symbol": symbol, "expiry": expiry},
                {"$set": {f"day.{str(current_date)}.{str(timestamp)}": file_id}},
            )
        else:
            # Insert a new document if expiry doesn't exist
            collection.insert_one(
                {
                    "symbol": symbol,
                    "expiry": expiry,
                    "dateList": [current_date],
                    "day": {str(current_date): {str(timestamp): file_id}},
                }
            )
    else:
        print("No data to save.")


def get_current_timestamp():
    # Define the IST timezone
    ist = pytz.timezone("Asia/Kolkata")

    # Get the current date and time in IST
    current_date_ist = datetime.now(ist).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    current_time_ist = datetime.now(ist)

    # Convert the datetime objects to UNIX timestamps
    current_date_timestamp = int(current_date_ist.timestamp())
    current_time_timestamp = int(current_time_ist.timestamp())

    return current_date_timestamp, current_time_timestamp


def get_data(expiry, symbol=13, seg=0):
    """
    Fetch data for the given expiry and save it to MongoDB at specified intervals.
    """
    # Load any existing data from the JSON file (optional for additional local storage)
    data = {}

    while True:
        now = datetime.now()
        curr_time = now.strftime("%H:%M")

        # Operational hours check
        if "00:00" <= curr_time <= "24:00":
            if "09:07" <= curr_time <= "09:15":
                print("Waiting for 10 seconds before the next fetch...")
                time.sleep(10)
                continue

            try:
                # Fetch data from URL using parameters
                fetched_data = Urls.fetch_data(symbol=symbol, seg=seg, exp=expiry)

                if (
                    not fetched_data
                    or "data" not in fetched_data[0]
                    or "oc" not in fetched_data[0]["data"]
                ):
                    print("Invalid data structure received.")
                    continue

                # Get the current date and time as UNIX timestamps
                current_date, current_time = get_current_timestamp()

                # Initialize the data structure for the current expiry if not present
                if str(expiry) not in data:
                    data[str(expiry)] = {}

                if str(current_date) not in data[str(expiry)]:
                    data[str(expiry)][str(current_date)] = {}

                # Prepare the structure for the current time entry
                data[str(expiry)][str(current_date)][str(current_time)] = {
                    "ce_data": {},
                    "pe_data": {},
                }

                # Define the keys of interest
                keys_of_interest = [
                    "OI_percentage",
                    "oichng_percentage",
                    "vol_percentage",
                ]

                # Extract relevant data for CE and PE
                for key, value in fetched_data[0]["data"]["oc"].items():
                    ce_data = value.get("ce", {})
                    pe_data = value.get("pe", {})

                    # Filter only the keys of interest from CE and PE data
                    data[str(expiry)][str(current_date)][str(current_time)]["ce_data"][
                        key
                    ] = {k: ce_data.get(k) for k in keys_of_interest}
                    data[str(expiry)][str(current_date)][str(current_time)]["pe_data"][
                        key
                    ] = {k: pe_data.get(k) for k in keys_of_interest}

                # Save the updated data back to MongoDB
                save_data(
                    symbol,
                    expiry,
                    data[str(expiry)][str(current_date)][str(current_time)],
                    current_time,
                    current_date,
                )

                print(
                    f"Data successfully saved to MongoDB at timestamp {current_time} for Modals"
                )

                # Exit conditions
                # if curr_time == "15:35" or curr_time == "19:01":
                #     print("Ending data fetching process.")
                #     break

            except Exception as e:
                print(f"An error occurred: {e}")

            # Sleep for 3 seconds before the next fetch
            try:
                time.sleep(10)
            except KeyboardInterrupt:
                print("Process interrupted by user.")
                break
    return


# Main execution
if __name__ == "__main__":
    get_data(1416076200, 294, 5)  # Replace with actual expiry timestamp as needed
