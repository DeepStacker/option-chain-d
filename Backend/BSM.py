import math
import scipy.stats as stats
import numpy as np
from avp import advanced_reversal_point


class BSMCalculator:
    RISK_FREE_RATE = 0.10

    @staticmethod
    def black_scholes_price(S, K, T, r, sigma, option_type="call"):
        if S <= 0 or K <= 0 or T <= 0 or sigma <= 0:
            return 0.0
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)
        if option_type == "call":
            price = S * stats.norm.cdf(d1) - K * math.exp(-r * T) * stats.norm.cdf(d2)
        elif option_type == "put":
            price = K * math.exp(-r * T) * stats.norm.cdf(-d2) - S * stats.norm.cdf(-d1)
        else:
            raise ValueError("option_type must be 'call' or 'put'")
        return max(round(price, 2), 0.0)

    @staticmethod
    def greeks(S, K, T, r, sigma, option_type="call"):
        if S <= 0 or K <= 0 or T <= 0 or sigma <= 0:
            return {g: 0.0 for g in ["delta", "gamma", "vega", "theta", "rho"]}
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)
        nd1 = stats.norm.pdf(d1)
        if option_type == "call":
            delta = stats.norm.cdf(d1)
            theta = (
                -S * nd1 * sigma / (2 * math.sqrt(T))
                - r * K * math.exp(-r * T) * stats.norm.cdf(d2)
            ) / 365
            rho = K * T * math.exp(-r * T) * stats.norm.cdf(d2) / 100
        else:
            delta = -stats.norm.cdf(-d1)
            theta = (
                -S * nd1 * sigma / (2 * math.sqrt(T))
                + r * K * math.exp(-r * T) * stats.norm.cdf(-d2)
            ) / 365
            rho = -K * T * math.exp(-r * T) * stats.norm.cdf(-d2) / 100
        gamma = nd1 / (S * sigma * math.sqrt(T))
        vega = S * nd1 * math.sqrt(T) / 100
        return {
            "delta": round(delta, 4),
            "gamma": round(gamma, 6),
            "vega": round(vega, 4),
            "theta": round(theta, 4),
            "rho": round(rho, 4),
        }

    @staticmethod
    def weekly_theta_decay(T_days):
        return max(0.5, 1.5 - 0.1 * T_days)

    @staticmethod
    def expected_price_range(S, iv, T_days, confidence=0.68):
        std_dev = iv * math.sqrt(T_days / 365)
        z_score = stats.norm.ppf(0.5 + confidence / 2)
        low = max(round(S * math.exp(-z_score * std_dev), 2), 0.0)
        high = max(round(S * math.exp(z_score * std_dev), 2), 0.0)
        return (low, high)

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
        wkly_rev = strike_price + (
            (curr_put_price - put_theoretical_price)
            + (curr_call_price - call_theoretical_price)
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
        return round(wkly_rev, 2), round(rs, 2), round(rr, 2), round(ss, 2)

    @staticmethod
    def get_reversal(
        S,
        S_chng,
        iv_chng,
        K,
        T_days,
        sigma_call,
        sigma_put,
        curr_call_price,
        curr_put_price,
        pe_delta,
        ce_delta,
        ce_vega,
        pe_vega,
        ce_gamma,
        pe_gamma,
        pe_theta,
        ce_theta,
        fut_price=0,
        atmiv=0,
        sinst="IDX",
    ):
        try:
            S = round(float(S), 4)
            T_days = max(float(T_days), 0.01)
            sigma_call = float(sigma_call) / 100
            sigma_put = float(sigma_put) / 100
            curr_call_price = round(float(curr_call_price), 4)
            curr_put_price = round(float(curr_put_price), 4)
            pe_delta = round(float(pe_delta), 4)
            ce_delta = round(float(ce_delta), 4)
            r = BSMCalculator.RISK_FREE_RATE
            T = T_days / 365

            if sigma_call <= 0:
                sigma_call = sigma_put if sigma_put > 0 else 0.15
            if sigma_put <= 0:
                sigma_put = sigma_call if sigma_call > 0 else 0.15

            call_price = BSMCalculator.black_scholes_price(S, K, T, r, sigma_call, "call")
            put_price = BSMCalculator.black_scholes_price(S, K, T, r, sigma_put, "put")
            call_greeks = BSMCalculator.greeks(S, K, T, r, sigma_call, "call")
            put_greeks = BSMCalculator.greeks(S, K, T, r, sigma_put, "put")
            alpha = put_price - call_price

            wkly_rev, rs, rr, ss = BSMCalculator.adjusted_reversal_price(
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

            rev, confidence, all_data = advanced_reversal_point(
                K,
                ce_delta,
                pe_delta,
                ce_gamma,
                pe_gamma,
                ce_vega,
                pe_vega,
                ce_theta,
                pe_theta,
                iv_chng,
                T_days,
                curr_call_price, # ce_ltp
                curr_put_price, # pe_ltp
                call_price, # ce_theory
                put_price, # pe_theory
                S_chng=S_chng,
                instrument_type=sinst,
                current_iv=atmiv,
                spot_price=S,
            )

            iv_skew = sigma_call - sigma_put
            if abs(iv_skew) > 0.01:
                weight = 0.5 + (iv_skew / max(sigma_call, sigma_put)) * 0.5
                volatility_weight = max(0, min(1, weight))
            else:
                volatility_weight = 0.5

            effective_iv = (
                volatility_weight * sigma_call + (1 - volatility_weight) * sigma_put
            )

            price_low, price_high = BSMCalculator.expected_price_range(S, effective_iv, T_days)
            range_pct = (price_high - price_low) / S
            rr_base = 2.5 if range_pct < 0.01 else 1.5 if range_pct < 0.02 else 1.0

            entry_price = round(rev, 2)
            stop_loss = round(rev - (rev * 0.005 * rr_base), 2)
            take_profit = round(entry_price + (entry_price - stop_loss) * rr_base, 2)

            risk = round(entry_price - stop_loss, 2)
            reward = round(take_profit - entry_price, 2)
            risk_reward_ratio = round(reward / risk, 2) if risk > 0 else "NA"

            sr_diff = round(wkly_rev - rr, 4)
            fut_rev = round(rev + (fut_price - S), 4)

            return {
                "strike_price": K,
                "ce_tv": call_price,
                "pe_tv": put_price,
                "difference": sr_diff,
                "reversal": round(rev, 2),
                "wkly_reversal": wkly_rev,
                "rs": rs,
                "rr": rr,
                "ss": ss,
                "sr_diff": sr_diff,
                "fut_reversal": fut_rev,
                "call_greeks": call_greeks,
                "put_greeks": put_greeks,
                "price_range": {
                    "low": price_low,
                    "high": price_high,
                    "confidence": "68%",
                },
                "trading_signals": {
                    "entry": entry_price,
                    "stop_loss": stop_loss,
                    "take_profit": take_profit,
                    "risk_reward": risk_reward_ratio,
                },
                "time_decay": BSMCalculator.weekly_theta_decay(T_days),
            }
        except Exception as e:
            return {
                "error_message": f"Error in reversal calculation: {str(e)}",
                "strike": K,
            }
