import json
import time
import os
from datetime import datetime
from Urls import Urls  

FILE_PATH = 'Percentage_Data.json' 

def load_existing_data(file_path):
    #Load existing data from JSON file if it exists, else return a new structure.#
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                print("Error decoding JSON, starting with empty data.")
                return {}
    else:
        return {}

def save_data(file_path, data):
    #Save data back to the JSON file.#
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def get_current_timestamp():
    #Get the current date and time as UNIX timestamps.#
    current_date = int(datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
    current_time = int(datetime.now().timestamp())
    return current_date, current_time

def get_data(exp):
    # Load existing data from the JSON file
    data = load_existing_data(FILE_PATH)

    while True:
        now = datetime.now()
        curr_time = now.strftime("%H:%M")

        # Check if current time is 9:00 AM
        if "18:00" <= curr_time <= "23:35":
            if "09:07" <= curr_time <= "09:15":
                    print("Waiting for 10 seconds before the next fetch...")
                    continue
            
            try:
                # Fetch data from the URL (replace parameters appropriately)
                fetched_data = Urls.fetch_data(symbol=13, seg=0, exp=exp)

                if not fetched_data or 'data' not in fetched_data[0] or 'oc' not in fetched_data[0]['data']:
                    print("Invalid data structure received.")
                    continue

                # Get the current date and time as UNIX timestamps
                current_date, current_time = get_current_timestamp()

                # Initialize the date key if it doesn't exist
                if str(exp) not in data:
                    data[str(exp)] = {}
                    
                # Initialize the date key if it doesn't exist
                if str(current_date) not in data[str(exp)]:
                    data[str(exp)][str(current_date)] = {}

                # Prepare the structure for the current time entry
                data[str(exp)][str(current_date)][str(current_time)] = {
                    'ce_data': {},
                    'pe_data': {}
                }

                # Define the keys of interest
                keys_of_interest = ["OI_percentage", "oichng_percentage", "vol_percentage"]

                # Extract relevant data for CE and PE
                for key, value in fetched_data[0]['data']['oc'].items():
                    ce_data = value.get('ce', {})
                    pe_data = value.get('pe', {})

                    # Filter only the keys of interest from CE and PE data
                    data[str(exp)][str(current_date)][str(current_time)]['ce_data'][key] = {k: ce_data.get(k) for k in keys_of_interest}
                    data[str(exp)][str(current_date)][str(current_time)]['pe_data'][key] = {k: pe_data.get(k) for k in keys_of_interest}

                # Save the updated data back to the JSON file
                save_data(FILE_PATH, data)

                print(f"Data successfully saved to {FILE_PATH} at timestamp {current_time}")

                if curr_time == "15:35":
                    print("Time is 3:35 PM. Exiting the program.")
                    break
                if curr_time == "19:01":
                    print("Time is 3:35 PM. Exiting the program.")
                    break

                

            except Exception as e:
                print(f"An error occurred: {e}")

            # Sleep for 3 seconds before the next fetch
            try:
                time.sleep(3)
            except KeyboardInterrupt:
                print("Process interrupted by user.")
                break

# Call the function to start fetching data
if __name__ == "__main__":
    get_data(1415385000)
