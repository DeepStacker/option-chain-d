from datetime import datetime
from flask import jsonify, request
import traceback
from Urls import Urls 
from Utils import Utils 

FILE_PATH = 'Percentage_Data.json'

class App:

    def get_live_data(symbol, exp):
        try:
            if symbol not in Urls.symbol_list:
                return jsonify({"error": "Invalid or missing 'sid' parameter"}), 400

            symbol_id = Urls.symbol_list[symbol]
            seg_id = Urls.seg_list[symbol]

            if exp is None:
                return jsonify({"error": "'exp' must be provided"}), 400

            try:
                exp = int(exp)
            except (ValueError, TypeError):
                return jsonify({"error": "'exp' must be a valid integer"}), 400

            option_data, spot_data, fut_data = Urls.fetch_data(symbol_id, exp, seg_id)

            return jsonify({
                "symbol": symbol_id,
                "expiry": exp,
                "options": option_data,
                "spot": spot_data,
                "fut": fut_data
            }), 200

        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": f"Server encountered an error: {str(e)}"}), 500 

    def get_exp_date(symbol, exp):
        try:
          
            if symbol not in Urls.symbol_list:
                return jsonify({"error": "Invalid or missing 'sid' parameter"}), 400

            symbol_id = Urls.symbol_list[symbol]
            seg_id = Urls.seg_list[symbol]
            print(f"Symbol ID: {symbol_id}")

            if exp is None:
                return jsonify({"error": "'exp' must be provided"}), 400

            try:
                exp = int(exp)
            except (ValueError, TypeError):
                return jsonify({"error": "'exp' must be a valid integer"}), 400

            fut_data = Urls.fetch_expiry(symbol_id, seg_id)

            return jsonify({
                "symbol": symbol_id,
                "fut": fut_data
            }), 200

        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": f"Server encountered an error: {str(e)}"}), 500 

   

    def get_percentage_data(symbol, exp, isCe, strike):
        """Function to retrieve percentage data from the JSON file."""
        try:
            FILE_PATH = f"{str(exp)}.json"
            # Load existing data from the JSON file
            data = Utils.load_existing_data(file_path=FILE_PATH)

            curr_date = int(datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp())

            # Initialize lists to store the extracted values
            timestamp = []
            oi = []
            oichng = []
            vol = []

            # Check if the expiry exists in the data
            if str(exp) in data.keys(): 
                # print(f"Expiry {exp} found in data.")
                for key, value in dict(data[str(exp)][str(curr_date)]).items():
                    # print(f"Processing key: {key} for expiry: {exp} and date: {curr_date} ...")
                    percent_data = value.get('ce_data' if isCe else 'pe_data', {})
                    # print(f"Percent Data: {percent_data}")


                    if str(strike) in percent_data:
                        timestamp.append(key)
                        oi.append(percent_data[strike].get('OI_percentage', 0))  # Default to 0 if not found
                        oichng.append(percent_data[strike].get('oichng_percentage', 0))  # Default to 0 if not found
                        vol.append(percent_data[strike].get('vol_percentage', 0))  # Default to 0 if not found
                    else:
                        # Return error if the strike is not found
                        return jsonify({
                            "error": "Strike not found",
                            "symbol": symbol,
                            "expiry": exp,
                        }), 404  

            else:
                # Return error if the expiry is not found
                print(f"Expiry {exp} not found in data.")
                return jsonify({
                    "error": "Expiry not found",
                    "symbol": symbol,
                }), 404 

            # Return the extracted data as JSON response
            # print(f"Symbol: {symbol}")
            # print(f"Expiry: {exp}")
            # print(f"Timestamp: {timestamp}")
            # print(f"Open Interest (OI): {oi}")
            # print(f"Open Interest Change (OI Change): {oichng}")
            # print(f"Volume: {vol}")

            return jsonify({
                "symbol": symbol,
                "strike":strike,
                "isCe":isCe,
                "expiry": exp,
                "timestamp": timestamp,  # List of timestamps
                "oi": oi,                # List of OI percentages
                "oichng": oichng,        # List of OI change percentages
                "vol": vol               # List of volume percentages
            }), 200

        except Exception as e:
            # Log the error for debugging
            # app.logger.error(f"An error occurred: {str(e)}")
            # Return internal server error for any unhandled exceptions
            return jsonify({"error": "Internal Server Error"}), 500 
        

                    