from datetime import datetime
import json
from flask import jsonify
import sys
import os

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Backend"))
)
from retrivedata import retrieve_data


def get_fut_data(symbol, exp):
    """Function to retrieve percentage data from the JSON file."""
    try:
        FILE_PATH = "Future"

        # Get current date in UNIX timestamp format (at midnight)
        curr_date = int(
            datetime.now()
            .replace(hour=0, minute=0, second=0, microsecond=0)
            .timestamp()
        )

        # Retrieve data for the specific expiry and current date
        data = retrieve_data(exp, curr_date, FILE_PATH)

        # Save retrieved data temporarily to check the structure
        with open("temp_data.json", "w") as file:
            json.dump(data, file, indent=4)

        # Load data from temp_data.json (optional step; already in 'data')
        with open("temp_data.json", "r") as file:
            data = json.load(file)

        # Initialize lists to store the extracted values
        timestamp = []
        oi, oichng, vol, ltp = [], [], [], []

        # Check if "day" and current date exist in the data
        if "day" in data and str(curr_date) in data["day"]:
            # Iterate over timestamps within the current date
            for time_key, value in data["day"][str(curr_date)].items():
                fut_date = list(value.keys())[0]

                # Ensure the keys and values are correctly extracted for CE and PE data
                if isinstance(value, dict):
                    # Extract required data with defaults in case a key is missing
                    timestamp.append(time_key)
                    oi.append(value[str(fut_date)].get("oi", 0))
                    oichng.append(value[str(fut_date)].get("oichng", 0))
                    vol.append(value[str(fut_date)].get("vol", 0))
                    ltp.append(value[str(fut_date)].get("ltp", 0))
                else:
                    # return (
                    #     jsonify(
                    #         {
                    #             "error": "Strike not found",
                    #             "symbol": symbol,
                    #             "expiry": exp,
                    #         }
                    #     ),
                    #     404,
                    # )
                    pass

        else:
            # Return error if the expiry is not found
            # return (
            #     jsonify(
            #         {
            #             "error": "Expiry not found",
            #             "symbol": symbol,
            #         }
            #     ),
            #     404,
            # )
            pass

        print("Data processing completed successfully.")
        new_data = {
            "symbol": symbol,
            "expiry": exp,
            "timestamp": timestamp,
            "oi": oi,
            "oichng": oichng,
            "vol": vol,
            "ltp": ltp,
        }
        with open("temp_data.json", "w") as file:
            json.dump(new_data, file, indent=4)

        # return (
        #     jsonify(
        #         {
        #             "symbol": symbol,
        #             "expiry": exp,
        #             "timestamp": timestamp,
        #             "oi": oi,
        #             "oichng": oichng,
        #             "vol": vol,
        #             "ltp": ltp,
        #         }
        #     ),
        #     200,
        # )

    except Exception as e:
        # Log the error for debugging
        print(f"An error occurred: {e}")
        # return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    get_fut_data(13, 1415989800)
