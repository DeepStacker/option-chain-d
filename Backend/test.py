from flask import jsonify, request
from Utils import Utils

FILE_PATH = 'Percentage_Data.json'

def get_percentage_data(symbol, exp,curr_date, isCe, strike):
    try:
        # Load existing data from the JSON file
        data = Utils.load_existing_data(file_path=FILE_PATH)

        # Initialize lists to store the extracted values
        timestamp = []
        oi = []
        oichng = []
        vol = []

        # Check if the expiry exists in the data
        if str(exp) in data.keys(): 
            for key, value in dict(data[str(exp)][str(curr_date)]).items():
                percent_data = value.get('ce_data' if isCe else 'pe_data', {})

                if strike in percent_data:
                    timestamp.append(key)
                    oi.append(percent_data[strike].get('OI_percentage', 0))  # Default to 0 if not found
                    oichng.append(percent_data[strike].get('oichng_percentage', 0))  # Default to 0 if not found
                    vol.append(percent_data[strike].get('vol_percentage', 0))  # Default to 0 if not found
                else:
                    # print(f"Strike {strike} not found in data for expiry {exp}.")
                    return jsonify({
                        "error": "Strike not found",
                        "symbol": symbol,
                        "expiry": exp,
                    }), 404  

        else:
            print(f"Expiry {exp} not found in data.")
            return jsonify({
                "error": "Expiry not found",
                "symbol": symbol,
            }), 404 

        # Print for debugging purposes (you might want to remove these in production)
        print(f"Symbol: {symbol}")
        print(f"Expiry: {exp}")
        print(f"Timestamp: {timestamp}")
        print(f"Open Interest (OI): {oi}")
        print(f"Open Interest Change (OI Change): {oichng}")
        print(f"Volume: {vol}")


        # Return the extracted data as JSON response
        # return jsonify({
        #     "symbol": symbol,
        #     "expiry": exp,
        #     "timestamp": timestamp,
        #     "oi": oi,
        #     "oichng": oichng,
        #     "vol": vol
        # }), 200

    except Exception as e:
        print(f"An error occurred: {e}")
        # return jsonify({"error": "Internal Server Error"}), 500  

# Example call (uncomment to test directly)
get_percentage_data(symbol='NIFTY', exp=1414175400,curr_date = 1729535400, isCe=True, strike='24600')
