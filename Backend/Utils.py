import os, json
from pymongo import MongoClient

FILE_PATH = "Percentage_Data.json"


class Utils:

    def load_existing_data(file_path):
        # Load existing data from JSON file if it exists, else return a new structure.#
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                try:
                    return json.load(file)
                except json.JSONDecodeError:
                    print("Error decoding JSON, starting with empty data.")
                    return {}
        else:
            return {}

    def filter_fut_data(data):
        try:
            explst = data["data"]["opsum"]

            exp_list = list(explst.keys())

            int_exp_list = [int(exp) for exp in exp_list if exp.isdigit()]

            data["data"]["explist"] = int_exp_list
            # print(data["data"]["explist"][0])

        except KeyError as e:
            print(f"KeyError: {e} - Please check the input data structure.")
            data["data"]["explist"] = []
        except ValueError as e:
            print(f"ValueError: {e} - Unable to convert some keys to integers.")
            data["data"]["explist"] = []

        return data

    def modify_oc_keys(data):
        try:
            # Validate the presence of required keys
            if "data" not in data or "oc" not in data["data"]:
                raise KeyError("Missing 'data' or 'oc' keys in the input.")

            oc_dict = data["data"]["oc"]
            modified_oc = {}

            # Iterate through the option chain keys
            for key, value in oc_dict.items():
                try:
                    float_key = float(key)
                    # Convert float keys to integer if possible, otherwise format to two decimal places
                    new_key = (
                        str(int(float_key))
                        if float_key.is_integer()
                        else f"{float_key:.2f}"
                    )
                    modified_oc[new_key] = value
                except ValueError:
                    print(
                        f"Skipping invalid key '{key}': Cannot be converted to float."
                    )

            data["data"]["oc"] = modified_oc

        except KeyError as e:
            print(f"KeyError: {e} - Check the input data structure.")
            data["data"]["oc"] = {}

        except Exception as e:
            print(f"Unexpected error in modify_oc_keys: {e}")
            data["data"]["oc"] = {}

        return data

    def find_strikes(option_chain, atm_price):
        try:
            # Ensure all keys can be converted to integers
            valid_strikes = [int(k) for k in option_chain.keys() if k.isdigit()]

            if not valid_strikes:
                raise ValueError("Option chain contains no valid strike prices.")

            # Find the nearest strike to the ATM price
            nearest_strike = min(
                valid_strikes, key=lambda strike: abs(strike - atm_price)
            )

            # Prepare lists for ITM and OTM strikes
            itm_strikes = []
            otm_strikes = []
            max_range = 10  # Number of strikes above/below the nearest strike

            # Calculate the difference between consecutive strikes
            index = valid_strikes.index(nearest_strike)
            if index < len(valid_strikes) - 1:
                diff_between_strike = valid_strikes[index + 1] - valid_strikes[index]
            else:
                diff_between_strike = valid_strikes[index] - valid_strikes[index - 1]

            # Generate ITM and OTM strikes within the specified range
            for i in range(1, max_range + 2):
                upper_strike = nearest_strike + i * diff_between_strike
                # lower_strike = nearest_strike - i * diff_between_strike

                otm_strikes.append(upper_strike)
                # itm_strikes.append(lower_strike)
            for i in range(1, max_range + 1):
                # upper_strike = nearest_strike + i * diff_between_strike
                lower_strike = nearest_strike - i * diff_between_strike

                # otm_strikes.append(upper_strike)
                itm_strikes.append(lower_strike)

            # Sort strikes for a consistent output
            itm_strikes.sort()
            otm_strikes.sort()

            # Combine ITM, nearest, and OTM strikes into one list
            strikes_price = itm_strikes + [nearest_strike] + otm_strikes

            return strikes_price

        except ValueError as ve:
            print(f"ValueError: {ve} - No valid strike prices found.")
            return [atm_price]  # Fallback: Return only the ATM strike

        except Exception as e:
            print(f"Unexpected error in find_strikes: {e}")
            return [atm_price]  # Fallback: Return only the ATM strike

    def fetch_percentage(option_chain):
        data = option_chain["data"]["oc"]

        # Initialize lists for storing CE and PE values
        ce_oi = []
        ce_oichng = []
        ce_vol = []
        pe_oi = []
        pe_oichng = []
        pe_vol = []

        # Extract CE and PE data
        for values in data.values():
            ce_data = values.get("ce", {})
            pe_data = values.get("pe", {})

            # Append values with fallback to 0 if key doesn't exist
            ce_oi.append(ce_data.get("OI", 0))
            ce_oichng.append(ce_data.get("oichng", 0))
            ce_vol.append(ce_data.get("vol", 0))

            pe_oi.append(pe_data.get("OI", 0))
            pe_oichng.append(pe_data.get("oichng", 0))
            pe_vol.append(pe_data.get("vol", 0))

        def find_highest(numbers):
            max_value = max(numbers)

            result = [num for num in numbers if num >= 0.75 * max_value]
            # print("Numbers >= 75% of max value:", result)
            return sorted(result, reverse=True)

        def check_data(item, value):
            ce_oi_highest_list = find_highest(value)

            # print("Sorted List:", ce_oi_highest_list)

            if item in ce_oi_highest_list:
                return str(ce_oi_highest_list.index(item) + 1)

            return "0"

        # Avoid division by zero by checking max value
        def calculate_percentage(value, max_value):
            return (
                (round((value / max_value * 100), 2) if max_value else 0)
                if value > 0
                else 0
            )

        # Calculate percentages
        ce_oi_percentage = [calculate_percentage(v, max(ce_oi)) for v in ce_oi]
        ce_oichng_percentage = [
            calculate_percentage(v, max(ce_oichng)) for v in ce_oichng
        ]
        ce_vol_percentage = [calculate_percentage(v, max(ce_vol)) for v in ce_vol]
        pe_oi_percentage = [calculate_percentage(v, max(pe_oi)) for v in pe_oi]
        pe_oichng_percentage = [
            calculate_percentage(v, max(pe_oichng)) for v in pe_oichng
        ]
        pe_vol_percentage = [calculate_percentage(v, max(pe_vol)) for v in pe_vol]

        # Calculate percentages
        ce_oi_max_value = [
            check_data(item=v, value=ce_oi_percentage) for v in ce_oi_percentage
        ]
        ce_oichng_max_value = [
            check_data(item=v, value=ce_oichng_percentage) for v in ce_oichng_percentage
        ]
        ce_vol_max_value = [
            check_data(item=v, value=ce_vol_percentage) for v in ce_vol_percentage
        ]
        pe_oi_max_value = [
            check_data(item=v, value=pe_oi_percentage) for v in pe_oi_percentage
        ]
        pe_oichng_max_value = [
            check_data(item=v, value=pe_oichng_percentage) for v in pe_oichng_percentage
        ]
        pe_vol_max_value = [
            check_data(item=v, value=pe_vol_percentage) for v in pe_vol_percentage
        ]

        # Update the data with percentage values
        for i, (k, values) in enumerate(data.items()):
            values["ce"]["OI_percentage"] = ce_oi_percentage[i]
            values["ce"]["oichng_percentage"] = ce_oichng_percentage[i]
            values["ce"]["vol_percentage"] = ce_vol_percentage[i]

            values["pe"]["OI_percentage"] = pe_oi_percentage[i]
            values["pe"]["oichng_percentage"] = pe_oichng_percentage[i]
            values["pe"]["vol_percentage"] = pe_vol_percentage[i]

            values["ce"]["OI_max_value"] = ce_oi_max_value[i]
            values["ce"]["oichng_max_value"] = ce_oichng_max_value[i]
            values["ce"]["vol_max_value"] = ce_vol_max_value[i]

            values["pe"]["OI_max_value"] = pe_oi_max_value[i]
            values["pe"]["oichng_max_value"] = pe_oichng_max_value[i]
            values["pe"]["vol_max_value"] = pe_vol_max_value[i]

        # Update the option chain with modified data
        option_chain["data"]["oc"] = data

        return option_chain

    def save_data(symbol, expiry, data, timestamp, current_date):
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
