import React, { memo } from "react";
import PropTypes from 'prop-types';
import { formatNumber, toFixed } from '../utils';
import { useSelector } from "react-redux";

// Constants
const HIGHLIGHT_VALUES = ['1', '2', '3', '4', '5'];
const THEME_CLASSES = {
  dark: {
    bg: 'bg-gray-700',
    text: 'text-white'
  },
  light: {
    bg: 'bg-gray-300',
    text: 'text-black'
  }
};

/**
 * Get background class based on strike and option type
 * @param {Object} oc - Option chain data
 * @param {number} strike - Strike price
 * @param {string} type - Option type ('ce' or 'pe')
 * @returns {string} CSS class name
 */
const getBackgroundClass = (oc, strike, type) =>
  type === 'ce' ? (oc?.sltp > strike ? 'bg-itm-highlight' : '') : (oc?.sltp < strike ? 'bg-itm-highlight' : '');

/**
 * Get highlight class based on value and type
 * @param {number} abs - Absolute value
 * @param {string} value - Value to check
 * @param {boolean} isHighlighting - Whether highlighting is enabled
 * @param {boolean} isCe - Whether it's a CE option
 * @returns {string} CSS class name
 */
const getHighlightClass = (abs, value, isHighlighting, isCe) => {
  if (isNaN(value) || !isHighlighting) return '';
  
  const baseClass = isCe ? 'text-black bg-red-500 z-50' : 'text-black bg-green-500 z-50';
  
  if (value === '1') return baseClass;
  if (abs <= 0) return 'text-black text-red-500';
  if (value === '2') return 'text-black bg-yellow-300';
  if (HIGHLIGHT_VALUES.slice(2).includes(value)) return 'text-black bg-yellow-100';
  
  return '';
};

/**
 * Get text highlight class based on absolute value
 * @param {number} abs - Absolute value
 * @returns {string} CSS class name
 */
const getHighlightTextClass = (abs) => (!isNaN(abs) && abs <= 0 ? 'text-red-500' : 'text-green-700');

/**
 * Get PCR class based on PCR value
 * @param {number} pcr - Put-Call Ratio
 * @returns {string} CSS class name
 */
const getPCRClass = (pcr) => (pcr > 1.2 ? 'text-green-700' : pcr < 0.8 ? 'text-red-500' : '');

/**
 * Find and categorize strikes based on ATM price
 * @param {Object} options - Object containing all strike options
 * @param {number} atmPrice - At-the-money price
 * @returns {Object} Object containing nearest strike and categorized strikes
 */
export function findStrikes(options, atmPrice) {
  if (!options || typeof atmPrice !== 'number') {
    return { nearestStrike: 0, otmStrikes: [], itmStrikes: [] };
  }

  const strikes = Object.keys(options).map(Number);
  
  // Return default values if strikes array is empty
  if (strikes.length === 0) {
    return { nearestStrike: atmPrice, otmStrikes: [], itmStrikes: [] };
  }

  // Find nearest strike using reduce with initial value
  const nearestStrike = strikes.reduce((prev, curr) => 
    Math.abs(curr - atmPrice) < Math.abs(prev - atmPrice) ? curr : prev,
    strikes[0]
  );

  const otmStrikes = strikes.filter(strike => strike > atmPrice).sort((a, b) => a - b);
  const itmStrikes = strikes.filter(strike => strike < atmPrice).sort((a, b) => a - b);

  return { nearestStrike, otmStrikes, itmStrikes };
}

// Memoized cell components
const DataCell = memo(({ data, valueKey, isCe, strike, onClick, isHighlighting }) => (
  <td
    onClick={onClick}
    className={`${getHighlightClass(data[valueKey], data[valueKey + '_max_value'], isHighlighting, isCe)} cursor-pointer`}
  >
    {formatNumber(data[`${valueKey}_percentage`])}% <br />
    <small>{formatNumber(data[valueKey])}</small>
  </td>
));

DataCell.propTypes = {
  data: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  isCe: PropTypes.bool.isRequired,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighting: PropTypes.bool.isRequired
};

const DeltaCell = memo(({ data, valueKey, strike, isCe, onClick, isHighlighting }) => (
  <td
    onClick={onClick}
    className={`${getHighlightClass(data[valueKey], data[valueKey + '_max_value'], isHighlighting, isCe)} cursor-pointer`}
  >
    {formatNumber(data[`${valueKey}_percentage`])}% <br />
    <small>{formatNumber(data[valueKey])}</small>
  </td>
));

DeltaCell.propTypes = {
  data: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isCe: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighting: PropTypes.bool.isRequired
};

const IVCell = memo(({ data, valueKey, strike, isCe, onClick, isHighlighting }) => (
  <td
    onClick={onClick}
    className={`${getHighlightClass(data[valueKey], data[valueKey], isHighlighting, isCe)} cursor-pointer`}
  >
    {formatNumber(data[valueKey])} <br />
    <small>{formatNumber(data.optgeeks?.delta)}</small>
  </td>
));

IVCell.propTypes = {
  data: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isCe: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighting: PropTypes.bool.isRequired
};

/**
 * Render a row in the options chain table
 * @param {Object} strikeData - Data for the strike
 * @param {number} strike - Strike price
 * @param {boolean} isHighlighting - Whether highlighting is enabled
 * @param {Object} optionChain - Complete option chain data
 * @param {Function} handlePercentageClick - Handler for percentage click
 * @param {Function} handleDeltaClick - Handler for delta click
 * @param {Function} handleIVClick - Handler for IV click
 * @param {Function} handleReversalClick - Handler for reversal click
 * @param {string} theme - Current theme
 * @returns {React.Fragment} Row cells
 */
export function renderStrikeRow(
  strikeData,
  strike,
  isHighlighting,
  optionChain,
  handlePercentageClick,
  handleDeltaClick,
  handleIVClick,
  handleReversalClick,
  theme
) {
  const { ce: ceData = {}, pe: peData = {} } = strikeData || {};
  const oc = optionChain || {};
  const reversal = oc?.oc || {};

  // Precompute ratios
  const oiRatio = peData?.OI && ceData?.OI ? peData.OI / ceData.OI : 0;
  const oiChngRatio = peData?.oichng && ceData?.oichng ? peData.oichng / ceData.oichng : 0;

  // Theme-based classes
  const themeClass = THEME_CLASSES[theme === 'dark' ? 'dark' : 'light'];
  const strikeCellClass = `font-bold border-spacing-y-1 border border-gray-950 ${themeClass.bg}`;

  return (
    <React.Fragment key={strike}>
      {/* CE Data Cells */}
      <IVCell
        data={ceData}
        valueKey="iv"
        strike={strike}
        isCe={true}
        onClick={() => handleIVClick(true, strike)}
        isHighlighting={isHighlighting}
      />
      <DeltaCell
        data={ceData}
        valueKey="oichng"
        strike={strike}
        isCe={true}
        onClick={() => handleDeltaClick(strike)}
        isHighlighting={isHighlighting}
      />
      <DataCell
        data={ceData}
        valueKey="OI"
        isCe={true}
        strike={strike}
        onClick={() => handlePercentageClick(true, strike)}
        isHighlighting={isHighlighting}
      />
      <DataCell
        data={ceData}
        valueKey="vol"
        isCe={true}
        strike={strike}
        onClick={() => handlePercentageClick(true, strike)}
        isHighlighting={isHighlighting}
      />

      {/* LTP Cell */}
      <td>
        {formatNumber(ceData.ltp)} <br />
        <small className={`${getHighlightTextClass(ceData.p_chng)} gap-x-3`}>
          {formatNumber(ceData.p_chng)}
          <span className={themeClass.text}> ( </span>
          <span className={getHighlightTextClass(ceData.ltp - reversal?.[strike]?.reversal?.ce_tv || 0)}>
            {((typeof reversal?.[strike]?.reversal?.ce_tv === 'number')
              ? (ceData.ltp - reversal?.[strike]?.reversal?.ce_tv).toFixed(0)
              : 0) || 0}
          </span>
          <span className={themeClass.text}> )</span>
        </small>
      </td>

      {/* Strike Price Cell */}
      <td className={`${strikeCellClass} cursor-pointer`} onClick={() => handleReversalClick(strike)}>
        {strike} <br />
        <small className={`font-normal ${getPCRClass(oiRatio)}`}>
          {toFixed(oiRatio)}
        </small> /
        <small className={`font-normal ${getPCRClass(oiChngRatio)}`}>
          {toFixed(oiChngRatio)}
        </small>
      </td>

      {/* PE Data Cells */}
      <td>
        {formatNumber(peData.ltp)} <br />
        <small className={getHighlightTextClass(peData.p_chng)}>
          {formatNumber(peData.p_chng)}
          <span className={themeClass.text}> ( </span>
          <span className={getHighlightTextClass(peData.ltp - reversal?.[strike]?.reversal?.pe_tv || 0)}>
            {((typeof reversal?.[strike]?.reversal?.pe_tv === 'number')
              ? (peData.ltp - reversal?.[strike]?.reversal?.pe_tv).toFixed(0)
              : 0) || 0}
          </span>
          <span className={themeClass.text}> )</span>
        </small>
      </td>

      <DataCell
        data={peData}
        valueKey="vol"
        isCe={false}
        strike={strike}
        onClick={() => handlePercentageClick(false, strike)}
        isHighlighting={isHighlighting}
      />
      <DataCell
        data={peData}
        valueKey="OI"
        isCe={false}
        strike={strike}
        onClick={() => handlePercentageClick(false, strike)}
        isHighlighting={isHighlighting}
      />
      <DeltaCell
        data={peData}
        valueKey="oichng"
        strike={strike}
        isCe={false}
        onClick={() => handleDeltaClick(strike)}
        isHighlighting={isHighlighting}
      />
      <IVCell
        data={peData}
        valueKey="iv"
        strike={strike}
        isCe={false}
        onClick={() => handleIVClick(false, strike)}
        isHighlighting={isHighlighting}
      />
    </React.Fragment>
  );
}

renderStrikeRow.propTypes = {
  strikeData: PropTypes.object,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isHighlighting: PropTypes.bool.isRequired,
  optionChain: PropTypes.object,
  handlePercentageClick: PropTypes.func.isRequired,
  handleDeltaClick: PropTypes.func.isRequired,
  handleIVClick: PropTypes.func.isRequired,
  handleReversalClick: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired
};