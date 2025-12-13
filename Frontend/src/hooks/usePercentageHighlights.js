import { useMemo } from 'react';

/**
 * Hook to calculate percentage-based highlighting for VOL, OI, OI CHG columns
 * 
 * Rules:
 * 1. Find 100% reference from valid strikes (ATM to 2 ITM + all OTM)
 * 2. Calculate percentage for ALL visible strikes
 * 3. Assign ranks and colors based on value
 */

const COLUMNS = ['volume', 'oi', 'oichng'];
const SIDES = ['ce', 'pe'];

/**
 * Determine if a strike is ITM and how deep
 * @returns {number} ITM depth (0 = ATM/OTM, 1+ = ITM depth)
 */
const getITMDepth = (strike, atmStrike, side) => {
    if (!atmStrike) return 0;

    if (side === 'ce') {
        // CE is ITM when strike < ATM
        return strike < atmStrike ? Math.round((atmStrike - strike) / 50) : 0; // Assuming 50 point step
    } else {
        // PE is ITM when strike > ATM
        return strike > atmStrike ? Math.round((strike - atmStrike) / 50) : 0;
    }
};

/**
 * Get background color class based on rank and percentage
 * More saturated colors for better visibility
 */
const getHighlightColor = (pct, rank, side, itmDepth) => {
    // Special case: > 100% for 3+ ITM strikes
    if (pct > 100 && itmDepth >= 3) {
        return 'bg-blue-300 dark:bg-blue-800/70';
    }

    // Rank 1 (100%) - Most saturated
    if (rank === 1) {
        return side === 'ce'
            ? 'bg-red-300 dark:bg-red-800/60'
            : 'bg-green-300 dark:bg-green-800/60';
    }

    // Rank 2 - Orange for clear distinction from yellow
    if (rank === 2) {
        return 'bg-orange-300 dark:bg-orange-800/60';
    }

    // Rank 3+ with >= 75% - Amber/Yellow
    if (pct >= 75) {
        return 'bg-amber-200 dark:bg-amber-900/50';
    }

    // No highlight
    return '';
};

/**
 * Calculate highlights for a single column on one side
 */
const calculateColumnHighlights = (strikes, optionData, atmStrike, column, side) => {
    const result = {};
    const values = [];

    // Collect values with metadata
    strikes.forEach(strike => {
        const strikeKey = strike.toString();
        const data = optionData?.oc?.[strikeKey] || optionData?.oc?.[`${strike}.000000`] || {};
        const sideData = data[side] || {};

        let value = 0;
        let rawValue = 0; // Keep track of original value for OI CHG
        let isNegative = false;

        if (column === 'volume') {
            value = sideData.volume || 0;
            rawValue = value;
        } else if (column === 'oi') {
            value = sideData.OI || sideData.oi || 0;
            rawValue = value;
        } else if (column === 'oichng') {
            // For OI CHG: only positive values count for 100% reference
            rawValue = sideData.oichng || 0;
            isNegative = rawValue < 0;
            value = rawValue > 0 ? rawValue : 0; // Only positive for ranking
        }

        const itmDepth = getITMDepth(strike, atmStrike, side);
        const isValidFor100 = itmDepth <= 2; // Valid for 100% candidate if <= 2 ITM

        values.push({
            strike,
            value, // Positive value for ranking
            rawValue, // Original value for percentage display
            isNegative, // Track if this is a negative OI CHG
            itmDepth,
            isValidFor100,
        });
    });

    // Find max from valid candidates (only positive values for OI CHG)
    const validValues = values.filter(v => v.isValidFor100 && v.value > 0);
    const maxValue = validValues.length > 0
        ? Math.max(...validValues.map(v => v.value))
        : 0;

    if (maxValue === 0) {
        // No valid data, return empty highlights
        strikes.forEach(strike => {
            result[strike] = { pct: 0, rank: 0, color: '' };
        });
        return result;
    }

    // Calculate percentages and sort for ranking
    const withPct = values.map(v => ({
        ...v,
        // For negative OI CHG: calculate pct using absolute value
        pct: column === 'oichng' && v.isNegative
            ? (Math.abs(v.rawValue) / maxValue) * 100
            : (v.value / maxValue) * 100,
    }));

    // Sort by value descending for ranking (only count positive values for ranking)
    const sorted = [...withPct].filter(v => v.value > 0).sort((a, b) => b.value - a.value);

    // Assign ranks (only to positive non-zero values)
    const ranks = {};
    let currentRank = 0;
    let lastValue = null;
    sorted.forEach((item, idx) => {
        if (item.value > 0) {
            if (item.value !== lastValue) {
                currentRank = idx + 1;
                lastValue = item.value;
            }
            ranks[item.strike] = currentRank;
        }
    });

    // Build result
    withPct.forEach(item => {
        const rank = ranks[item.strike] || 0;
        // Negative OI CHG values get NO color highlight
        const color = (item.value > 0 && !item.isNegative)
            ? getHighlightColor(item.pct, rank, side, item.itmDepth)
            : '';

        result[item.strike] = {
            pct: item.pct,
            rank,
            color,
        };
    });

    return result;
};

/**
 * Main hook - calculates all highlights for the visible strikes
 * 
 * @param {number[]} visibleStrikes - Array of visible strike prices
 * @param {Object} optionData - Full option chain data
 * @param {number} atmStrike - ATM strike price
 * @returns {Object} highlightData keyed by strike
 */
export const usePercentageHighlights = (visibleStrikes, optionData, atmStrike) => {
    return useMemo(() => {
        if (!visibleStrikes || visibleStrikes.length === 0 || !optionData?.oc) {
            return {};
        }

        const result = {};

        // Initialize result structure
        visibleStrikes.forEach(strike => {
            result[strike] = {};
        });

        // Calculate for each column and side
        SIDES.forEach(side => {
            COLUMNS.forEach(column => {
                const columnHighlights = calculateColumnHighlights(
                    visibleStrikes,
                    optionData,
                    atmStrike,
                    column,
                    side
                );

                // Merge into result
                const key = `${side}_${column}`;
                Object.entries(columnHighlights).forEach(([strike, data]) => {
                    if (result[strike]) {
                        result[strike][key] = data;
                    }
                });
            });
        });

        return result;
    }, [visibleStrikes, optionData, atmStrike]);
};

export default usePercentageHighlights;
