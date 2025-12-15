/**
 * Calculator API Service
 * Handles endpoints for Option Pricing, Greeks, and Investment calculators
 */
import axiosInstance from './config';

const CALC_BASE = '/calculators';

/**
 * Calculate option price and Greeks using Black-Scholes
 */
export const calculateOptionPrice = async ({
    spot,
    strike,
    timeToExpiry,
    riskFreeRate = 0.07,
    volatility,
    dividendYield = 0,
}) => {
    const response = await axiosInstance.post(`${CALC_BASE}/option-price`, {
        spot,
        strike,
        time_to_expiry: timeToExpiry,
        risk_free_rate: riskFreeRate,
        volatility,
        dividend_yield: dividendYield,
    });
    return response.data;
};

/**
 * Calculate implied volatility from option price
 */
export const calculateIV = async ({
    optionPrice,
    spot,
    strike,
    timeToExpiry,
    riskFreeRate = 0.07,
    optionType = 'CE',
    dividendYield = 0,
}) => {
    const response = await axiosInstance.post(`${CALC_BASE}/implied-volatility`, {
        option_price: optionPrice,
        spot,
        strike,
        time_to_expiry: timeToExpiry,
        risk_free_rate: riskFreeRate,
        option_type: optionType,
        dividend_yield: dividendYield,
    });
    return response.data;
};

/**
 * Calculate SIP returns
 */
export const calculateSIP = async ({
    monthlyInvestment,
    annualReturn,
    years,
}) => {
    const response = await axiosInstance.post(`${CALC_BASE}/sip`, {
        monthly_investment: monthlyInvestment,
        annual_return: annualReturn,
        years,
    });
    return response.data;
};

/**
 * Calculate Lumpsum returns
 */
export const calculateLumpsum = async ({
    principal,
    annualReturn,
    years,
}) => {
    const response = await axiosInstance.post(`${CALC_BASE}/lumpsum`, {
        principal,
        annual_return: annualReturn,
        years,
    });
    return response.data;
};

/**
 * Calculate SWP results
 */
export const calculateSWP = async ({
    initialInvestment,
    monthlyWithdrawal,
    annualReturn,
    years,
}) => {
    const response = await axiosInstance.post(`${CALC_BASE}/swp`, {
        initial_investment: initialInvestment,
        monthly_withdrawal: monthlyWithdrawal,
        annual_return: annualReturn,
        years,
    });
    return response.data;
};

/**
 * Calculate margin required
 */
export const calculateMargin = async ({
    spot,
    strike,
    optionType = 'CE',
    premium,
    lotSize,
    isBuy = true,
}) => {
    const response = await axiosInstance.post(`${CALC_BASE}/margin`, {
        spot,
        strike,
        option_type: optionType,
        premium,
        lot_size: lotSize,
        is_buy: isBuy,
    });
    return response.data;
};

export default {
    calculateOptionPrice,
    calculateIV,
    calculateSIP,
    calculateLumpsum,
    calculateSWP,
    calculateMargin,
};
