import React, { memo } from "react";
import PropTypes from 'prop-types';
import { formatNumber, toFixed } from '../utils';
import { useSelector } from "react-redux";



const getBackgroundClass = (oc, strike, type) =>
    type === 'ce' ? (oc?.sltp > strike ? 'bg-itm-highlight' : '') : (oc?.sltp < strike ? 'bg-itm-highlight' : '');

const getHighlightClass = (abs, value, isHighlighting, isCe) => {
    if (isNaN(value) || !isHighlighting) return '';
    const baseClass = isCe ? 'text-black bg-red-500 z-50' : 'text-black bg-green-500 z-50';
    if (value === '1') return baseClass;
    if (abs <= 0) return 'text-black text-red-500';
    if (value === '2') return ' text-black bg-yellow-300';
    if (['3', '4', '5'].includes(value)) return 'text-black bg-yellow-100';
    return '';
};

const getHighlightTextClass = (abs) => (!isNaN(abs) && abs <= 0 ? 'text-red-500' : 'text-green-700');
const getPCRClass = (pcr) => (pcr > 1.2 ? 'text-green-700' : pcr < 0.8 ? 'text-red-500' : '');



export function renderStrikeRow(strikeData, strike, isHighlighting, optionChain, handlePercentageClick, theme) {
    const { ce: ceData = {}, pe: peData = {} } = strikeData || {};
    const oc = optionChain || {};

    // Precompute ratios with default value of 0
    const oiRatio = peData?.OI && ceData?.OI ? peData.OI / ceData.OI : 0;
    const oiChngRatio = peData?.oichng && ceData?.oichng ? peData.oichng / ceData.oichng : 0;

    // Define reusable classes
    const themeClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';
    const strikeCellClass = `font-bold border-spacing-y-1 border border-gray-950 ${themeClass}`;

    // Memoized DataCell component for displaying dynamic cells
    const DataCell = memo(({ data, valueKey, isCe, strike }) => (
        <td
            onClick={() => handlePercentageClick(isCe, strike, oc)}
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
    };

    return (
        <React.Fragment key={strike}>
            {/* CE Data Cells */}
            <td className={`${getHighlightClass(ceData.iv, ceData.iv, isHighlighting, true)}`}>
                {formatNumber(ceData.iv)} <br />
                <small>{formatNumber(ceData.optgeeks?.delta)}</small>
            </td>

            <DataCell data={ceData} valueKey="oichng" isCe={true} strike={strike} />
            <DataCell data={ceData} valueKey="OI" isCe={true} strike={strike} />
            <DataCell data={ceData} valueKey="vol" isCe={true} strike={strike} />

            <td>
                {formatNumber(ceData.ltp)} <br />
                <small className={getHighlightTextClass(ceData.p_chng)}>
                    {formatNumber(ceData.p_chng)}
                </small>
            </td>

            {/* Strike Price with Ratios */}
            <td className={strikeCellClass}>
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
                </small>
            </td>

            <DataCell data={peData} valueKey="vol" isCe={false} strike={strike} />
            <DataCell data={peData} valueKey="OI" isCe={false} strike={strike} />
            <DataCell data={peData} valueKey="oichng" isCe={false} strike={strike} />

            <td className={`${getHighlightClass(peData.iv, peData.iv, isHighlighting, false)}`}>
                {formatNumber(peData.iv)} <br />
                <small>{formatNumber(peData.optgeeks?.delta)}</small>
            </td>
        </React.Fragment>
    );
}


export function findStrikes(options, atmPrice) {
    const nearestStrike = atmPrice;
    const otmStrikes = Object.keys(options).filter((s) => s > atmPrice);
    const itmStrikes = Object.keys(options).filter((s) => s < atmPrice);
    // console.log(otmStrikes)
    // console.log(itmStrikes)
    // console.log(nearestStrike)
    // console.log(atmPrice)
    return { nearestStrike, otmStrikes, itmStrikes };
}
