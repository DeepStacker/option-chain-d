// src/utils/optionChainTable/OptionTableUtils.js
import React, { memo, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { formatNumber, toFixed } from "../utils";

// Memoized utility functions for better performance
const getBackgroundClass = memo((oc, strike, type) => {
  if (!oc?.sltp || !strike) return "";
  return type === "ce"
    ? oc.sltp > strike
      ? "bg-itm-highlight"
      : ""
    : oc.sltp < strike
    ? "bg-itm-highlight"
    : "";
});

const getHighlightClass = (abs, value, isHighlighting, isCe) => {
  if (isNaN(value) || !isHighlighting || value === undefined || value === null)
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
  return abs <= 0 ? "text-red-500" : "text-green-700";
};

const getPCRClass = (pcr) => {
  if (pcr === undefined || pcr === null || isNaN(pcr)) return "";
  return pcr > 1.2 ? "text-green-700" : pcr < 0.8 ? "text-red-500" : "";
};

// Optimized clipboard copy function with error handling
const copyToClipboard = async (text, showAlert = false) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text.toString());
    } else {
      // Fallback for older browsers or non-secure contexts
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
      // You can replace this with a toast notification for better UX
      console.log(`Copied: ${text}`);
    }
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

// Memoized DataCell component with enhanced performance
const DataCell = memo(
  ({
    data,
    valueKey,
    isCe,
    strike,
    handlePercentageClick,
    isHighlighting,
    oc,
  }) => {
    const cellValue = data?.[valueKey];
    const maxValue = data?.[`${valueKey}_max_value`];
    const percentageValue = data?.[`${valueKey}_percentage`];

    const handleClick = useCallback(() => {
      if (handlePercentageClick) {
        handlePercentageClick(isCe, strike, oc);
      }
    }, [handlePercentageClick, isCe, strike, oc]);

    const highlightClass = useMemo(
      () => getHighlightClass(cellValue, maxValue, isHighlighting, isCe),
      [cellValue, maxValue, isHighlighting, isCe]
    );

    return (
      <td
        onClick={handleClick}
        className={`${highlightClass} cursor-pointer hover:opacity-80 transition-opacity duration-150 p-0 text-center`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
      >
        <div className="font-medium">{formatNumber(percentageValue)}%</div>
        <small className="text-xs opacity-75">{formatNumber(cellValue)}</small>
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
  oc: PropTypes.object,
};

DataCell.displayName = "DataCell";

// Memoized DeltaDataCell component
const DeltaDataCell = memo(
  ({ data, valueKey, strike, isCe, handleDeltaClick, isHighlighting }) => {
    const cellValue = data?.[valueKey];
    const maxValue = data?.[`${valueKey}_max_value`];
    const percentageValue = data?.[`${valueKey}_percentage`];

    const handleClick = useCallback(() => {
      if (handleDeltaClick) {
        handleDeltaClick(strike);
      }
    }, [handleDeltaClick, strike]);

    const highlightClass = useMemo(
      () => getHighlightClass(cellValue, maxValue, isHighlighting, isCe),
      [cellValue, maxValue, isHighlighting, isCe]
    );

    return (
      <td
        onClick={handleClick}
        className={`${highlightClass} cursor-pointer hover:opacity-80 transition-opacity duration-150 p-0 text-center`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
      >
        <div className="font-medium">{formatNumber(percentageValue)}%</div>
        <small className="text-xs opacity-75">{formatNumber(cellValue)}</small>
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
};

DeltaDataCell.displayName = "DeltaDataCell";

// Memoized IVDataCell component
const IVDataCell = memo(
  ({ data, valueKey, strike, isCe, handleIVClick, isHighlighting, oc }) => {
    const cellValue = data?.[valueKey];
    const deltaValue = data?.optgeeks?.delta;

    const handleClick = useCallback(() => {
      if (handleIVClick) {
        handleIVClick(isCe, strike, oc);
      }
    }, [handleIVClick, isCe, strike, oc]);

    const highlightClass = useMemo(
      () => getHighlightClass(cellValue, cellValue, isHighlighting, isCe),
      [cellValue, isHighlighting, isCe]
    );

    return (
      <td
        onClick={handleClick}
        className={`${highlightClass} cursor-pointer hover:opacity-80 transition-opacity duration-150 p-0 text-center`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
      >
        <div className="font-medium">{formatNumber(cellValue)}</div>
        <small className="text-xs opacity-75">{formatNumber(deltaValue)}</small>
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
  oc: PropTypes.object,
};

IVDataCell.displayName = "IVDataCell";

// Memoized LTP Cell component
const LTPCell = memo(({ data, reversal, strike, theme, type }) => {
  const ltp = data?.ltp;
  const pChng = data?.p_chng;
  const tvKey = type === "ce" ? "ce_tv" : "pe_tv";
  const tvValue = reversal?.[strike]?.reversal?.[tvKey];

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
  const themeTextClass = theme === "dark" ? "text-white" : "text-black";

  return (
    <td className="p-0 text-center">
      <div className="font-medium">{formatNumber(ltp)}</div>
      <small
        className={`${pChngClass} text-xs flex items-center justify-center gap-0`}
      >
        <span>{formatNumber(pChng)}</span>
        <span className={themeTextClass}>(</span>
        <span className={tvDiffClass}>{tvDifference}</span>
        <span className={themeTextClass}>)</span>
      </small>
    </td>
  );
});

LTPCell.propTypes = {
  data: PropTypes.object.isRequired,
  reversal: PropTypes.object,
  strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  theme: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["ce", "pe"]).isRequired,
};

LTPCell.displayName = "LTPCell";

// Memoized Reversal Cell component
const ReversalCell = memo(({ value, title, showAlert = false }) => {
  const handleClick = useCallback(async () => {
    await copyToClipboard(value || 0, showAlert);
  }, [value, showAlert]);

  return (
    <td
      onClick={handleClick}
      className="cursor-pointer hover:bg-opacity-80 transition-colors duration-150 p-0 text-center font-medium"
      title={title}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {value || 0}
    </td>
  );
});

ReversalCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  showAlert: PropTypes.bool,
};

ReversalCell.displayName = "ReversalCell";

// Memoized Strike Cell component
const StrikeCell = memo(
  ({ strike, oiRatio, oiChngRatio, theme, handleReversalClick, oc }) => {
    const themeClass = theme === "dark" ? "bg-gray-700" : "bg-gray-300";
    const strikeCellClass = `font-bold border-spacing-y-1 border border-gray-950 ${themeClass}`;

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

    return (
      <td
        className={`${strikeCellClass} cursor-pointer hover:opacity-90 transition-opacity duration-150 p-0 text-center`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
      >
        <div className="font-bold text-lg">{strike}</div>
        <div className="text-xs flex items-center justify-center gap-0">
          <small className={`font-normal ${oiRatioClass}`}>
            {toFixed(oiRatio)}
          </small>
          <span>/</span>
          <small className={`font-normal ${oiChngRatioClass}`}>
            {toFixed(oiChngRatio)}
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

// Main renderStrikeRow function with optimizations
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
  // Early return if no data
  if (!strikeData) {
    return null;
  }

  const { ce: ceData = {}, pe: peData = {} } = strikeData;
  const oc = optionChain || {};
  const reversal = oc?.oc || {};

  // Memoized calculations
  const strikeKeys = useMemo(() => Object.keys(reversal), [reversal]);
  const strikeDiff = useMemo(() => {
    if (strikeKeys.length >= 2) {
      return strikeKeys[1] - strikeKeys[0];
    }
    return 0;
  }, [strikeKeys]);

  // Precompute ratios with safe division
  const oiRatio = useMemo(() => {
    if (peData?.OI && ceData?.OI && ceData.OI !== 0) {
      return peData.OI / ceData.OI;
    }
    return 0;
  }, [peData?.OI, ceData?.OI]);

  const oiChngRatio = useMemo(() => {
    if (peData?.oichng && ceData?.oichng && ceData.oichng !== 0) {
      return peData.oichng / ceData.oichng;
    }
    return 0;
  }, [peData?.oichng, ceData?.oichng]);

  // Memoized reversal values
  const ceReversalValue = useMemo(() => {
    const baseValue = strikeData?.reversal || 0;
    return baseValue + strikeDiff;
  }, [strikeData?.reversal, strikeDiff]);

  const peReversalValue = useMemo(() => {
    return strikeData?.reversal || 0;
  }, [strikeData?.reversal]);

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
        oc={oc}
      />

      <DeltaDataCell
        data={ceData}
        valueKey="oichng"
        strike={strike}
        isCe={true}
        handleDeltaClick={handleDeltaClick}
        isHighlighting={isHighlighting}
      />

      <DataCell
        data={ceData}
        valueKey="OI"
        isCe={true}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        oc={oc}
      />

      <DataCell
        data={ceData}
        valueKey="vol"
        isCe={true}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        oc={oc}
      />

      {/* CE LTP Cell */}
      <LTPCell
        data={ceData}
        reversal={reversal}
        strike={strike}
        theme={theme}
        type="ce"
      />

      {/* CE Reversal Cell */}
      <ReversalCell
        value={ceReversalValue}
        title="Click to copy CE reversal value"
      />

      {/* Strike Price Cell */}
      <StrikeCell
        strike={strike}
        oiRatio={oiRatio}
        oiChngRatio={oiChngRatio}
        theme={theme}
        handleReversalClick={handleReversalClick}
        oc={oc}
      />

      {/* PE Reversal Cell */}
      <ReversalCell
        value={peReversalValue}
        title="Click to copy PE reversal value"
      />

      {/* PE LTP Cell */}
      <LTPCell
        data={peData}
        reversal={reversal}
        strike={strike}
        theme={theme}
        type="pe"
      />

      {/* PE Data Cells */}
      <DataCell
        data={peData}
        valueKey="vol"
        isCe={false}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        oc={oc}
      />

      <DataCell
        data={peData}
        valueKey="OI"
        isCe={false}
        strike={strike}
        handlePercentageClick={handlePercentageClick}
        isHighlighting={isHighlighting}
        oc={oc}
      />

      <DeltaDataCell
        data={peData}
        valueKey="oichng"
        strike={strike}
        isCe={false}
        handleDeltaClick={handleDeltaClick}
        isHighlighting={isHighlighting}
      />

      <IVDataCell
        data={peData}
        valueKey="iv"
        strike={strike}
        isCe={false}
        handleIVClick={handleIVClick}
        isHighlighting={isHighlighting}
        oc={oc}
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

  // Convert strikes to numbers for proper comparison and sort them
  const numericStrikes = strikes
    .map((s) => parseFloat(s))
    .filter((s) => !isNaN(s))
    .sort((a, b) => a - b);

  const nearestStrike = atmPrice;

  // Use binary search approach for better performance with large datasets
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
