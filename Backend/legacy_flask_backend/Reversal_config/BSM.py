import math
import scipy.stats as stats


class BSM:
    # Static method to calculate Black-Scholes price for Call and Put
    @staticmethod
    def black_scholes_price(S, K, T, r, sigma, option_type="call"):
        # Calculate d1 and d2
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)

        # Call option price
        if option_type == "call":
            price = S * stats.norm.cdf(d1) - K * math.exp(-r * T) * stats.norm.cdf(d2)
        # Put option price
        elif option_type == "put":
            price = K * math.exp(-r * T) * stats.norm.cdf(-d2) - S * stats.norm.cdf(-d1)

        return round(price, 2)

    @staticmethod
    def adjusted_reversal_price(
        curr_call_price,
        curr_put_price,
        strike_price,
        call_theoretical_price,
        put_theoretical_price,
        call_iv,
        put_iv,
        alpha,
        pe_delta,
        ce_delta,
    ):
        # Calculate adjusted prices for reversal strategies
        sr = (
            strike_price
            + (
                (curr_put_price - put_theoretical_price)
                - (curr_call_price - call_theoretical_price)
            )
            + alpha * (put_iv - call_iv)
        )

        rr = (
            strike_price
            + (
                abs(curr_put_price - put_theoretical_price)
                - abs(curr_call_price - call_theoretical_price)
            )
            - alpha * (put_iv - call_iv)
        )

        rs = (
            strike_price
            + ((curr_put_price - put_theoretical_price) * pe_delta)
            - ((curr_call_price - call_theoretical_price) * ce_delta)
            + alpha * (put_iv - call_iv)
        )

        ss = (
            strike_price
            - (
                (curr_call_price - call_theoretical_price)
                - (curr_put_price - put_theoretical_price)
            )
            - alpha * ((call_iv - put_iv))
        )

        return round(sr, 2), round(rs, 2), round(rr, 2), round(ss, 2)

    @staticmethod
    def get_reversal(
        S,
        K,
        T_days,
        sigma_call,
        sigma_put,
        curr_call_price,
        curr_put_price,
        pe_delta,
        ce_delta,
    ):
        try:
            # Parse and round form input
            S = round(float(S), 2)
            T_days = float(T_days)
            sigma_call = float(sigma_call) / 100
            sigma_put = float(sigma_put) / 100
            curr_call_price = round(float(curr_call_price), 2)
            curr_put_price = round(float(curr_put_price), 2)
            pe_delta = round(float(pe_delta), 2)
            ce_delta = round(float(ce_delta), 2)
            r = 0.10
            # print(T_days)
            T = T_days / 365

            if sigma_call <= 0:
                if sigma_put > 0:
                    sigma_call = sigma_put
                else:
                    sigma_call = 15

            if sigma_put <= 0:
                if sigma_call > 0:
                    sigma_put = sigma_call
                else:
                    sigma_put = 15

            # print(S, K, T, r, sigma_call, sigma_put, curr_call_price, curr_put_price)

            # Calculate theoretical Call and Put option prices
            call_price = BSM.black_scholes_price(
                S, K, T, r, sigma_call, option_type="call"
            )
            put_price = BSM.black_scholes_price(
                S, K, T, r, sigma_put, option_type="put"
            )

            # Calculate alpha based on price difference
            alpha = put_price - call_price

            # Calculate adjusted reversal prices
            sr, rs, rr, ss = BSM.adjusted_reversal_price(
                curr_call_price,
                curr_put_price,
                K,
                call_price,
                put_price,
                sigma_call,
                sigma_put,
                alpha,
                pe_delta,
                ce_delta,
            )

            # Calculate difference between sr and rr
            sr_diff = round(sr - rr, 2)

            # Define the data dictionary
            data = {
                "strike_price": K,
                "ce_tv": call_price,
                "pe_tv": put_price,
                "difference": sr_diff,
                "reversal": sr,
                "rs": rs,
                "rr": rr,
                "ss": ss,
                "sr_diff": sr_diff,
            }

            return data
        except Exception as e:
            return {"error_message": "Error in input values. Please check your input."}
