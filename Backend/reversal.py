import json
import numpy as np
from BSM import BSMCalculator
from time_cal import get_time_diff_in_days
from Utils import Utils


def detect_volatility_regime(iv_series, low_thres=0.15, med_thres=0.30):
    """Detect market volatility regime based on IV levels."""
    if not iv_series:
        return "unknown"
    avg_iv = np.mean(iv_series)
    if avg_iv < low_thres:
        return "low"
    elif avg_iv < med_thres:
        return "medium"
    else:
        return "high"


def detect_trend_regime(price_series, window=5, threshold_ratio=0.0005):
    """Detect market trend regime based on recent price action."""
    if len(price_series) < window:
        return "unknown"

    sma = np.mean(price_series[-window:])
    price_changes = np.diff(price_series[-window - 1 :])
    avg_direction = np.mean(price_changes)

    if abs(avg_direction) < threshold_ratio * sma:
        return "sideways"
    elif avg_direction > 0:
        return "bullish"
    else:
        return "bearish"


def liquidity_adjustment(oi, avg_oi, low_liq=0.5, high_liq=2.0):
    """Adjust for liquidity risk based on open interest."""
    if avg_oi <= 0:
        return 1.0
    ratio = oi / avg_oi
    if ratio > high_liq:
        return 1.2
    elif ratio < low_liq:
        return 0.8
    else:
        return 1.0


def reversal_calculator(option_chain, exp):
    try:
        T = max(get_time_diff_in_days(int(exp)), 0.01)
        
        data = Utils.get_greeks(option_chain=option_chain, T=T)
        

        data = data["data"]["oc"]
        sltp = option_chain["data"]["sltp"]
        fut_price_key = list(dict(option_chain["data"]["fl"]).keys())[0]
        fut_price = option_chain["data"]["fl"][str(fut_price_key)]["ltp"]
        atmiv = option_chain["data"]["atmiv"]
        sinst = option_chain["data"]["sinst"]

        S_chng = (
            0
            if option_chain["data"]["u_id"] == 294
            else option_chain["data"].get("SChng", 0)
        )
        iv_chng = option_chain["data"].get("aivperchng", 10) / 100

        strikes = [k for k in data.keys()]

        (
            ce_iv,
            ce_ltp,
            ce_delta,
            ce_vega,
            ce_gamma,
            ce_theta,
            ce_oi,
            ce_rho,
            ce_vomma,
            ce_vanna,
            ce_charm,
            ce_speed,
            ce_zomma,
            ce_color,
            ce_ultima,
        ) = (
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        )
        (
            pe_iv,
            pe_ltp,
            pe_delta,
            pe_vega,
            pe_gamma,
            pe_theta,
            pe_oi,
            pe_rho,
            pe_vomma,
            pe_vanna,
            pe_charm,
            pe_speed,
            pe_zomma,
            pe_color,
            pe_ultima,
        ) = (
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        )

        for values in data.values():
            ce_data = values.get("ce", {})
            pe_data = values.get("pe", {})

            ce_iv.append(float(ce_data.get("iv", 0)))
            ce_ltp.append(float(ce_data.get("ltp", 0)))
            ce_delta.append(float(ce_data.get("optgeeks", {}).get("delta", 0)) or 0.5)
            ce_vega.append(float(ce_data.get("optgeeks", {}).get("vega", 0)) or 6.21)
            ce_gamma.append(float(ce_data.get("optgeeks", {}).get("gamma", 0)) or 0.001)
            ce_theta.append(float(ce_data.get("optgeeks", {}).get("theta", 0)) or -1.0)
            ce_rho.append(float(ce_data.get("optgeeks", {}).get("rho", 0)) or -1.0)
            ce_vomma.append(float(ce_data.get("optgeeks", {}).get("vomma", 0)) or -1.0)
            ce_vanna.append(float(ce_data.get("optgeeks", {}).get("vanna", 0)) or -1.0)
            ce_charm.append(float(ce_data.get("optgeeks", {}).get("charm", 0)) or -1.0)
            ce_speed.append(float(ce_data.get("optgeeks", {}).get("speed", 0)) or -1.0)
            ce_zomma.append(float(ce_data.get("optgeeks", {}).get("zomma", 0)) or -1.0)
            ce_color.append(float(ce_data.get("optgeeks", {}).get("color", 0)) or -1.0)
            ce_ultima.append(
                float(ce_data.get("optgeeks", {}).get("ultima", 0)) or -1.0
            )
            ce_oi.append(float(ce_data.get("OI", 0)))

            pe_iv.append(float(pe_data.get("iv", 0)))
            pe_ltp.append(float(pe_data.get("ltp", 0)))
            pe_delta.append(float(pe_data.get("optgeeks", {}).get("delta", 0)) or -0.5)
            pe_vega.append(float(pe_data.get("optgeeks", {}).get("vega", 0)) or 6.2)
            pe_gamma.append(float(pe_data.get("optgeeks", {}).get("gamma", 0)) or 0.001)
            pe_theta.append(float(pe_data.get("optgeeks", {}).get("theta", 0)) or -1.0)
            pe_rho.append(float(pe_data.get("optgeeks", {}).get("rho", 0)) or -1.0)
            pe_vomma.append(float(pe_data.get("optgeeks", {}).get("vomma", 0)) or -1.0)
            pe_vanna.append(float(pe_data.get("optgeeks", {}).get("vanna", 0)) or -1.0)
            pe_charm.append(float(pe_data.get("optgeeks", {}).get("charm", 0)) or -1.0)
            pe_speed.append(float(pe_data.get("optgeeks", {}).get("speed", 0)) or -1.0)
            pe_zomma.append(float(pe_data.get("optgeeks", {}).get("zomma", 0)) or -1.0)
            pe_color.append(float(pe_data.get("optgeeks", {}).get("color", 0)) or -1.0)
            pe_ultima.append(
                float(pe_data.get("optgeeks", {}).get("ultima", 0)) or -1.0
            )
            pe_oi.append(float(pe_data.get("OI", 0)))

        iv_series = [iv / 100 for iv in ce_iv + pe_iv if iv > 0]
        vol_regime = detect_volatility_regime(iv_series)

        price_series = [sltp]
        trend_regime = (
            detect_trend_regime(price_series) if len(price_series) > 5 else "unknown"
        )

        avg_ce_oi = np.mean(ce_oi) if ce_oi else 1
        avg_pe_oi = np.mean(pe_oi) if pe_oi else 1

        for i, strike_str in enumerate(strikes):
            try:
                strike = float(strike_str)

                liq_adj_ce = liquidity_adjustment(ce_oi[i], avg_ce_oi)
                liq_adj_pe = liquidity_adjustment(pe_oi[i], avg_pe_oi)
                liq_adj = (liq_adj_ce + liq_adj_pe) / 2

                reversal_data = BSMCalculator.get_reversal(
                    S=sltp,
                    S_chng=S_chng,
                    iv_chng=iv_chng,
                    K=strike,
                    T_days=T,
                    sigma_call=ce_iv[i],
                    sigma_put=pe_iv[i],
                    curr_call_price=ce_ltp[i],
                    curr_put_price=pe_ltp[i],
                    pe_delta=pe_delta[i],
                    ce_delta=ce_delta[i],
                    ce_vega=ce_vega[i],
                    pe_vega=pe_vega[i],
                    ce_gamma=ce_gamma[i],
                    pe_gamma=pe_gamma[i],
                    pe_theta=pe_theta[i],
                    ce_theta=ce_theta[i],
                    ce_rho=ce_rho[i],
                    pe_rho=pe_rho[i],
                    ce_vomma=ce_vomma[i],
                    pe_vomma=pe_vomma[i],
                    ce_vanna=ce_vanna[i],
                    pe_vanna=pe_vanna[i],
                    ce_charm=ce_charm[i],
                    pe_charm=pe_charm[i],
                    ce_speed=ce_speed[i],
                    pe_speed=pe_speed[i],
                    ce_zomma=ce_zomma[i],
                    pe_zomma=pe_zomma[i],
                    ce_color=ce_color[i],
                    pe_color=pe_color[i],
                    ce_ultima=ce_ultima[i],
                    pe_ultima=pe_ultima[i],
                    fut_price=fut_price,
                    atmiv=atmiv,
                    sinst=sinst,
                )

                if "error_message" in reversal_data:
                    print(
                        f"Error for strike {strike}: {reversal_data['error_message']}"
                    )
                    continue

                reversal_data["market_regimes"] = {
                    "volatility": vol_regime,
                    "trend": trend_regime,
                    "liquidity": (
                        "high"
                        if liq_adj > 1.1
                        else "medium" if liq_adj > 0.9 else "low"
                    ),
                }

                if vol_regime == "high" and trend_regime == "sideways":
                    strategy = "Iron Condor"
                elif vol_regime == "high" and trend_regime in ["bullish", "bearish"]:
                    strategy = "Calendar Spread"
                elif vol_regime == "low" and trend_regime != "sideways":
                    strategy = "Vertical Spread"
                else:
                    strategy = "Reversal"

                reversal_data["recommended_strategy"] = strategy

                strike_distance = (
                    abs(float(strikes[1]) - float(strikes[0]))
                    if len(strikes) > 1
                    else 100
                )
                thresholds = {
                    "high": 0.3 * strike_distance,
                    "medium": 0.7 * strike_distance,
                }

                current_distance = abs(sltp - reversal_data["reversal"])

                if current_distance < thresholds["high"]:
                    alert_level = "high"
                    alert_message = (
                        f"Price near reversal point ({reversal_data['reversal']})"
                    )
                elif current_distance < thresholds["medium"]:
                    alert_level = "medium"
                    alert_message = (
                        f"Price approaching reversal ({reversal_data['reversal']})"
                    )
                else:
                    alert_level = "low"
                    alert_message = "Monitoring"

                reversal_data["alert"] = {
                    "level": alert_level,
                    "message": alert_message,
                }

                data[strike_str].update(reversal_data)

            except Exception as e:
                print(f"Error processing strike {strike_str}: {str(e)}")
                continue

        return option_chain

    except Exception as e:
        print(f"Critical error in reversal calculator: {str(e)}")
        return option_chain
