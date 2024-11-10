import json
import time
from datetime import datetime

# from Urls import Urls
from pymongo import MongoClient
import gridfs
import sys
import os

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

load_dotenv()

connection_string = os.getenv("MONGO_URI")
client = MongoClient(connection_string)
# MongoDB setup
# client = MongoClient("mongodb://localhost:27017/")
db = client["Future"]
collection = db["oc_data"]
fs = gridfs.GridFS(db)  # Initialize GridFS


def save_data(expiry, data, timestamp, current_date):
    if data:
        data_bytes = json.dumps(data).encode("utf-8")

        file_id = fs.put(data_bytes)

        # Find an existing document by expiry
        existing_doc = collection.find_one({"expiry": expiry})

        if existing_doc:
            # Add the current_date to dateList if it's not already present
            if current_date not in existing_doc.get("dateList", []):
                collection.update_one(
                    {"expiry": expiry},
                    {
                        "$addToSet": {"dateList": current_date}
                    },  # Add the new date to the array
                )

            # Update or set the file_id for the specific timestamp under the current date
            collection.update_one(
                {"expiry": expiry},
                {"$set": {f"day.{str(current_date)}.{str(timestamp)}": file_id}},
            )
        else:
            # Insert a new document if expiry doesn't exist
            collection.insert_one(
                {
                    "expiry": expiry,
                    "dateList": [current_date],
                    "day": {str(current_date): {str(timestamp): file_id}},
                }
            )
    else:
        print("No data to save.")


def get_current_timestamp():
    """
    Get the current date and time as UNIX timestamps.
    """
    current_date = int(
        datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
    )
    current_time = int(datetime.now().timestamp())
    return current_date, current_time


def fetch_and_store_data(expiry, symbol=13, seg=0, interval=10):
    data = {}

    while True:
        now = datetime.now()
        curr_time = now.strftime("%H:%M")

        # Operational hours check with pause condition
        if "09:07" <= curr_time <= "09:15":
            print("Waiting for 10 seconds before the next fetch...")
            time.sleep(10)
            continue

        if not ("00:00" <= curr_time <= "24:00"):
            print("Outside operational hours. Ending data fetch.")
            break

        try:
            # Fetch data from URL
            fetched_data = Urls.fetch_fut_data(
                symbol=symbol, seg=seg
            )  # Ensure `Urls` is imported and defined
            # with open("ddata.json", 'w') as file:
            #         json.dump(fetched_data, file, indent=4)

            if (
                not fetched_data
                or "data" not in fetched_data
                or "flst" not in fetched_data["data"]
            ):
                print("Invalid data structure received.")
                continue

            current_date, current_time = get_current_timestamp()

            # Initialize data structure for expiry if not present
            data.setdefault(str(expiry), {}).setdefault(current_date, {})

            # Extract and store relevant keys
            keys_of_interest = ["ltp", "oichng", "oi", "vol"]
            expiry_code = list(fetched_data["data"]["flst"].keys())[0]
            fut_data = fetched_data["data"]["flst"].get(expiry_code, {})

            # Filter for keys of interest and store in data structure
            data[str(expiry)][current_date][current_time] = {
                expiry_code: {k: fut_data.get(k) for k in keys_of_interest}
            }

            # Save to MongoDB
            save_data(
                expiry=expiry,
                current_date=current_date,
                timestamp=current_time,
                data=data[str(expiry)][current_date][current_time],
            )
            print(f"Data successfully saved to MongoDB at timestamp {current_time}")

            # Optional: Save to local JSON for backup
            # try:
            #     with open("ddata_saved.json", 'w') as file:
            #         json.dump(data, file, indent=4)
            #     print(f"Local backup saved at {current_time} for expiry {expiry}.")
            # except IOError as io_err:
            #     print(f"Failed to save local JSON backup: {io_err}")

        except Exception as e:
            print(f"An error occurred: {e}")

        # Sleep for specified interval before the next fetch
        time.sleep(interval)


# Main execution
if __name__ == "__main__":
    fetch_and_store_data(1415989800, 13, 0)
