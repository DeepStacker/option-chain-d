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



export function renderStrikeRow(strikeData, strike, isHighlighting, optionChain, handlePercentageClick, handleDeltaClick, handleIVClick, handleReversalClick, theme) {
    const { ce: ceData = {}, pe: peData = {} } = strikeData || {};
    const oc = optionChain || {};
    const reversal = oc?.oc || {};
    // console.log(oc)
    const strike_diff = Object.keys(reversal);
    // console.log(strike_diff)
    const stk_diff = strike_diff[1] - strike_diff[0];
    // console.log(stk_diff)



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

    const DeltaDataCell = memo(({ data, valueKey, strike, isCe }) => (
        <td
            onClick={() => handleDeltaClick(strike)}
            className={`${getHighlightClass(data[valueKey], data[valueKey + '_max_value'], isHighlighting, isCe)} cursor-pointer`}
        >
            {formatNumber(data[`${valueKey}_percentage`])}% <br />
            <small>{formatNumber(data[valueKey])}</small>
        </td>
    ));

    DeltaDataCell.propTypes = {
        data: PropTypes.object.isRequired,
        valueKey: PropTypes.string.isRequired,
        strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    };

    const IVDataCell = memo(({ data, valueKey, strike, isCe }) => (
        <td
            onClick={() => handleIVClick(isCe, strike, oc)}
            className={`${getHighlightClass(data[valueKey], data[valueKey], isHighlighting, isCe)} cursor-pointer`}>
            {formatNumber(data[valueKey])} <br />
            <small>{formatNumber(data.optgeeks?.delta)}</small>
        </td>
    ));

    IVDataCell.propTypes = {
        data: PropTypes.object.isRequired,
        valueKey: PropTypes.string.isRequired,
        strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    };

    return (
        <React.Fragment key={strike}>
            {/* CE Data Cells */}
            <IVDataCell data={ceData} valueKey="iv" strike={strike} isCe={true} />
            <DeltaDataCell data={ceData} valueKey="oichng" strike={strike} isCe={true} />
            <DataCell data={ceData} valueKey="OI" isCe={true} strike={strike} />
            <DataCell data={ceData} valueKey="vol" isCe={true} strike={strike} />

            <td>
                {formatNumber(ceData.ltp)} <br />
                <small className={`${getHighlightTextClass(ceData.p_chng)} gap-x-3 `}>
                    {formatNumber(ceData.p_chng)}
                    (<span className={getHighlightTextClass(ceData.ltp - reversal?.[strike]?.reversal?.ce_tv || 0)}>

                        {((typeof reversal?.[strike]?.reversal?.ce_tv === 'number') ? (ceData.ltp - reversal?.[strike]?.reversal?.ce_tv).toFixed(0) : 0) || 0}
                    </span>)
                </small>
            </td>

            {/* Strike Price with Ratios */}
            <td
                className={`${strikeCellClass} cursor-pointer `}
                onClick={() => handleReversalClick(strike, oc)}>
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
                    (<span className={getHighlightTextClass(peData.ltp - reversal?.[strike]?.reversal?.pe_tv || 0)}>

                        {((typeof reversal?.[strike]?.reversal?.pe_tv === 'number') ? (peData.ltp - reversal?.[strike]?.reversal?.pe_tv).toFixed(0) : 0) || 0}
                    </span>)
                </small>
            </td>

            <DataCell data={peData} valueKey="vol" isCe={false} strike={strike} />
            <DataCell data={peData} valueKey="OI" isCe={false} strike={strike} />
            <DeltaDataCell data={peData} valueKey="oichng" strike={strike} isCe={false} />
            <IVDataCell data={peData} valueKey="iv" strike={strike} isCe={false} />
        </React.Fragment>
    );

}


export function findStrikes(options, atmPrice) {
    const nearestStrike = atmPrice;
    const otmStrikes = Object.keys(options).filter((s) => s > atmPrice);
    const itmStrikes = Object.keys(options).filter((s) => s < atmPrice);
    return { nearestStrike, otmStrikes, itmStrikes };
}
