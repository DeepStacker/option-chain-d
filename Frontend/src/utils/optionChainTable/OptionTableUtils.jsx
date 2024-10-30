import React, { useState, useEffect, memo } from "react";
import PropTypes from 'prop-types';
import { formatNumber, toFixed } from '../utils';

const getBackgroundClass = (oc, strike, type) =>
    type === 'ce' ? (oc?.sltp > strike ? 'bg-itm-highlight' : '') : (oc?.sltp < strike ? 'bg-itm-highlight' : '');

const getHighlightClass = (abs, value, isHighlighting, isCe) => {
    if (isNaN(value) || !isHighlighting) return '';
    const baseClass = isCe ? 'bg-red-300 z-50' : 'bg-green-300 z-50';
    if (value == '1') return baseClass;
    if (abs <= 0) return 'text-red-500';
    if (value == '2') return 'bg-yellow-300';
    if (['3', '4', '5'].includes(value)) return 'bg-yellow-100';
    return '';
};

const getHighlightTextClass = (abs) => (!isNaN(abs) && abs <= 0 ? 'text-red-500' : 'text-green-700');
const getPCRClass = (pcr) => (pcr > 1.2 ? 'text-green-700' : pcr < 0.8 ? 'text-red-500' : '');

export function renderStrikeRow(strikeData, strike, isHighlighting, optionChain, handlePercentageClick) {
    const [state, setState] = useState({ ceData: {}, peData: {}, oc: {} });

    useEffect(() => {
        setState({
            ceData: strikeData?.ce || {},
            peData: strikeData?.pe || {},
            oc: optionChain || {}
        });
    }, [strikeData, optionChain]);

    const { ceData, peData, oc } = state;

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
            <td className={`${getHighlightClass(ceData?.iv, ceData?.iv, isHighlighting, true)}`}>
                {formatNumber(ceData?.iv)} <br />
                <small>{formatNumber(ceData?.optgeeks?.delta)}</small>
            </td>

            <DataCell data={ceData} valueKey="oichng" isCe={true} strike={strike} />
            <DataCell data={ceData} valueKey="OI" isCe={true} strike={strike} />
            <DataCell data={ceData} valueKey="vol" isCe={true} strike={strike} />

            <td>
                {formatNumber(ceData?.ltp)} <br />
                <small className={getHighlightTextClass(ceData?.p_chng)}>
                    {formatNumber(ceData?.p_chng)}
                </small>
            </td>

            <td className="font-bold bg-gray-300">
                {strike} <br />
                <small className={`font-normal ${getPCRClass(peData?.OI / ceData?.OI)}`}>
                    {toFixed(peData?.OI / ceData?.OI)}
                </small> / 
                <small className={`font-normal ${getPCRClass(peData?.oichng / ceData?.oichng)}`}>
                    {toFixed(peData?.oichng / ceData?.oichng)}
                </small>
            </td>

            <td>
                {formatNumber(peData?.ltp)} <br />
                <small className={getHighlightTextClass(peData?.p_chng)}>
                    {formatNumber(peData?.p_chng)}
                </small>
            </td>

            <DataCell data={peData} valueKey="vol" isCe={false} strike={strike} />
            <DataCell data={peData} valueKey="OI" isCe={false} strike={strike} />
            <DataCell data={peData} valueKey="oichng" isCe={false} strike={strike} />

            <td className={`${getHighlightClass(peData?.iv, peData?.iv, isHighlighting, false)}`}>
                {formatNumber(peData?.iv)} <br />
                <small>{formatNumber(peData?.optgeeks?.delta)}</small>
            </td>
        </React.Fragment>
    );
}

export function findStrikes(options, atmPrice) {
    const nearestStrike = atmPrice;
    const otmStrikes = Object.keys(options).filter((s) => s > atmPrice);
    const itmStrikes = Object.keys(options).filter((s) => s < atmPrice);
    return { nearestStrike, otmStrikes, itmStrikes };
}
