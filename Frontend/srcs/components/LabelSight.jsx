import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Importing icons
import { toFixed, formatNumber } from "../utils/utils";
import { useSelector } from "react-redux";

function LabelSight() {
    const data = useSelector((state) => state.data.data);
    const theme = useSelector((state) => state.theme.theme);

    const marketData = data?.spot?.data;
    const futData = data?.fut?.data?.flst;
    const flst = Object.keys(futData)[0]
    // console.log(flst)
    const title = `${marketData?.d_sym || "N/A"} | ${toFixed(marketData?.Ltp)} | ${formatNumber(marketData?.ch)}`;

    // Set document title with market data if available
    if (marketData) {
        document.title = title;
    }

    // Determine colors based on market change
    const isPriceUp = marketData?.ch > 0;
    const isFutPriceUp = (futData[flst]?.ltp - marketData?.Ltp) > 0;
    const priceChangeColor = isPriceUp ? "bg-green-500" : "bg-orange-400";
    const textColor = isFutPriceUp ? "text-green-800" : "text-red-800"; // Different color for text to contrast with background
    const arrowColor = isPriceUp ? "text-green-700" : "text-red-700"; // Lighter color for arrows

    return (
        <div className={`flex items-center justify-evenly rounded-full p-1 border ${priceChangeColor} md:mb-0`}>

            <p className={`text-xl font-bold text-center `}>
                Fut:{toFixed(futData[flst]?.ltp)}
            </p>

            <p className={`text-xl font-bold text-center `}>
                Spot:{toFixed(marketData?.Ltp)}
            </p>
            <p className={`text-xl font-bold text-center ${textColor} `}>
                F-S: {toFixed(futData[flst]?.ltp - marketData?.Ltp)}
            </p>

        </div>
    );
}

export default LabelSight;
