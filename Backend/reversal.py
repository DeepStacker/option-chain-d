import json
from BSM import BSM
from time_cal import get_time_diff_in_days


def reversal_calculator(option_chain, exp):
    try:
        # Extract data from option_chain
        data = option_chain["data"]["oc"]
        sltp = option_chain["data"]["sltp"]

        if option_chain["data"]["u_id"] == 294:
            S_chng = 0
        else:
            S_chng = option_chain["data"]["SChng"]

        iv_chng = option_chain["data"]["aivperchng"]

        if option_chain["data"]["aivperchng"] == 0:
            iv_chng = (10) / 100
        else:
            iv_chng = (option_chain["data"]["aivperchng"]) / 100

        # print(sltp, S_chng, iv_chng)

        # Convert strikes to float and calculate time in days
        strikes = [float(strike) for strike in data.keys()]
        T = get_time_diff_in_days(int(exp))

        # Initialize lists for CE and PE values
        ce_iv, ce_ltp, ce_delta, ce_vega, ce_gamma, ce_theta = [], [], [], [], [], []
        pe_iv, pe_ltp, pe_delta, pe_vega, pe_gamma, pe_theta = [], [], [], [], [], []

        # Extract CE and PE data
        for values in data.values():
            ce_data = values.get("ce", {})
            pe_data = values.get("pe", {})

            # Check and append values with fallback to 0.001 if value is 0
            ce_iv.append(float(ce_data.get("iv", 0)))
            ce_ltp.append(float(ce_data.get("ltp", 0)))

            ce_delta_value = float(ce_data.get("optgeeks", {}).get("delta", 0))
            ce_delta.append(ce_delta_value if ce_delta_value != 0 else 0.5)

            ce_vega_value = float(ce_data.get("optgeeks", {}).get("vega", 0))
            ce_vega.append(ce_vega_value if ce_vega_value != 0 else 6.21)

            ce_gamma_value = float(ce_data.get("optgeeks", {}).get("gamma", 0))
            ce_gamma.append(ce_gamma_value if ce_gamma_value != 0 else 0.001)

            ce_theta_value = float(ce_data.get("optgeeks", {}).get("theta", 0))
            ce_theta.append(ce_theta_value if ce_theta_value != 0 else -1.0)

            pe_iv.append(float(pe_data.get("iv", 0)))
            pe_ltp.append(float(pe_data.get("ltp", 0)))

            pe_delta_value = float(pe_data.get("optgeeks", {}).get("delta", 0))
            pe_delta.append(pe_delta_value if pe_delta_value != 0 else -0.5)

            pe_vega_value = float(pe_data.get("optgeeks", {}).get("vega", 0))
            pe_vega.append(pe_vega_value if pe_vega_value != 0 else 6.2)

            pe_gamma_value = float(pe_data.get("optgeeks", {}).get("gamma", 0))
            pe_gamma.append(pe_gamma_value if pe_gamma_value != 0 else 0.001)

            pe_theta_value = float(pe_data.get("optgeeks", {}).get("theta", 0))
            pe_theta.append(pe_theta_value if pe_theta_value != 0 else -1.0)

        # Calculate reversals for each strike and store results in option_chain
        for i, strike in enumerate(strikes):
            strike_key = int(strike)  # Convert strike back to string to match data keys
            if str(strike_key) not in data.keys():
                print(f"Strike {strike_key} not found in data.")
                continue  # Skip this strike if key is not found

            try:
                # Call the BSM get_reversal function
                reversal_data = BSM.get_reversal(
                    S=sltp,
                    S_chng=S_chng,
                    iv_chng=iv_chng,
                    K=strike_key,
                    T_days=T,
                    sigma_call=ce_iv[i],
                    sigma_put=pe_iv[i],
                    curr_call_price=ce_ltp[i],
                    curr_put_price=pe_ltp[i],
                    ce_delta=ce_delta[i],
                    pe_delta=pe_delta[i],
                    ce_vega=ce_vega[i],
                    pe_vega=pe_vega[i],
                    ce_gamma=ce_gamma[i],
                    pe_gamma=pe_gamma[i],
                    pe_theta=pe_theta[i],
                    ce_theta=ce_theta[i],
                )

                # Add the reversal data to option_chain
                data[str(strike_key)]["reversal"] = reversal_data

            except Exception as e:
                print(f"Error calculating reversal for strike {strike}: {e}")
                continue  # Continue with the next strike in case of error

        return option_chain  # Return the modified option_chain with reversal data

    except json.JSONDecodeError as e:
        print("Error reading JSON data:", e)
        return option_chain
    except FileNotFoundError as e:
        print("Error: JSON file not found:", e)
        return option_chain
    except Exception as e:
        print("An unexpected error occurred:", e)
        return option_chain


# Example usage:
# Assume option_chain is a dictionary loaded with JSON data
# exp = some integer timestamp or value for expiration
# modified_option_chain = reversal_calculator(option_chain, exp)
# print(json.dumps(modified_option_chain, indent=2))
