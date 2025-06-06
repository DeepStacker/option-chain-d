// src/utils/optionChainTable/OptionTableUtils.js
import React, { memo, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { FixedSizeList as List } from "react-window";
import { formatNumber, toFixed } from "../utils";

// Optimized utility functions without console logs for production performance
const getBackgroundClass = (strike, type, sltp, isItmHighlighting) => {
  if (!sltp || !strike || !isItmHighlighting) return "";

  const strikePrice = parseFloat(strike);
  const spotPrice = parseFloat(sltp);

  if (isNaN(strikePrice) || isNaN(spotPrice)) return "";

  // For Call Options (CE): ITM when strike < spot price
  if (type === "ce") {
    return strikePrice < spotPrice ? "bg-itm-highlight" : "";
  }

  // For Put Options (PE): ITM when strike > spot price
  if (type === "pe") {
    return strikePrice > spotPrice ? "bg-itm-highlight" : "";
  }

  return "";
};

const getHighlightClass = (abs, value, isHighlighting, isCe) => {
  if (isNaN(abs) || !isHighlighting || value === undefined || value === null)
    return "";

  const baseClass = isCe
    ? "text-black bg-red-500 z-50 transition-colors duration-200"
    : "text-black bg-green-500 z-50 transition-colors duration-200";

  if (value === "1") return baseClass;
  if (abs <= 0) return "text-red-500 transition-colors duration-200";
  if (value === "2")
    return "text-black bg-yellow-300 transition-colors duration-200";
  if (["3", "4", "5"].includes(value))
    return "text-black bg-yellow-100 transition-colors duration-200";

  return "";
};

const getHighlightTextClass = (abs) => {
  if (abs === undefined || abs === null || isNaN(abs)) return "";
  return abs <= 0 ? "text-red-500" : "text-green-400";
};

const getPCRClass = (pcr) => {
  if (pcr === undefined || pcr === null || isNaN(pcr)) return "";
  return pcr > 1.2 ? "text-green-700" : pcr < 0.8 ? "text-red-500" : "";
};

// Optimized clipboard copy function
const copyToClipboard = async (text, showAlert = false) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text.toString());
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    if (showAlert) {
      console.log(`Copied: ${text}`);
    }
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

// Helper function to check if a class has background
const hasBackgroundClass = (className) => {
  return (
    className &&
    (className.includes("bg-red-500") ||
      className.includes("bg-green-500") ||
      className.includes("bg-yellow-300") ||
      className.includes("bg-yellow-100"))
  );
};

// Memoized class calculation component
const OptimizedClasses = memo(
  ({
    strike,
    type,
    sltp,
    isItmHighlighting,
    cellValue,
    maxValue,
    isHighlighting,
    isCe,
  }) => {
    return useMemo(() => {
      const backgroundClass = getBackgroundClass(
        strike,
        type,
        sltp,
        isItmHighlighting
      );
      const highlightClass = getHighlightClass(
        cellValue,
        maxValue,
        isHighlighting,
        isCe
      );

      return {
        backgroundClass,
        highlightClass,
        finalClass: `${
          hasBackgroundClass(highlightClass) ? "" : backgroundClass
        } ${highlightClass}`.trim(),
      };
    }, [
      strike,
      type,
      sltp,
      isItmHighlighting,
      cellValue,
      maxValue,
      isHighlighting,
      isCe,
    ]);
  }
);

// Optimized DataCell component with performance improvements
const DataCell = memo(
  ({
    data,
    valueKey,
    isCe,
    strike,
    handlePercentageClick,
    isHighlighting,
    isItmHighlighting,
    oc,
    sltp,
  }) => {
    if (!data) return <td className="p-0 text-center">-</td>;

    const cellValue = data?.[valueKey];
    const maxValue = data?.[`${valueKey}_max_value`];
    const percentageValue = data?.[`${valueKey}_percentage`];

    const handleClick = useCallback(() => {
      if (handlePercentageClick) {
        handlePercentageClick(isCe, strike, oc);
      }
    }, [handlePercentageClick, isCe, strike, oc]);

    // Memoize class calculations with proper dependencies
    const { finalClass } = useMemo(() => {
      const backgroundClass = getBackgroundClass(
        strike,
        isCe ? "ce" : "pe",
        sltp,
        isItmHighlighting
      );
      const highlightClass = getHighlightClass(
        cellValue,
        maxValue,
        isHighlighting,
        isCe
      );

      return {
        backgroundClass,
        highlightClass,
        finalClass: `${
          hasBackgroundClass(highlightClass) ? "" : backgroundClass
        } ${highlightClass}`.trim(),
      };
    }, [
      strike,
      isCe,
      sltp,
      isItmHighlighting,
      cellValue,
      maxValue,
      isHighlighting,
    ]);

    // Memoize formatted values to prevent recalculation
    const formattedPercentage = useMemo(
      () => formatNumber(percentageValue),
      [percentageValue]
    );
    const formattedValue = useMemo(() => formatNumber(cellValue), [cellValue]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <td
        onClick={handleClick}
        className={`${finalClass} cursor-pointer hover:opacity-80 transition-opacity duration-150 p-0 text-center`}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="font-medium">{formattedPercentage}%</div>
        <small className="text-xs opacity-75">{formattedValue}</small>
      </td>
    );
  }
);

DataCell.propTypes = {
  data: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  isCe: PropTypes.bool.isRequired,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handlePercentageClick: PropTypes.func,
  isHighlighting: PropTypes.bool,
  isItmHighlighting: PropTypes.bool,
  oc: PropTypes.object,
  sltp: PropTypes.number,
};

DataCell.displayName = "DataCell";

// Optimized DeltaDataCell component
const DeltaDataCell = memo(
  ({
    data,
    valueKey,
    strike,
    isCe,
    handleDeltaClick,
    isHighlighting,
    isItmHighlighting,
    sltp,
  }) => {
    if (!data) return <td className="p-0 text-center">-</td>;

    const cellValue = data?.[valueKey];
    const maxValue = data?.[`${valueKey}_max_value`];
    const percentageValue = data?.[`${valueKey}_percentage`];

    const handleClick = useCallback(() => {
      if (handleDeltaClick) {
        handleDeltaClick(strike);
      }
    }, [handleDeltaClick, strike]);

    const { finalClass } = useMemo(() => {
      const backgroundClass = getBackgroundClass(
        strike,
        isCe ? "ce" : "pe",
        sltp,
        isItmHighlighting
      );
      const highlightClass = getHighlightClass(
        cellValue,
        maxValue,
        isHighlighting,
        isCe
      );

      return {
        backgroundClass,
        highlightClass,
        finalClass: `${
          hasBackgroundClass(highlightClass) ? "" : backgroundClass
        } ${highlightClass}`.trim(),
      };
    }, [
      strike,
      isCe,
      sltp,
      isItmHighlighting,
      cellValue,
      maxValue,
      isHighlighting,
    ]);

    const formattedPercentage = useMemo(
      () => formatNumber(percentageValue),
      [percentageValue]
    );
    const formattedValue = useMemo(() => formatNumber(cellValue), [cellValue]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <td
        onClick={handleClick}
        className={`${finalClass} cursor-pointer hover:opacity-80 transition-opacity duration-150 p-0 text-center`}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="font-medium">{formattedPercentage}%</div>
        <small className="text-xs opacity-75">{formattedValue}</small>
      </td>
    );
  }
);

DeltaDataCell.propTypes = {
  data: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isCe: PropTypes.bool.isRequired,
  handleDeltaClick: PropTypes.func,
  isHighlighting: PropTypes.bool,
  isItmHighlighting: PropTypes.bool,
  sltp: PropTypes.number,
};

DeltaDataCell.displayName = "DeltaDataCell";

// Optimized IVDataCell component
const IVDataCell = memo(
  ({
    data,
    valueKey,
    strike,
    isCe,
    handleIVClick,
    isHighlighting,
    isItmHighlighting,
    oc,
    sltp,
  }) => {
    if (!data) return <td className="p-0 text-center">-</td>;

    const cellValue = data?.[valueKey];
    const deltaValue = data?.optgeeks?.delta;

    const handleClick = useCallback(() => {
      if (handleIVClick) {
        handleIVClick(isCe, strike, oc);
      }
    }, [handleIVClick, isCe, strike, oc]);

    const { finalClass } = useMemo(() => {
      const backgroundClass = getBackgroundClass(
        strike,
        isCe ? "ce" : "pe",
        sltp,
        isItmHighlighting
      );
      const highlightClass = getHighlightClass(
        cellValue,
        cellValue,
        isHighlighting,
        isCe
      );

      return {
        backgroundClass,
        highlightClass,
        finalClass: `${
          hasBackgroundClass(highlightClass) ? "" : backgroundClass
        } ${highlightClass}`.trim(),
      };
    }, [strike, isCe, sltp, isItmHighlighting, cellValue, isHighlighting]);

    const formattedCellValue = useMemo(
      () => formatNumber(cellValue),
      [cellValue]
    );
    const formattedDeltaValue = useMemo(
      () => formatNumber(deltaValue),
      [deltaValue]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <td
        onClick={handleClick}
        className={`${finalClass} cursor-pointer hover:opacity-80 transition-opacity duration-150 p-0 text-center`}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="font-medium">{formattedCellValue}</div>
        <small className="text-xs opacity-75">{formattedDeltaValue}</small>
      </td>
    );
  }
);

IVDataCell.propTypes = {
  data: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isCe: PropTypes.bool.isRequired,
  handleIVClick: PropTypes.func,
  isHighlighting: PropTypes.bool,
  isItmHighlighting: PropTypes.bool,
  oc: PropTypes.object,
  sltp: PropTypes.number,
};

IVDataCell.displayName = "IVDataCell";

// Optimized LTP Cell component
const LTPCell = memo(
  ({ data, reversal, strike, theme, type, sltp, isItmHighlighting }) => {
    if (!data) return <td className="p-0 text-center">-</td>;

    const ltp = data?.ltp;
    const pChng = data?.p_chng;
    const tvKey = type === "ce" ? "ce_tv" : "pe_tv";
    const tvValue = reversal?.[strike]?.[tvKey];

    const tvDifference = useMemo(() => {
      if (typeof tvValue === "number" && typeof ltp === "number") {
        return (ltp - tvValue).toFixed(0);
      }
      return 0;
    }, [ltp, tvValue]);

    const pChngClass = useMemo(() => getHighlightTextClass(pChng), [pChng]);
    const tvDiffClass = useMemo(
      () => getHighlightTextClass(tvDifference),
      [tvDifference]
    );
    const themeTextClass = useMemo(
      () => (theme === "dark" ? "text-white" : "text-black"),
      [theme]
    );

    const backgroundClass = useMemo(
      () => getBackgroundClass(strike, type, sltp, isItmHighlighting),
      [strike, type, sltp, isItmHighlighting]
    );

    const formattedLtp = useMemo(() => formatNumber(ltp), [ltp]);
    const formattedPChng = useMemo(() => formatNumber(pChng), [pChng]);

    return (
      <td className={`p-0 text-center ${backgroundClass}`}>
        <div className="font-medium">{formattedLtp}</div>
        <small
          className={`${pChngClass} text-xs flex items-center justify-center gap-0`}
        >
          <span>{formattedPChng}</span>
          <span className={themeTextClass}>(</span>
          <span className={tvDiffClass}>{tvDifference}</span>
          <span className={themeTextClass}>)</span>
        </small>
      </td>
    );
  }
);

LTPCell.propTypes = {
  data: PropTypes.object.isRequired,
  reversal: PropTypes.object,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  theme: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["ce", "pe"]).isRequired,
  sltp: PropTypes.number,
  isItmHighlighting: PropTypes.bool,
};

LTPCell.displayName = "LTPCell";

// Optimized Reversal Cell component
const ReversalCell = memo(
  ({
    value,
    title,
    showAlert = false,
    strike,
    type,
    sltp,
    isItmHighlighting,
  }) => {
    // No data check needed here as 'value' is passed directly

    const handleClick = useCallback(async () => {
      await copyToClipboard(value || 0, showAlert);
    }, [value, showAlert]);

    const backgroundClass = useMemo(
      () => getBackgroundClass(strike, type, sltp, isItmHighlighting),
      [strike, type, sltp, isItmHighlighting]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <td
        onClick={handleClick}
        className={`${backgroundClass} cursor-pointer hover:bg-opacity-80 transition-colors duration-150 p-0 text-center font-medium`}
        title={title}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {value || 0}
      </td>
    );
  }
);

ReversalCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  showAlert: PropTypes.bool,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(["ce", "pe"]),
  sltp: PropTypes.number,
  isItmHighlighting: PropTypes.bool,
};

ReversalCell.displayName = "ReversalCell";

// Optimized Strike Cell component
const StrikeCell = memo(
  ({ strike, oiRatio, oiChngRatio, theme, handleReversalClick, oc }) => {
    // No data check needed here as strike, oiRatio, oiChngRatio are passed directly

    const themeClass = useMemo(
      () => (theme === "dark" ? "bg-gray-700" : "bg-gray-300"),
      [theme]
    );
    const strikeCellClass = useMemo(
      () => `font-bold border-spacing-y-1 border border-gray-950 ${themeClass}`,
      [themeClass]
    );

    const handleClick = useCallback(() => {
      if (handleReversalClick) {
        handleReversalClick(strike, oc);
      }
    }, [handleReversalClick, strike, oc]);

    const oiRatioClass = useMemo(() => getPCRClass(oiRatio), [oiRatio]);
    const oiChngRatioClass = useMemo(
      () => getPCRClass(oiChngRatio),
      [oiChngRatio]
    );

    const formattedOiRatio = useMemo(() => toFixed(oiRatio), [oiRatio]);
    const formattedOiChngRatio = useMemo(
      () => toFixed(oiChngRatio),
      [oiChngRatio]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <td
        className={`${strikeCellClass} cursor-pointer hover:opacity-90 transition-opacity duration-150 p-0 text-center`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="font-bold text-lg">{strike}</div>
        <div className="text-xs flex items-center justify-center gap-0">
          <small className={`font-normal ${oiRatioClass}`}>
            {formattedOiRatio}
          </small>
          <span>/</span>
          <small className={`font-normal ${oiChngRatioClass}`}>
            {formattedOiChngRatio}
          </small>
        </div>
      </td>
    );
  }
);

StrikeCell.propTypes = {
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  oiRatio: PropTypes.number.isRequired,
  oiChngRatio: PropTypes.number.isRequired,
  theme: PropTypes.string.isRequired,
  handleReversalClick: PropTypes.func,
  oc: PropTypes.object,
};

StrikeCell.displayName = "StrikeCell";

// Virtualized Strike Row Component for performance
const VirtualizedStrikeRow = memo(({ index, style, data }) => {
  const {
    strikes,
    strikeDataMap,
    isHighlighting,
    isItmHighlighting,
    optionChain,
    handlePercentageClick,
    handleDeltaClick,
    handleIVClick,
    handleReversalClick,
    theme,
    sltp,
  } = data;

  const strike = strikes[index];
  const strikeData = strikeDataMap[strike];

  if (!strikeData) return <div style={style} />;

  const { ce: ceData = {}, pe: peData = {} } = strikeData;
  const oc = optionChain || {};
  const reversal = oc?.oc || {};

  // Memoize expensive calculations to prevent recalculation on every render
  const calculations = useMemo(() => {
    const strikeKeys = Object.keys(reversal);
    const strikeDiff =
      strikeKeys.length >= 2
        ? parseFloat(strikeKeys[1]) - parseFloat(strikeKeys[0])
        : 0;

    const oiRatio =
      peData?.OI && ceData?.OI && ceData.OI !== 0 ? peData.OI / ceData.OI : 0;

    const oiChngRatio =
      peData?.oichng && ceData?.oichng && ceData.oichng !== 0
        ? peData.oichng / ceData.oichng
        : 0;

    const ceReversalValue = (strikeData?.reversal || 0) + strikeDiff;
    const peReversalValue = strikeData?.reversal || 0;

    return { oiRatio, oiChngRatio, ceReversalValue, peReversalValue };
  }, [strikeData, reversal, ceData, peData]);

  const { oiRatio, oiChngRatio, ceReversalValue, peReversalValue } =
    calculations;

  return (
    <div style={style} className="flex">
      <table className="w-full table-fixed">
        <tbody>
          <tr>
            {renderStrikeRow(
              strikeData,
              strike,
              isHighlighting,
              isItmHighlighting,
              optionChain,
              handlePercentageClick,
              handleDeltaClick,
              handleIVClick,
              handleReversalClick,
              theme,
              sltp,
              oiRatio, // Pass calculated values
              oiChngRatio, // Pass calculated values
              ceReversalValue, // Pass calculated values
              peReversalValue // Pass calculated values
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
});

VirtualizedStrikeRow.displayName = "VirtualizedStrikeRow";

// Main Virtualized Option Chain Table Component
export const VirtualizedOptionChainTable = memo(
  ({
    strikes = [],
    strikeDataMap = {},
    isHighlighting = false,
    isItmHighlighting = false,
    optionChain = {},
    handlePercentageClick,
    handleDeltaClick,
    handleIVClick,
    handleReversalClick,
    theme = "light",
    sltp,
    height = 600,
    rowHeight = 60,
  }) => {
    // Memoize the data object to prevent unnecessary re-renders
    const itemData = useMemo(
      () => ({
        strikes,
        strikeDataMap,
        isHighlighting,
        isItmHighlighting,
        optionChain,
        handlePercentageClick,
        handleDeltaClick,
        handleIVClick,
        handleReversalClick,
        theme,
        sltp,
      }),
      [
        strikes,
        strikeDataMap,
        isHighlighting,
        isItmHighlighting,
        optionChain,
        handlePercentageClick,
        handleDeltaClick,
        handleIVClick,
        handleReversalClick,
        theme,
        sltp,
      ]
    );

    return (
      <div className="option-chain-virtualized">
        <List
          height={height}
          itemCount={strikes.length}
          itemSize={rowHeight}
          itemData={itemData}
          overscanCount={5}
          className="option-chain-list"
        >
          {VirtualizedStrikeRow}
        </List>
      </div>
    );
  }
);

VirtualizedOptionChainTable.propTypes = {
  strikes: PropTypes.array,
  strikeDataMap: PropTypes.object,
  isHighlighting: PropTypes.bool,
  isItmHighlighting: PropTypes.bool,
  optionChain: PropTypes.object,
  handlePercentageClick: PropTypes.func,
  handleDeltaClick: PropTypes.func,
  handleIVClick: PropTypes.func,
  handleReversalClick: PropTypes.func,
  theme: PropTypes.string,
  sltp: PropTypes.number,
  height: PropTypes.number,
  rowHeight: PropTypes.number,
};

VirtualizedOptionChainTable.displayName = "VirtualizedOptionChainTable";

// Optimized renderStrikeRow function with memoized calculations
export function renderStrikeRow(
  strikeData,
  strike,
  isHighlighting,
  isItmHighlighting,
  optionChain,
  handlePercentageClick,
  handleDeltaClick,
  handleIVClick,
  handleReversalClick,
  theme,
  sltp,
  oiRatio, // Added oiRatio parameter
  oiChngRatio, // Added oiChngRatio parameter
  ceReversalValue, // Added ceReversalValue parameter
  peReversalValue // Added peReversalValue parameter
) {
  if (!strikeData) return null;

  const ceData = strikeData?.ce || {};
  const peData = strikeData?.pe || {};
  const oc = optionChain || {};
  const reversal = oc?.oc || {};

  return (
    <React.Fragment key={`strike-${strike}`}>
      {/* CE Data Cells */}
      <IVDataCell
        data={ceData}
        valueKey="iv"
        strike={strike}
        isCe={true}
        handleIVClick={handleIVClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        oc={oc}
        sltp={sltp}
      />

      <DeltaDataCell
        data={ceData}
        valueKey="oichng"
        strike={strike}
        isCe={true}
        handleDeltaClick={handleDeltaClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        sltp={sltp}
      />

      <DataCell
        data={ceData}
        valueKey="OI"
        isCe={true}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        oc={oc}
        sltp={sltp}
      />

      <DataCell
        data={ceData}
        valueKey="vol"
        isCe={true}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        oc={oc}
        sltp={sltp}
      />

      <LTPCell
        data={ceData}
        reversal={reversal}
        strike={strike}
        theme={theme}
        type="ce"
        sltp={sltp}
        isItmHighlighting={isItmHighlighting}
      />

      <ReversalCell
        value={ceReversalValue}
        title="Click to copy CE reversal value"
        strike={strike}
        type="ce"
        sltp={sltp}
        isItmHighlighting={isItmHighlighting}
      />

      <StrikeCell
        strike={strike}
        oiRatio={oiRatio}
        oiChngRatio={oiChngRatio}
        theme={theme}
        handleReversalClick={handleReversalClick}
        oc={oc}
      />

      <ReversalCell
        value={peReversalValue}
        title="Click to copy PE reversal value"
        strike={strike}
        type="pe"
        sltp={sltp}
        isItmHighlighting={isItmHighlighting}
      />

      <LTPCell
        data={peData}
        reversal={reversal}
        strike={strike}
        theme={theme}
        type="pe"
        sltp={sltp}
        isItmHighlighting={isItmHighlighting}
      />

      <DataCell
        data={peData}
        valueKey="vol"
        isCe={false}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        oc={oc}
        sltp={sltp}
      />

      <DataCell
        data={peData}
        valueKey="OI"
        isCe={false}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        oc={oc}
        sltp={sltp}
      />

      <DeltaDataCell
        data={peData}
        valueKey="oichng"
        strike={strike}
        isCe={false}
        handleDeltaClick={handleDeltaClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        sltp={sltp}
      />

      <IVDataCell
        data={peData}
        valueKey="iv"
        strike={strike}
        isCe={false}
        handleIVClick={handleIVClick}
        isHighlighting={isHighlighting}
        isItmHighlighting={isItmHighlighting}
        oc={oc}
        sltp={sltp}
      />
    </React.Fragment>
  );
}

// Optimized findStrikes function with better performance
export function findStrikes(options, atmPrice) {
  if (!options || typeof options !== "object" || !atmPrice) {
    return {
      nearestStrike: null,
      otmStrikes: [],
      itmStrikes: [],
    };
  }

  const strikes = Object.keys(options);

  if (strikes.length === 0) {
    return {
      nearestStrike: null,
      otmStrikes: [],
      itmStrikes: [],
    };
  }

  // Use binary search approach for better performance with large datasets
  const numericStrikes = strikes
    .map((s) => parseFloat(s))
    .filter((s) => !isNaN(s))
    .sort((a, b) => a - b);

  const nearestStrike = atmPrice;

  const otmStrikes = numericStrikes.filter((s) => s >= atmPrice);
  const itmStrikes = numericStrikes.filter((s) => s < atmPrice);

  return {
    nearestStrike,
    otmStrikes: otmStrikes.map((s) => s.toString()),
    itmStrikes: itmStrikes.map((s) => s.toString()),
  };
}

// Export utility functions for external use
export {
  getBackgroundClass,
  getHighlightClass,
  getHighlightTextClass,
  getPCRClass,
  copyToClipboard,
};
