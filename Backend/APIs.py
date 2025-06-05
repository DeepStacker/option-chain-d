from datetime import datetime, timedelta
import json
from flask import jsonify, request
import traceback
from Urls import Urls
from Utils import Utils
from retrivedata import retrieve_data
import io
import pytz
import requests

FILE_PATH = "Percentage_Data.json"


class App:

    def get_live_data(symbol, exp_sid):
        try:
            if symbol not in Urls.symbol_list:
                return jsonify({"error": "Invalid or missing 'sid' parameter"}), 400

            symbol_id = Urls.symbol_list[symbol]
            seg_id = Urls.seg_list[symbol]

            if exp_sid is None:
                return jsonify({"error": "'exp_sid' must be provided"}), 400

            try:
                exp_sid = int(exp_sid)
            except (ValueError, TypeError):
                return jsonify({"error": "'exp_sid' must be a valid integer"}), 400

            option_data, spot_data, fut_data = Urls.fetch_data(symbol_id, exp_sid, seg_id)

            return {
                "symbol": symbol_id,
                "expiry": exp_sid,
                "options": option_data,
                "spot": spot_data,
                "fut": fut_data,
            }

        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": f"Server encountered an error: {str(e)}"}), 500

    def get_exp_date(symbol):
        try:
            if not symbol:
                return jsonify({"error": "Symbol parameter is required"}), 400

            if symbol not in Urls.symbol_list:
                return jsonify({"error": f"Invalid symbol: {symbol}. Valid symbols are: {list(Urls.symbol_list.keys())}"}), 400

            symbol_id = Urls.symbol_list[symbol]
            seg_id = Urls.seg_list[symbol]
            # print(f"Fetching expiry dates for symbol: {symbol} (ID: {symbol_id}, Seg: {seg_id})")

            try:
                fut_data = Urls.fetch_expiry(symbol_id, seg_id)
                if not fut_data:
                    return jsonify({"error": "No data received from API"}), 500
                
                # Check for error in response
                if isinstance(fut_data, dict) and 'error' in fut_data:
                    return jsonify({"error": fut_data['error']}), 500
                
                if isinstance(fut_data, dict):
                    expiry_list = fut_data.get('data', {}).get('explist', [])
                    if not expiry_list:
                        return jsonify({"error": "No expiry dates found"}), 404
                    
                    # Convert expiry dates to proper format if needed
                    formatted_expiry = []
                    for exp in expiry_list:
                        try:
                            # If exp is timestamp, convert to date string
                            if isinstance(exp, (int, float)):
                                # date_obj = datetime.fromtimestamp(exp)
                                # formatted_expiry.append(date_obj.strftime('%Y-%m-%d'))
                                formatted_expiry.append(str(exp))
                                # pass
                            else:
                                formatted_expiry.append(str(exp))
                        except Exception as e:
                            print(f"Error formatting expiry date {exp}: {str(e)}")
                            formatted_expiry.append(str(exp))
                    
                    return {
                        "symbol": symbol,
                        "symbol_id": symbol_id,
                        "expiry_dates": formatted_expiry,
                        "count": len(formatted_expiry)
                    }
                else:
                    print(f"Unexpected response type: {type(fut_data)}")
                    return jsonify({"error": "Invalid response format from API"}), 500

            except requests.exceptions.RequestException as e:
                print(f"API request failed: {str(e)}")
                return jsonify({"error": "Failed to connect to the external API"}), 503
            except Exception as e:
                print(f"Error processing expiry dates: {str(e)}")
                return jsonify({"error": str(e)}), 500

        except Exception as e:
            print(f"Error in get_exp_date: {str(e)}")
            traceback.print_exc()
            return jsonify({"error": f"Server encountered an error: {str(e)}"}), 500

    def get_percentage_data(symbol, exp, isCe, strike):
        try:
            FILE_PATH = "Percentage"
            # Define the IST timezone
            ist = pytz.timezone("Asia/Kolkata")
            curr_date_ist = datetime.now(ist).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            curr_date = int(curr_date_ist.timestamp())

            symbol_id = Urls.symbol_list[symbol]

            # Load data (assuming retrieve_data is a working function that loads JSON data correctly)
            retrived_data = retrieve_data(symbol_id, exp, curr_date, FILE_PATH)
            # print("Current Date Timestamp:", curr_date)

            with io.StringIO() as file:
                json.dump(retrived_data, file, indent=4)
                file.seek(0)
                data = json.load(file)

            # Initialize lists to store the extracted values
            timestamp = []
            oi = []
            oichng = []
            vol = []

            # Check if the expiry data is available
            if "day" in data and str(curr_date) in str(data["day"]):
                print("Day found in data.")
                for key, value in data["day"][str(curr_date)].items():
                    percent_type = "ce_data" if isCe else "pe_data"
                    percent_data = value.get(percent_type, {})

                    # Check if the specific strike price data exists
                    if str(strike) in percent_data.keys():
                        # print(strike, "2")
                        timestamp.append(key)
                        oi.append(percent_data[str(strike)].get("OI_percentage", 0))
                        oichng.append(
                            percent_data[str(strike)].get("oichng_percentage", 0)
                        )
                        vol.append(percent_data[str(strike)].get("vol_percentage", 0))
                    else:
                        return (
                            json.dumps(
                                {
                                    "error": "Strike not found",
                                    "symbol": symbol,
                                    "expiry": exp,
                                    "strike": strike,
                                }
                            ),
                            404,
                        )
            else:
                # Return error if the expiry or day data is not found
                print(f"Expiry {exp} or current date {curr_date} not found in data.")
                return (
                    json.dumps(
                        {
                            "error": "Expiry or date not found",
                            "symbol": symbol,
                            "expiry": exp,
                        }
                    ),
                    404,
                )

            # Return the extracted data as JSON response
            return (
                json.dumps(
                    {
                        "symbol": symbol,
                        "strike": strike,
                        "isCe": isCe,
                        "expiry": exp,
                        "timestamp": timestamp,
                        "oi": oi,
                        "oichng": oichng,
                        "vol": vol,
                    }
                ),
                200,
            )

        except Exception as e:
            # Log the error for debugging (you might use logging here in a real application)
            print(f"An error occurred: {str(e)}")
            # Return internal server error for any unhandled exceptions
            return json.dumps({"error": "Internal Server Error"}), 500

    def get_iv_data(symbol, exp, isCe, strike):
        try:
            FILE_PATH = "Delta"

            # Define the IST timezone
            ist = pytz.timezone("Asia/Kolkata")
            curr_date_ist = datetime.now(ist).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            curr_date = int(curr_date_ist.timestamp())

            symbol_id = Urls.symbol_list[symbol]

            # Retrieve data directly without file I/O (use in-memory data)
            data = retrieve_data(symbol_id, exp, curr_date, FILE_PATH)
            with io.StringIO() as file:
                json.dump(data, file, indent=4)
                file.seek(0)
                data = json.load(file)

            # Initialize lists to store the extracted values
            timestamp = []
            ce_iv = []
            ce_delta, ce_gamma, ce_theta, ce_vega, ce_rho = [], [], [], [], []
            pe_iv = []
            pe_delta, pe_gamma, pe_theta, pe_vega, pe_rho = [], [], [], [], []

            # Check if the "day" field is available
            if "day" in data:
                # Extract the data for the current date
                day_data = data["day"].get(str(curr_date))

                for key, value in day_data.items():
                    ce_percent_data = value.get("ce_data")
                    pe_percent_data = value.get("pe_data")

                    # Ensure the strike exists in the data for the selected option type
                    if (
                        str(strike) in ce_percent_data
                        and str(strike) in pe_percent_data
                    ):
                        timestamp.append(key)
                        ce_iv.append(ce_percent_data[strike].get("iv", 0))
                        pe_iv.append(pe_percent_data[strike].get("iv", 0))
                        ce_delta.append(
                            ce_percent_data[strike]["optgeeks"].get("delta", 0)
                        )
                        pe_delta.append(
                            pe_percent_data[strike]["optgeeks"].get("delta", 0)
                        )
                        ce_theta.append(
                            ce_percent_data[strike]["optgeeks"].get("theta", 0)
                        )
                        pe_theta.append(
                            pe_percent_data[strike]["optgeeks"].get("theta", 0)
                        )
                        ce_gamma.append(
                            ce_percent_data[strike]["optgeeks"].get("gamma", 0)
                        )
                        pe_gamma.append(
                            pe_percent_data[strike]["optgeeks"].get("gamma", 0)
                        )
                        ce_vega.append(
                            ce_percent_data[strike]["optgeeks"].get("vega", 0)
                        )
                        pe_vega.append(
                            pe_percent_data[strike]["optgeeks"].get("vega", 0)
                        )
                        ce_rho.append(ce_percent_data[strike]["optgeeks"].get("rho", 0))
                        pe_rho.append(pe_percent_data[strike]["optgeeks"].get("rho", 0))
                    else:
                        # If strike is not found in the data
                        return (
                            jsonify(
                                {
                                    "error": "Strike not found",
                                    "symbol": symbol,
                                    "expiry": exp,
                                }
                            ),
                            404,
                        )
            else:
                # If "day" is not found in the data
                return (
                    jsonify(
                        {
                            "error": "Expiry not found",
                            "symbol": symbol,
                        }
                    ),
                    404,
                )

            # Return the extracted data as JSON
            return (
                jsonify(
                    {
                        "symbol": symbol,
                        "strike": strike,
                        "isCe": isCe,
                        "expiry": exp,
                        "timestamp": timestamp,
                        "ce_iv": ce_iv,
                        "ce_delta": ce_delta,
                        "ce_theta": ce_theta,
                        "ce_gamma": ce_gamma,
                        "ce_vega": ce_vega,
                        "ce_rho": ce_rho,
                        "pe_iv": pe_iv,
                        "pe_delta": pe_delta,
                        "pe_theta": pe_theta,
                        "pe_gamma": pe_gamma,
                        "pe_vega": pe_vega,
                        "pe_rho": pe_rho,
                    }
                ),
                200,
            )

        except Exception as e:
            # Return a generic internal server error message if something fails
            return jsonify({"error": "Internal Server Error"}), 500

    def get_delta_data(symbol, exp, strike):
        """Function to retrieve percentage data from the JSON file."""
        try:
            FILE_PATH = "Delta"

            # Define the IST timezone
            ist = pytz.timezone("Asia/Kolkata")
            curr_date_ist = datetime.now(ist).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            curr_date = int(curr_date_ist.timestamp())

            symbol_id = Urls.symbol_list[symbol]

            # Retrieve data for the specific expiry and current date
            data = retrieve_data(symbol_id, exp, curr_date, FILE_PATH)

            with io.StringIO() as file:
                json.dump(data, file, indent=4)
                file.seek(0)
                data = json.load(file)

            # Initialize lists to store the extracted values
            timestamp = []
            ceoi = []
            ceoichng = []
            cevol = []
            peoi = []
            peoichng = []
            pevol = []
            peminusce_vol = []
            pebyce_vol = []
            peminusce_oi = []
            pebyce_oi = []
            peminusce_oichng = []
            pebyce_oichng = []

            # Check if the expiry exists in the data
            if "day" in data and str(curr_date) in data["day"]:
                # Iterate over the timestamps within the current date
                for key, value in data["day"][str(curr_date)].items():
                    percent_datace = value.get("ce_data", {})
                    percent_datape = value.get("pe_data", {})

                    # Check if the strike exists in ce_data and pe_data
                    if str(strike) in percent_datace and str(strike) in percent_datape:
                        timestamp.append(key)

                        # Extract CE data values with default values if not found
                        ceoi.append(percent_datace[str(strike)].get("OI", 0))
                        ceoichng.append(percent_datace[str(strike)].get("oichng", 0))
                        cevol.append(percent_datace[str(strike)].get("vol", 0))

                        # Extract PE data values with default values if not found
                        peoi.append(percent_datape[str(strike)].get("OI", 0))
                        peoichng.append(percent_datape[str(strike)].get("oichng", 0))
                        pevol.append(percent_datape[str(strike)].get("vol", 0))

                        # Calculate additional metrics
                        peminusce_vol.append(pevol[-1] - cevol[-1])
                        pebyce_vol.append(
                            pevol[-1] / cevol[-1] if cevol[-1] != 0 else None
                        )
                        peminusce_oi.append(peoi[-1] - ceoi[-1])
                        pebyce_oi.append(peoi[-1] / ceoi[-1] if ceoi[-1] != 0 else None)
                        peminusce_oichng.append(peoichng[-1] - ceoichng[-1])
                        pebyce_oichng.append(
                            peoichng[-1] / ceoichng[-1] if ceoichng[-1] != 0 else None
                        )
                    else:
                        # Return error if the strike is not found
                        return (
                            jsonify(
                                {
                                    "error": "Strike not found",
                                    "symbol": symbol,
                                    "expiry": exp,
                                }
                            ),
                            404,
                        )

            else:
                # Return error if the expiry is not found
                return (
                    jsonify(
                        {
                            "error": "Expiry not found",
                            "symbol": symbol,
                        }
                    ),
                    404,
                )

            # Return JSON response with the collected data
            return (
                jsonify(
                    {
                        "symbol": symbol,
                        "strike": strike,
                        "expiry": exp,
                        "timestamp": timestamp,
                        "ce_oi": ceoi,
                        "ce_oichng": ceoichng,
                        "ce_vol": cevol,
                        "pe_oi": peoi,
                        "pe_oichng": peoichng,
                        "pe_vol": pevol,
                        "peminusce_vol": peminusce_vol,
                        "pebyce_vol": pebyce_vol,
                        "peminusce_oi": peminusce_oi,
                        "pebyce_oi": pebyce_oi,
                        "peminusce_oichng": peminusce_oichng,
                        "pebyce_oichng": pebyce_oichng,
                    }
                ),
                200,
            )

        except Exception as e:
            # Log the error for debugging
            print(f"An error occurred: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

    def get_fut_data(symbol, exp):
        """Function to retrieve percentage data from the JSON file."""
        try:
            FILE_PATH = "Future"

            # Define the IST timezone
            ist = pytz.timezone("Asia/Kolkata")
            curr_date_ist = datetime.now(ist).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            curr_date = int(curr_date_ist.timestamp())

            symbol_id = Urls.symbol_list[symbol]

            data = retrieve_data(symbol_id, exp, curr_date, FILE_PATH)

            with io.StringIO() as file:
                json.dump(data, file, indent=4)
                file.seek(0)
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
                        return (
                            jsonify(
                                {
                                    "error": "Strike not found",
                                    "symbol": symbol,
                                    "expiry": exp,
                                }
                            ),
                            404,
                        )

            else:
                # Return error if the expiry is not found
                return (
                    jsonify(
                        {
                            "error": "Expiry not found",
                            "symbol": symbol,
                        }
                    ),
                    404,
                )

            print("Data processing completed successfully.")

            return (
                jsonify(
                    {
                        "symbol": symbol,
                        "expiry": exp,
                        "timestamp": timestamp,
                        "oi": oi,
                        "oichng": oichng,
                        "vol": vol,
                        "ltp": ltp,
                    }
                ),
                200,
            )

        except Exception as e:
            # Log the error for debugging
            print(f"An error occurred: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

    @staticmethod
    def get_percentage_data(sid, exp_sid, strike, option_type):
        try:
            if sid not in Urls.symbol_list:
                raise ValueError("Invalid symbol")

            symbol_id = Urls.symbol_list[sid]
            seg_id = Urls.seg_list[sid]

            try:
                exp_sid = int(exp_sid)
                strike = float(strike)
            except (ValueError, TypeError):
                raise ValueError("Invalid expiry or strike value")

            # Get option data
            option_data, _, _ = Urls.fetch_data(symbol_id, exp_sid, seg_id)
            
            # Find the specific option
            options = option_data.get('data', {}).get('oc', {}).get('data', [])
            target_option = None
            
            for option in options:
                if (float(option.get('strike')) == strike and 
                    option.get('option_type').upper() == option_type.upper()):
                    target_option = option
                    break
            
            if not target_option:
                raise ValueError("Option not found")
                
            # Calculate percentage data
            result = {
                'strike': strike,
                'option_type': option_type,
                'ltp': target_option.get('ltp'),
                'change_percentage': target_option.get('change_percentage'),
                'iv': target_option.get('iv'),
                'volume': target_option.get('volume'),
                'oi': target_option.get('oi'),
                'delta': target_option.get('delta'),
                'theta': target_option.get('theta'),
                'gamma': target_option.get('gamma')
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Error calculating percentage data: {str(e)}")

    @staticmethod
    def get_iv_data(sid, exp_sid, strike, option_type):
        try:
            if sid not in Urls.symbol_list:
                raise ValueError("Invalid symbol")

            symbol_id = Urls.symbol_list[sid]
            seg_id = Urls.seg_list[sid]

            try:
                exp_sid = int(exp_sid)
                strike = float(strike)
            except (ValueError, TypeError):
                raise ValueError("Invalid expiry or strike value")

            # Get option data
            option_data, _, _ = Urls.fetch_data(symbol_id, exp_sid, seg_id)
            
            # Find the specific option
            options = option_data.get('data', {}).get('oc', {}).get('data', [])
            target_option = None
            
            for option in options:
                if (float(option.get('strike')) == strike and 
                    option.get('option_type').upper() == option_type.upper()):
                    target_option = option
                    break
            
            if not target_option:
                raise ValueError("Option not found")
                
            # Calculate IV data
            result = {
                'strike': strike,
                'option_type': option_type,
                'iv': target_option.get('iv'),
                'iv_percentile': target_option.get('iv_percentile'),
                'iv_historical': target_option.get('iv_historical', []),
                'vega': target_option.get('vega'),
                'theta': target_option.get('theta')
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Error calculating IV data: {str(e)}")

    @staticmethod
    def get_delta_data(sid, exp_sid, strike):
        try:
            if sid not in Urls.symbol_list:
                raise ValueError("Invalid symbol")

            symbol_id = Urls.symbol_list[sid]
            seg_id = Urls.seg_list[sid]

            try:
                exp_sid = int(exp_sid)
                strike = float(strike)
            except (ValueError, TypeError):
                raise ValueError("Invalid expiry or strike value")

            # Get option data
            option_data, _, _ = Urls.fetch_data(symbol_id, exp_sid, seg_id)
            
            # Find the CE and PE options for the strike
            options = option_data.get('data', {}).get('oc', {}).get('data', [])
            ce_option = None
            pe_option = None
            
            for option in options:
                if float(option.get('strike')) == strike:
                    if option.get('option_type').upper() == 'CE':
                        ce_option = option
                    elif option.get('option_type').upper() == 'PE':
                        pe_option = option
                        
                if ce_option and pe_option:
                    break
            
            if not ce_option or not pe_option:
                raise ValueError("Options not found")
                
            # Calculate delta data
            result = {
                'strike': strike,
                'ce_delta': ce_option.get('delta'),
                'pe_delta': pe_option.get('delta'),
                'ce_gamma': ce_option.get('gamma'),
                'pe_gamma': pe_option.get('gamma'),
                'ce_theta': ce_option.get('theta'),
                'pe_theta': pe_option.get('theta'),
                'ce_vega': ce_option.get('vega'),
                'pe_vega': pe_option.get('vega')
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Error calculating delta data: {str(e)}")

    @staticmethod
    def get_future_price_data(sid, exp_sid, strike):
        try:
            if sid not in Urls.symbol_list:
                raise ValueError("Invalid symbol")

            symbol_id = Urls.symbol_list[sid]
            seg_id = Urls.seg_list[sid]

            try:
                exp_sid = int(exp_sid)
                strike = float(strike)
            except (ValueError, TypeError):
                raise ValueError("Invalid expiry or strike value")

            # Get option and futures data
            option_data, _, fut_data = Urls.fetch_data(symbol_id, exp_sid, seg_id)
            
            # Get futures price and other data
            fut_price = fut_data.get('data', {}).get('Ltp')
            if not fut_price:
                raise ValueError("Future price not available")
                
            # Find the CE and PE options for the strike
            options = option_data.get('data', {}).get('oc', {}).get('data', [])
            ce_option = None
            pe_option = None
            
            for option in options:
                if float(option.get('strike')) == strike:
                    if option.get('option_type').upper() == 'CE':
                        ce_option = option
                    elif option.get('option_type').upper() == 'PE':
                        pe_option = option
                        
                if ce_option and pe_option:
                    break
            
            if not ce_option or not pe_option:
                raise ValueError("Options not found")
                
            # Calculate future price data
            result = {
                'strike': strike,
                'future_price': fut_price,
                'ce_price': ce_option.get('ltp'),
                'pe_price': pe_option.get('ltp'),
                'ce_oi': ce_option.get('oi'),
                'pe_oi': pe_option.get('oi'),
                'ce_volume': ce_option.get('volume'),
                'pe_volume': pe_option.get('volume'),
                'price_difference': float(fut_price) - strike if fut_price else None
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Error calculating future price data: {str(e)}")
