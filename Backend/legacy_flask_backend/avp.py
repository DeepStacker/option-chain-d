# # import json
from math import tanh


# # def advanced_reversal_point(
# #     K,
# #     ce_delta,
# #     pe_delta,
# #     ce_gamma,
# #     pe_gamma,
# #     ce_vega,
# #     pe_vega,
# #     ce_theta,
# #     pe_theta,
# #     iv_chng,
# #     T_days,
# #     curr_call_price, # ce_ltp
# #     curr_put_price, # pe_ltp
# #     call_price, # ce_theory
# #     put_price,
# #     S_chng=1,
# #     instrument_type="IDX",
# #     current_iv=15.0,
# # ):
# #     # ✅ Net Greeks
# #     net_delta = ce_delta + pe_delta
# #     net_gamma = ce_gamma + pe_gamma
# #     net_vega = ce_vega + pe_vega
# #     net_theta = ce_theta + pe_theta

# #     # ✅ Greek weights
# #     total_mag = sum(map(abs, [net_delta, net_gamma, net_vega, net_theta])) or 1
# #     delta_weight = abs(net_delta) / total_mag
# #     gamma_weight = abs(net_gamma) / total_mag
# #     vega_weight = abs(net_vega) / total_mag
# #     theta_weight = abs(net_theta) / total_mag

# #     # ✅ Greek contributions (undamped)
# #     delta_contrib = delta_weight * net_delta
# #     gamma_contrib = gamma_weight * 0.5 * net_gamma * (S_chng**2)
# #     vega_contrib = vega_weight * net_vega * iv_chng
# #     theta_contrib = theta_weight * net_theta

# #     raw_adjustment = delta_contrib + gamma_contrib + vega_contrib + theta_contrib

# #     # ⚡ Smart time and volatility sensitivity
# #     time_sensitivity = 1 / (1 + (1 / (T_days + 1e-8)))  # near expiry → ~0.5-1.0
# #     vol_sensitivity = min(1.0, current_iv / 30)  # 0.0 to 1.0
# #     normalized_adjustment = (
# #         tanh(raw_adjustment / 5) * time_sensitivity * vol_sensitivity
# #     )

# #     # ⚙️ Dynamic max shift
# #     if instrument_type.upper() == "IDX":
# #         max_dynamic_shift = min(150, K * (current_iv / 100) * 0.03)  # 0.5% to 1.5%
# #     else:
# #         max_dynamic_shift = min(20, K * (current_iv / 100) * 0.05)  # up to 2%

# #     scaled_adjustment = normalized_adjustment * max_dynamic_shift

# #     # 🎯 Confidence score
# #     mean_greek = (abs(net_delta) + abs(net_gamma) + abs(net_vega) + abs(net_theta)) / 4
# #     confidence_score = round(tanh(mean_greek / 2) * 100)

# #     # theoritical price weight
# #     pweight = (curr_call_price - call_price) + (curr_put_price - put_price)
# #     reversal_point = round(K + scaled_adjustment + pweight, 2)

# #     # 📦 Debug + telemetry
# #     all_data = {
# #         "reversal_point": reversal_point,
# #         "confidence_score": confidence_score,
# #         "net_delta": net_delta,
# #         "net_gamma": net_gamma,
# #         "net_vega": net_vega,
# #         "net_theta": net_theta,
# #         "delta_contrib": delta_contrib,
# #         "gamma_contrib": gamma_contrib,
# #         "vega_contrib": vega_contrib,
# #         "theta_contrib": theta_contrib,
# #         "raw_adjustment": raw_adjustment,
# #         "normalized_adjustment": normalized_adjustment,
# #         "scaled_adjustment": scaled_adjustment,
# #         "total_mag": total_mag,
# #         "delta_weight": delta_weight,
# #         "gamma_weight": gamma_weight,
# #         "vega_weight": vega_weight,
# #         "theta_weight": theta_weight,
# #         "iv_chng": iv_chng,
# #         "T_days": T_days,
# #         "S_chng": S_chng,
# #         "instrument_type": instrument_type,
# #         "current_iv": current_iv,
# #         "time_sensitivity": time_sensitivity,
# #         "vol_sensitivity": vol_sensitivity,
# #         "max_dynamic_shift": max_dynamic_shift,
# #         "reversal_point_details": {
# #             "K": K,
# #             "ce_delta": ce_delta,
# #             "pe_delta": pe_delta,
# #             "ce_gamma": ce_gamma,
# #             "pe_gamma": pe_gamma,
# #             "ce_vega": ce_vega,
# #             "pe_vega": pe_vega,
# #             "ce_theta": ce_theta,
# #             "pe_theta": pe_theta,
# #         },
# #     }

# #     # print(json.dumps(all_data, indent=4))
# #     return reversal_point, confidence_score, all_data

# # from math import tanh, sqrt, exp


# # def advanced_reversal_point(
# #     K,
# #     ce_delta,
# #     pe_delta,
# #     ce_gamma,
# #     pe_gamma,
# #     ce_vega,
# #     pe_vega,
# #     ce_theta,
# #     pe_theta,
# #     iv_chng,
# #     T_days,
# #     curr_call_price,
# #     curr_put_price,
# #     call_price,
# #     put_price,
# #     S_chng=1,
# #     instrument_type="IDX",
# #     current_iv=15.0,
# #     spot_price=0,
# # ):
# #     # ✅ Net Greeks
# #     net_delta = ce_delta + pe_delta
# #     net_gamma = ce_gamma + pe_gamma
# #     net_vega = ce_vega + pe_vega
# #     net_theta = ce_theta + pe_theta

# #     # ✅ Greek Weights
# #     total_mag = sum(map(abs, [net_delta, net_gamma, net_vega, net_theta])) or 1
# #     weights = {
# #         "delta": abs(net_delta) / total_mag,
# #         "gamma": abs(net_gamma) / total_mag,
# #         "vega": abs(net_vega) / total_mag,
# #         "theta": abs(net_theta) / total_mag,
# #     }

# #     # ✅ Greek Contributions
# #     delta_contrib = weights["delta"] * net_delta
# #     gamma_contrib = weights["gamma"] * 0.5 * net_gamma * (S_chng**2)
# #     vega_contrib = weights["vega"] * net_vega * iv_chng
# #     theta_contrib = weights["theta"] * net_theta * (1 + (1 / (T_days + 0.01)))

# #     greek_adjustment = delta_contrib + gamma_contrib + vega_contrib + theta_contrib

# #     # ✅ Smart Sensitivity Modulation
# #     time_sensitivity = 1 / (1 + (1 / (T_days + 1e-8)))
# #     iv_sensitivity = min(1.0, current_iv / 30)
# #     iv_chng_score = tanh(iv_chng / 5)

# #     modulation = time_sensitivity * iv_sensitivity * iv_chng_score
# #     normalized_greek_adj = tanh(greek_adjustment / 5) * modulation

# #     # ✅ Gamma-weighted stretch factor (ATM pull)
# #     gamma_stretch = (
# #         1 + tanh(abs(net_gamma) * (1 - abs(K - spot_price) / (spot_price + 1))) * 0.3
# #     )

# #     # ✅ Delta Skew Bias
# #     delta_skew = tanh(ce_delta - abs(pe_delta))  # Positive skew = upward bias
# #     skew_factor = 1 + delta_skew * 0.1

# #     # ✅ Price Bias
# #     price_bias = sqrt(
# #         (curr_call_price - call_price) ** 2 + (curr_put_price - put_price) ** 2
# #     )
# #     price_bias_scaled = tanh(price_bias / 10)

# #     # ✅ Max Shift Logic
# #     if instrument_type.upper() == "IDX":
# #         max_shift = min(150, K * (current_iv / 100) * 0.03)
# #     else:
# #         max_shift = min(20, K * (current_iv / 100) * 0.05)

# #     # ✅ Final Shift Weights
# #     greek_weight = 0.6
# #     price_weight = 0.15
# #     skew_weight = 0.25

# #     # ✅ Apply All Adjustments
# #     greek_shift = normalized_greek_adj * max_shift * greek_weight * gamma_stretch
# #     price_shift = price_bias_scaled * max_shift * price_weight
# #     directional_shift = delta_skew * max_shift * skew_weight * time_sensitivity

# #     reversal_point = round(K + greek_shift + price_shift + directional_shift, 2)

# #     # ✅ Confidence Score
# #     mean_greek = (abs(net_delta) + abs(net_gamma) + abs(net_vega) + abs(net_theta)) / 4
# #     confidence_score = round(tanh(mean_greek / 2) * 100)

# #     # ✅ Debug Dump
# #     debug_info = {
# #         "reversal_point": reversal_point,
# #         "confidence_score": confidence_score,
# #         "net_greeks": {
# #             "delta": net_delta,
# #             "gamma": net_gamma,
# #             "vega": net_vega,
# #             "theta": net_theta,
# #         },
# #         "weights": weights,
# #         "contributions": {
# #             "delta": delta_contrib,
# #             "gamma": gamma_contrib,
# #             "vega": vega_contrib,
# #             "theta": theta_contrib,
# #             "greek_adjustment": greek_adjustment,
# #             "normalized_greek_adj": normalized_greek_adj,
# #         },
# #         "modulation": {
# #             "time_sensitivity": time_sensitivity,
# #             "iv_sensitivity": iv_sensitivity,
# #             "iv_chng_score": iv_chng_score,
# #             "modulation": modulation,
# #         },
# #         "adjustments": {
# #             "gamma_stretch": gamma_stretch,
# #             "skew_factor": skew_factor,
# #             "price_bias": price_bias,
# #             "price_bias_scaled": price_bias_scaled,
# #             "greek_shift": greek_shift,
# #             "price_shift": price_shift,
# #             "directional_shift": directional_shift,
# #             "max_shift": max_shift,
# #         },
# #         "weights_applied": {
# #             "greek_weight": greek_weight,
# #             "price_weight": price_weight,
# #             "skew_weight": skew_weight,
# #         },
# #         "spot_price": spot_price,
# #         "strike": K,
# #     }

# #     return reversal_point, confidence_score, debug_info


# from math import tanh, sqrt


# def advanced_reversal_point(
#     K,
#     ce_delta,
#     pe_delta,
#     ce_gamma,
#     pe_gamma,
#     ce_vega,
#     pe_vega,
#     ce_theta,
#     pe_theta,
#     ce_rho,
#     pe_rho,
#     ce_vomma,
#     pe_vomma,
#     ce_vanna,
#     pe_vanna,
#     ce_charm,
#     pe_charm,
#     ce_speed,
#     pe_speed,
#     ce_zomma,
#     pe_zomma,
#     ce_color,
#     pe_color,
#     ce_ultima,
#     pe_ultima,
#     iv_chng,
#     T_days,
#     curr_call_price,
#     curr_put_price,
#     call_price,
#     put_price,
#     S_chng=1,
#     instrument_type="IDX",
#     current_iv=15.0,
#     spot_price=0,
# ):
#     # ✅ Net Greeks
#     net_delta = ce_delta + pe_delta
#     net_gamma = ce_gamma + pe_gamma
#     net_vega = ce_vega + pe_vega
#     net_theta = ce_theta + pe_theta

#     # ✅ Greek Weights
#     total_mag = sum(map(abs, [net_delta, net_gamma, net_vega, net_theta])) or 1
#     weights = {
#         "delta": abs(net_delta) / total_mag,
#         "gamma": abs(net_gamma) / total_mag,
#         "vega": abs(net_vega) / total_mag,
#         "theta": abs(net_theta) / total_mag,
#     }

#     # ✅ Greek Contributions
#     delta_contrib = weights["delta"] * net_delta
#     gamma_contrib = weights["gamma"] * 0.5 * net_gamma * (S_chng**2)
#     theta_contrib = weights["theta"] * net_theta * (1 + (1 / (T_days + 0.01)))
#     vega_contrib = weights["vega"] * net_vega * iv_chng

#     greek_adjustment = delta_contrib + gamma_contrib + vega_contrib + theta_contrib

#     # ✅ Smart Sensitivity Modulation
#     time_sensitivity = 1 / (1 + (1 / (T_days + 1e-8)))
#     iv_sensitivity = min(1.0, current_iv / 30)
#     iv_chng_score = tanh(iv_chng / 5)

#     modulation = time_sensitivity * iv_sensitivity * iv_chng_score

#     normalized_greek_adj = tanh(greek_adjustment / 5) * modulation

#     # ✅ Gamma-weighted stretch factor (ATM pull)
#     gamma_stretch = (
#         1 + tanh(abs(net_gamma) * (1 - abs(K - spot_price) / (spot_price + 1))) * 0.3
#     )

#     # ✅ Delta Skew Bias
#     delta_skew = tanh(ce_delta - abs(pe_delta))  # Positive skew = upward bias

#     # 🩹 Clamp directional bias within ±20 points approx
#     directional_bias = max(-20, min(20, delta_skew * 0.05 * K))

#     # ✅ Price Bias
#     price_bias = sqrt(
#         (curr_call_price - call_price) ** 2 + (curr_put_price - put_price) ** 2
#     )

#     # 🩹 Clamp price bias scaled within ±15 points approx
#     price_bias_scaled = min(15, tanh(price_bias / 10) * 0.05 * K)

#     # ✅ Max Shift Logic
#     if instrument_type.upper() == "IDX":
#         max_shift = min(150, K * (current_iv / 100) * 0.03)
#     else:
#         max_shift = min(20, K * (current_iv / 100) * 0.05)

#     # 🩹 Modulation Safeguard — ignore Greek shift if modulation too low
#     if modulation < 0.02:
#         greek_shift = 0
#     else:
#         greek_shift = normalized_greek_adj * max_shift * gamma_stretch

#     # ✅ Final Shift Weights (these are tuned for your use-case)
#     greek_weight = 0.6
#     price_weight = 0.15
#     skew_weight = 0.25

#     # 🩹 Weighted final shifts
#     greek_shift *= greek_weight
#     price_bias_scaled *= price_weight
#     directional_bias *= skew_weight

#     reversal_point = round(K + greek_shift + price_bias_scaled + directional_bias, 2)

#     # ✅ Confidence Score
#     mean_greek = (abs(net_delta) + abs(net_gamma) + abs(net_vega) + abs(net_theta)) / 4
#     confidence_score = round(tanh(mean_greek / 2) * 100)

#     # ✅ Debug Info
#     debug_info = {
#         "reversal_point": reversal_point,
#         "confidence_score": confidence_score,
#         "net_greeks": {
#             "delta": net_delta,
#             "gamma": net_gamma,
#             "vega": net_vega,
#             "theta": net_theta,
#         },
#         "weights": weights,
#         "contributions": {
#             "delta": delta_contrib,
#             "gamma": gamma_contrib,
#             "vega": vega_contrib,
#             "theta": theta_contrib,
#             "greek_adjustment": greek_adjustment,
#             "normalized_greek_adj": normalized_greek_adj,
#         },
#         "modulation": {
#             "time_sensitivity": time_sensitivity,
#             "iv_sensitivity": iv_sensitivity,
#             "iv_chng_score": iv_chng_score,
#             "modulation": modulation,
#         },
#         "adjustments": {
#             "gamma_stretch": gamma_stretch,
#             "directional_bias": directional_bias,
#             "price_bias": price_bias,
#             "price_bias_scaled": price_bias_scaled,
#             "greek_shift": greek_shift,
#             "max_shift": max_shift,
#         },
#         "weights_applied": {
#             "greek_weight": greek_weight,
#             "price_weight": price_weight,
#             "skew_weight": skew_weight,
#         },
#         "spot_price": spot_price,
#         "strike": K,
#     }

#     return reversal_point, confidence_score, debug_info

# Let's generate a reusable Python function/module that takes in CE and PE Greeks per strike
# and computes reversal scores based on advanced transformations of greeks

from math import fabs


def compute_reversal_features_per_strike(
    K,
    ce_delta,
    pe_delta,
    ce_gamma,
    pe_gamma,
    ce_vega,
    pe_vega,
    ce_vanna,
    pe_vanna,
    ce_vomma,
    pe_vomma,
    ce_charm,
    pe_charm,
    ce_color,
    pe_color,
    ce_speed,
    pe_speed,
):
    # Net Greeks
    net_delta = ce_delta + pe_delta
    net_gamma = ce_gamma + pe_gamma
    net_vega = ce_vega + pe_vega
    net_vanna = ce_vanna + pe_vanna
    net_vomma = ce_vomma + pe_vomma
    net_charm = ce_charm + pe_charm
    net_color = ce_color + pe_color
    net_speed = ce_speed + pe_speed

    # Advanced Greek features
    vanna_gamma = net_vanna * net_gamma
    vomma_vanna_ratio = net_vomma / max(abs(net_vanna), 1e-5)
    charm_color_sum = fabs(net_charm) + fabs(net_color)
    speed_gamma_ratio = net_speed / max(abs(net_gamma), 1e-5)

    # Composite Weighted Score (lower = better reversal candidate)
    composite_score = (
        0.25 * fabs(net_delta)
        + 0.30 * fabs(net_gamma)
        + 0.20 * fabs(net_vanna)
        + 0.15 * fabs(net_charm)
        + 0.10 * fabs(net_vomma)
    )

    return {
        "strike": K,
        "net_delta": net_delta,
        "net_gamma": net_gamma,
        "net_vega": net_vega,
        "net_vanna": net_vanna,
        "net_vomma": net_vomma,
        "net_charm": net_charm,
        "net_color": net_color,
        "vanna_gamma": vanna_gamma,
        "vomma_vanna_ratio": vomma_vanna_ratio,
        "charm_color_sum": charm_color_sum,
        "speed_gamma_ratio": speed_gamma_ratio,
        "composite_score": composite_score,  # Lower is better
    }


def advanced_reversal_point(
    K,
    spot_price,
    T_days,
    current_iv,
    iv_chng,
    ce_delta,
    pe_delta,
    ce_gamma,
    pe_gamma,
    ce_vega,
    pe_vega,
    ce_theta,
    pe_theta,
    ce_rho,
    pe_rho,
    ce_vomma,
    pe_vomma,
    ce_vanna,
    pe_vanna,
    ce_charm,
    pe_charm,
    ce_speed,
    pe_speed,
    ce_zomma,
    pe_zomma,
    ce_color,
    pe_color,
    ce_ultima,
    pe_ultima,
    curr_call_price,
    curr_put_price,
    call_price,
    put_price,
    S_chng=1,
    instrument_type="IDX",
    vol_chng=0.01,
    time_chng=1 / 365,
):
    # ===== NET GREEKS CALCULATION =====
    # First-order nets
    net_delta = ce_delta + pe_delta
    net_gamma = ce_gamma + pe_gamma
    net_vega = ce_vega + pe_vega
    net_theta = ce_theta + pe_theta
    net_rho = ce_rho + pe_rho

    # Second-order nets
    net_vomma = ce_vomma + pe_vomma
    net_vanna = ce_vanna + pe_vanna
    net_charm = ce_charm + pe_charm

    # Third-order nets
    net_speed = ce_speed + pe_speed
    net_zomma = ce_zomma + pe_zomma
    net_color = ce_color + pe_color
    net_ultima = ce_ultima + pe_ultima

    # ===== CONTRIBUTION CALCULATIONS =====
    # First-order contributions
    delta_effect = net_delta * S_chng
    gamma_effect = 0.5 * net_gamma * (S_chng**2)
    vega_effect = net_vega * iv_chng
    theta_effect = net_theta * time_chng
    rho_effect = net_rho * 0.001  # 1bp rate change

    # Second-order contributions (critical for accuracy)
    vomma_effect = 0.5 * net_vomma * (iv_chng**2)  # Vega convexity
    vanna_effect = net_vanna * S_chng * iv_chng  # Cross delta-vol
    charm_effect = net_charm * time_chng  # Delta time decay

    # Third-order contributions (fine-tuning)
    speed_effect = (1 / 6) * net_speed * (S_chng**3)  # Gamma acceleration
    zomma_effect = net_zomma * S_chng * iv_chng  # Gamma-vol cross
    color_effect = net_color * time_chng  # Gamma time decay
    ultima_effect = (1 / 6) * net_ultima * (iv_chng**3)  # Vomma acceleration

    # ===== INTELLIGENT WEIGHTING SYSTEM =====
    # Time-based weighting (near expiry emphasizes higher-order Greeks)
    if T_days * 365 <= 5:  # Weekly expiry - higher-order Greeks dominate
        w1, w2, w3 = 0.4, 0.4, 0.2
        volatility_multiplier = 1.5
    elif T_days <= 15:  # Bi-weekly
        w1, w2, w3 = 0.5, 0.35, 0.15
        volatility_multiplier = 1.3
    elif T_days <= 30:  # Monthly
        w1, w2, w3 = 0.6, 0.3, 0.1
        volatility_multiplier = 1.1
    else:  # Longer dated
        w1, w2, w3 = 0.7, 0.25, 0.05
        volatility_multiplier = 1.0

    # Volatility regime adjustment
    if current_iv > 30:  # High vol - emphasize vega-related Greeks
        vega_boost = 1.4
        vomma_boost = 1.6
        ultima_boost = 1.3
    elif current_iv < 12:  # Low vol - emphasize delta/gamma
        vega_boost = 0.8
        vomma_boost = 0.7
        ultima_boost = 0.6
    else:  # Normal vol
        vega_boost = vomma_boost = ultima_boost = 1.0

    # ===== WEIGHTED CONTRIBUTIONS =====
    first_order_total = (
        delta_effect
        + gamma_effect
        + (vega_effect * vega_boost)
        + theta_effect
        + rho_effect
    )

    second_order_total = (
        (vomma_effect * vomma_boost) + vanna_effect + charm_effect
    ) * volatility_multiplier

    third_order_total = (
        speed_effect + zomma_effect + color_effect + (ultima_effect * ultima_boost)
    ) * (volatility_multiplier**1.5)

    # ===== FINAL ADJUSTMENT CALCULATION =====
    total_greek_adjustment = (
        first_order_total * w1 + second_order_total * w2 + third_order_total * w3
    )

    # Price discrepancy factor
    price_discrepancy = (curr_call_price - call_price) + (curr_put_price - put_price)

    # Smart bounds based on instrument and volatility
    if instrument_type.upper() == "IDX":
        max_adjustment = min(150, K * (current_iv / 100) * 0.04)
    else:
        max_adjustment = min(30, K * (current_iv / 100) * 0.06)

    # Apply hyperbolic tangent for smooth bounds
    bounded_adjustment = tanh(total_greek_adjustment / max_adjustment) * max_adjustment

    # Final reversal point
    reversal_point = round(K + bounded_adjustment, 2)

    # ===== ADVANCED CONFIDENCE SCORING =====
    # Greek consistency check
    greek_magnitudes = [
        abs(net_delta),
        abs(net_gamma),
        abs(net_vega),
        abs(net_theta),
        abs(net_vomma),
        abs(net_vanna),
        abs(net_charm),
        abs(net_speed),
        abs(net_zomma),
        abs(net_color),
        abs(net_ultima),
    ]

    # Higher-order Greek significance
    higher_order_significance = sum(greek_magnitudes[4:]) / max(
        sum(greek_magnitudes[:4]), 0.001
    )

    # Time-volatility confidence
    time_vol_confidence = min(100, (T_days * 365 * current_iv) / 10)

    # Overall confidence
    base_confidence = 60 + min(30, higher_order_significance * 20)
    final_confidence = round(min(95, base_confidence + time_vol_confidence * 0.1))

    # ===== COMPREHENSIVE ANALYSIS OUTPUT =====
    analysis = {
        "reversal_point": reversal_point,
        "confidence_score": final_confidence,
        "greek_breakdown": {
            "first_order": {
                "delta": delta_effect,
                "gamma": gamma_effect,
                "vega": vega_effect,
                "theta": theta_effect,
                "rho": rho_effect,
                "total": first_order_total,
            },
            "second_order": {
                "vomma": vomma_effect,
                "vanna": vanna_effect,
                "charm": charm_effect,
                "total": second_order_total,
            },
            "third_order": {
                "speed": speed_effect,
                "zomma": zomma_effect,
                "color": color_effect,
                "ultima": ultima_effect,
                "total": third_order_total,
            },
        },
        "market_factors": {
            "price_discrepancy": price_discrepancy,
            "volatility_regime": (
                "high" if current_iv > 30 else "low" if current_iv < 12 else "normal"
            ),
            "time_regime": "near_expiry" if T_days <= 5 else "normal",
            "max_adjustment_bound": max_adjustment,
        },
        "weights_applied": {"w1": w1, "w2": w2, "w3": w3},
        "higher_order_significance": higher_order_significance,
        "reversal_feature": compute_reversal_features_per_strike(
            K,
            ce_delta,
            pe_delta,
            ce_gamma,
            pe_gamma,
            ce_vega,
            pe_vega,
            ce_vanna,
            pe_vanna,
            ce_vomma,
            pe_vomma,
            ce_charm,
            pe_charm,
            ce_color,
            pe_color,
            ce_speed,
            pe_speed,
        ),
    }

    return reversal_point, final_confidence, analysis


# from math import tanh, fabs


# def compute_reversal_features_per_strike(
#     K,
#     ce_delta,
#     pe_delta,
#     ce_gamma,
#     pe_gamma,
#     ce_vega,
#     pe_vega,
#     ce_vanna,
#     pe_vanna,
#     ce_vomma,
#     pe_vomma,
#     ce_charm,
#     pe_charm,
#     ce_color,
#     pe_color,
#     ce_speed,
#     pe_speed,
# ):
#     net_delta = ce_delta + pe_delta
#     net_gamma = ce_gamma + pe_gamma
#     net_vega = ce_vega + pe_vega
#     net_vanna = ce_vanna + pe_vanna
#     net_vomma = ce_vomma + pe_vomma
#     net_charm = ce_charm + pe_charm
#     net_color = ce_color + pe_color
#     net_speed = ce_speed + pe_speed

#     vanna_gamma = net_vanna * net_gamma
#     vomma_vanna_ratio = net_vomma / max(abs(net_vanna), 1e-5)
#     charm_color_sum = fabs(net_charm) + fabs(net_color)
#     speed_gamma_ratio = net_speed / max(abs(net_gamma), 1e-5)

#     # Volatility-consistent scoring (institutional-style risk filters)
#     composite_score = (
#         0.25 * fabs(net_delta)
#         + 0.30 * fabs(net_gamma)
#         + 0.20 * fabs(net_vanna)
#         + 0.15 * fabs(net_charm)
#         + 0.10 * fabs(net_vomma)
#     )

#     return {
#         "strike": K,
#         "net_delta": net_delta,
#         "net_gamma": net_gamma,
#         "net_vega": net_vega,
#         "net_vanna": net_vanna,
#         "net_vomma": net_vomma,
#         "net_charm": net_charm,
#         "net_color": net_color,
#         "vanna_gamma": vanna_gamma,
#         "vomma_vanna_ratio": vomma_vanna_ratio,
#         "charm_color_sum": charm_color_sum,
#         "speed_gamma_ratio": speed_gamma_ratio,
#         "composite_score": composite_score,
#     }


# def advanced_reversal_point(
#     K,
#     spot_price,
#     T_days,
#     current_iv,
#     iv_chng,
#     ce_delta,
#     pe_delta,
#     ce_gamma,
#     pe_gamma,
#     ce_vega,
#     pe_vega,
#     ce_theta,
#     pe_theta,
#     ce_rho,
#     pe_rho,
#     ce_vomma,
#     pe_vomma,
#     ce_vanna,
#     pe_vanna,
#     ce_charm,
#     pe_charm,
#     ce_speed,
#     pe_speed,
#     ce_zomma,
#     pe_zomma,
#     ce_color,
#     pe_color,
#     ce_ultima,
#     pe_ultima,
#     curr_call_price,
#     curr_put_price,
#     call_price,
#     put_price,
#     S_chng=1,
#     instrument_type="IDX",
#     vol_chng=0.01,
#     time_chng=1 / 365,
# ):
#     # Net Greeks
#     net_delta = ce_delta + pe_delta
#     net_gamma = ce_gamma + pe_gamma
#     net_vega = ce_vega + pe_vega
#     net_theta = ce_theta + pe_theta
#     net_rho = ce_rho + pe_rho

#     net_vomma = ce_vomma + pe_vomma
#     net_vanna = ce_vanna + pe_vanna
#     net_charm = ce_charm + pe_charm
#     net_speed = ce_speed + pe_speed
#     net_zomma = ce_zomma + pe_zomma
#     net_color = ce_color + pe_color
#     net_ultima = ce_ultima + pe_ultima

#     # Realistic Price Discrepancy Signal (normalized)
#     price_discrepancy = (curr_call_price - call_price) + (curr_put_price - put_price)
#     price_discrepancy_pct = price_discrepancy / max(
#         curr_call_price + curr_put_price, 1e-3
#     )

#     # Dynamic Volatility Reaction (more adaptive to current IV)
#     implied_vol_response = iv_chng if current_iv < 20 else iv_chng * 1.5

#     # First-order contribution
#     delta_effect = net_delta * S_chng
#     gamma_effect = 0.5 * net_gamma * (S_chng**2)
#     vega_effect = net_vega * implied_vol_response
#     theta_effect = net_theta * time_chng
#     rho_effect = net_rho * 0.001

#     # Second-order
#     vomma_effect = 0.5 * net_vomma * (implied_vol_response**2)
#     vanna_effect = net_vanna * S_chng * implied_vol_response
#     charm_effect = net_charm * time_chng

#     # Third-order
#     speed_effect = (1 / 6) * net_speed * (S_chng**3)
#     zomma_effect = net_zomma * S_chng * implied_vol_response
#     color_effect = net_color * time_chng
#     ultima_effect = (1 / 6) * net_ultima * (implied_vol_response**3)

#     # Time sensitivity weights (realistic mapping)
#     if T_days * 365 <= 5:
#         w1, w2, w3 = 0.3, 0.45, 0.25
#         vol_mult = 1.5
#     elif T_days <= 15:
#         w1, w2, w3 = 0.45, 0.4, 0.15
#         vol_mult = 1.3
#     elif T_days <= 30:
#         w1, w2, w3 = 0.6, 0.3, 0.1
#         vol_mult = 1.1
#     else:
#         w1, w2, w3 = 0.7, 0.25, 0.05
#         vol_mult = 1.0

#     # Vol sensitivity
#     if current_iv > 30:
#         vega_boost = 1.3
#         vomma_boost = 1.5
#         ultima_boost = 1.3
#     elif current_iv < 12:
#         vega_boost = 0.8
#         vomma_boost = 0.7
#         ultima_boost = 0.6
#     else:
#         vega_boost = vomma_boost = ultima_boost = 1.0

#     first_order_total = (
#         delta_effect
#         + gamma_effect
#         + (vega_effect * vega_boost)
#         + theta_effect
#         + rho_effect
#     )

#     second_order_total = (
#         (vomma_effect * vomma_boost) + vanna_effect + charm_effect
#     ) * vol_mult

#     third_order_total = (
#         speed_effect + zomma_effect + color_effect + (ultima_effect * ultima_boost)
#     ) * (vol_mult**1.5)

#     total_greek_adjustment = (
#         first_order_total * w1 + second_order_total * w2 + third_order_total * w3
#     )

#     # Bounded, noise-resistant adjustment
#     if instrument_type.upper() == "IDX":
#         max_adj = min(100, K * current_iv * 0.04 / 100)
#     else:
#         max_adj = min(30, K * current_iv * 0.06 / 100)

#     bounded_adj = tanh(total_greek_adjustment / max(max_adj, 1e-4)) * max_adj
#     reversal_point = round(K + bounded_adj, 2)

#     # Higher-order influence metric
#     greek_mags = [
#         abs(net_delta),
#         abs(net_gamma),
#         abs(net_vega),
#         abs(net_theta),
#         abs(net_vomma),
#         abs(net_vanna),
#         abs(net_charm),
#         abs(net_speed),
#         abs(net_zomma),
#         abs(net_color),
#         abs(net_ultima),
#     ]
#     ho_ratio = sum(greek_mags[4:]) / max(sum(greek_mags[:4]), 1e-4)

#     base_conf = 60 + min(30, ho_ratio * 20)
#     final_conf = round(min(95, base_conf + (T_days * 365 * current_iv / 10) * 0.1))

#     return (
#         reversal_point,
#         final_conf,
#         {
#             "reversal_point": reversal_point,
#             "confidence_score": final_conf,
#             "greek_breakdown": {
#                 "first_order": {
#                     "delta": delta_effect,
#                     "gamma": gamma_effect,
#                     "vega": vega_effect,
#                     "theta": theta_effect,
#                     "rho": rho_effect,
#                     "total": first_order_total,
#                 },
#                 "second_order": {
#                     "vomma": vomma_effect,
#                     "vanna": vanna_effect,
#                     "charm": charm_effect,
#                     "total": second_order_total,
#                 },
#                 "third_order": {
#                     "speed": speed_effect,
#                     "zomma": zomma_effect,
#                     "color": color_effect,
#                     "ultima": ultima_effect,
#                     "total": third_order_total,
#                 },
#             },
#             "market_factors": {
#                 "price_discrepancy": price_discrepancy,
#                 "price_discrepancy_pct": price_discrepancy_pct,
#                 "volatility_regime": (
#                     "high"
#                     if current_iv > 30
#                     else "low" if current_iv < 12 else "normal"
#                 ),
#                 "max_adjustment_bound": max_adj,
#             },
#             "weights_applied": {"w1": w1, "w2": w2, "w3": w3},
#             "higher_order_significance": ho_ratio,
#             "reversal_feature": compute_reversal_features_per_strike(
#                 K,
#                 ce_delta,
#                 pe_delta,
#                 ce_gamma,
#                 pe_gamma,
#                 ce_vega,
#                 pe_vega,
#                 ce_vanna,
#                 pe_vanna,
#                 ce_vomma,
#                 pe_vomma,
#                 ce_charm,
#                 pe_charm,
#                 ce_color,
#                 pe_color,
#                 ce_speed,
#                 pe_speed,
#             ),
#         },
#     )
