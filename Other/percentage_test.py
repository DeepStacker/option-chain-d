import json
from datetime import datetime
from Backend.retrivedata import retrieve_data

try:
    exp = 1415989800  # expiry timestamp
    isCe = True
    strike = "24200"
    FILE_PATH = "Percentage"

    # Retrieve the current day's timestamp at midnight
    curr_date = int(
        datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
    )

    # Print curr_date for inspection
    print("Current Date Timestamp:", curr_date)

    # Step 1: Load data using retrieve_data function
    data = retrieve_data(exp, curr_date, FILE_PATH)

    # Print raw data for inspection
    # print("Raw Data Retrieved:", json.dumps(data, indent=4))  # Print data for debugging

    # Step 2: Check if the current date exists in data["day"] under the given expiry (exp)
    if "day" in data:
        # Print keys in "day" to inspect the data format
        print("Keys in 'day':", list(data["day"].keys()))

        # Now check for the expiry timestamp
        if str(curr_date) in str(data["day"]):
            print(
                f"Data found for current date {curr_date} under expiry {exp}. Checking for specific timestamp..."
            )

            # Access the nested data under the current date
            day_data = data["day"].get(str(curr_date), {})

            # Print the data structure under the current date
            print("Data under current date:", json.dumps(day_data, indent=4))

            # Now you need to find the specific timestamp (e.g., "1731063563") under this current date
            # We can iterate through the keys in the `day_data`
            for timestamp_key, timestamp_data in day_data.items():
                percent_type = "ce_data" if isCe else "pe_data"

                # Access the specific strike data under the timestamp
                percent_data = timestamp_data.get(percent_type, {})

                # Check if the specific strike price data exists
                if strike in percent_data:
                    # Extract the required data for the strike
                    oi_percentage = percent_data[strike].get("OI_percentage", 0)
                    oichng_percentage = percent_data[strike].get("oichng_percentage", 0)
                    vol_percentage = percent_data[strike].get("vol_percentage", 0)

                    # Print or store the data
                    print(
                        f"Data for strike {strike}: OI_percentage={oi_percentage}, OI_change_percentage={oichng_percentage}, Volume_percentage={vol_percentage}"
                    )
                else:
                    print(
                        f"Error: Strike {strike} not found under timestamp {timestamp_key}"
                    )

        else:
            print(f"Current date {curr_date} not found in 'day' data for expiry {exp}.")
    else:
        print("No 'day' data found in the retrieved data.")

except Exception as e:
    print(f"An error occurred: {str(e)}")
