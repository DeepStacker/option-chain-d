import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Importing icons
import { toFixed, formatNumber } from "../utils/utils";
import { useSelector } from "react-redux";

function TickerChange() {
    const data = useSelector((state) => state.data.data);
    const theme = useSelector((state) => state.theme.theme);

    const marketData = data?.spot?.data;
    const title = `${marketData?.d_sym || "N/A"} | ${toFixed(marketData?.Ltp)} | ${formatNumber(marketData?.ch)}`;

    // Set document title with market data if available
    if (marketData) {
        document.title = title;
    }

    // Determine colors based on market change
    const isPriceUp = marketData?.ch > 0;
    const priceChangeColor = isPriceUp ? "bg-green-500" : "bg-orange-400";
    const textColor = isPriceUp ? "text-green-800" : "text-red-800"; // Different color for text to contrast with background
    const arrowColor = isPriceUp ? "text-green-700" : "text-red-700"; // Lighter color for arrows

    return (
        <div className={`flex items-center justify-evenly rounded-full  border ${priceChangeColor} md:mb-0`}>
            <div className={` flex   items-right`} >

                <p className={`text-md font-medium ${textColor}`}>
                    {formatNumber(marketData?.ch)}
                </p>

                <p className={`text-md font-medium ${textColor}`}>
                    {isPriceUp ? (
                        <FaArrowUp className={`inline ml-1 ${arrowColor}`} />
                    ) : (
                        <FaArrowDown className={`inline ml-1 ${arrowColor}`} />
                    )}
                </p>
                <p className={`text-md font-medium ${textColor}`}>
                    ({formatNumber(marketData?.p_ch)}%)
                </p>
            </div>
        </div>
    );
}

export default TickerChange;
