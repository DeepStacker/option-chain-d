// components/SupportResistanceLines.jsx
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { LineStyle } from "lightweight-charts";

const computeLevels = (oc, price, isCommodity) => {
  // console.log("🔢 Computing levels with:", { oc: !!oc, price, isCommodity });
  
  if (!oc || typeof oc !== "object") {
    return {
      support_1: null,
      support_2: null,
      support_1_1: null,
      support_2_1: null,
      resistance_1: null,
      resistance_2: null,
      resistance_1_1: null,
      resistance_2_1: null,
    };
  }

  const strikes = Object.keys(oc)
    .filter((k) => /^\d+$/.test(k))
    .map(Number)
    .sort((a, b) => a - b);

  if (strikes.length === 0) {
    return {
      support_1: null,
      support_2: null,
      support_1_1: null,
      support_2_1: null,
      resistance_1: null,
      resistance_2: null,
      resistance_1_1: null,
      resistance_2_1: null,
    };
  }

  const below = strikes.filter((s) => s <= price);
  const above = strikes.filter((s) => s > price);

  const pick = (levels, selector) => {
    if (!levels.length) return null;
    const idx = selector(levels);
    if (idx < 0 || idx >= levels.length) return null;
    const strikeKey = levels[idx];
    const strikeData = oc[strikeKey];
    return strikeData || null;
  };

  return {
    support_1: pick(below, (l) => l.length - 1)?.reversal,
    support_2: pick(below, (l) => l.length - 1)?.wkly_reversal,
    support_1_1: pick(below, (l) => l.length - 2)?.reversal,
    support_2_1: pick(below, (l) => l.length - 2)?.wkly_reversal,

    resistance_1: pick(above, (l) => 0)?.reversal,
    resistance_2: pick(above, (l) => 0)?.wkly_reversal,
    resistance_1_1: pick(above, (l) => 1)?.reversal,
    resistance_2_1: pick(above, (l) => 1)?.wkly_reversal,
  };
};

const SupportResistanceLines = ({ candleSeriesRef, daily, weekly }) => {
  const theme = useSelector((state) => state.theme.theme);
  const { connectionStatus } = useSelector((state) => state.chart);
  const { sid } = useSelector((state) => state.data);
  
  const optionsData = useSelector((state) => state.data?.data?.options?.data);
  const oc = optionsData?.oc;
  const price = optionsData?.sltp;
  const isCommodity = sid === "CRUDEOIL";

  const supportResistanceLinesRef = useRef(new Map());
  const lastSupportDataRef = useRef(null);

  // Theme colors
  const themeColors = useMemo(
    () => ({
      supportColor: theme === "dark" ? "#00b3ff" : "#1976d2",
      resistanceColor: theme === "dark" ? "#fbc02d" : "#f57c00",
    }),
    [theme]
  );

  // Compute support/resistance levels
  const supportResistanceLevels = useMemo(() => {
    if (!oc || !price) return null;
    return computeLevels(oc, price, isCommodity);
  }, [oc, price, isCommodity]);

  // Draw support/resistance lines
  const drawSupportResistanceLines = useCallback(
    (levels) => {
      if (!candleSeriesRef.current || !levels) {
        console.log("⚠️ Cannot draw lines: missing candleSeries or levels");
        return;
      }

      console.log("🎨 Drawing support/resistance lines");

      // Clear existing lines that should not be visible
      supportResistanceLinesRef.current.forEach((line, key) => {
        const isDailyLine = key.startsWith("support_1") || key.startsWith("resistance_1");
        const isWeeklyLine = key.startsWith("support_2") || key.startsWith("resistance_2");

        if ((isDailyLine && !daily) || (isWeeklyLine && !weekly)) {
          try {
            candleSeriesRef.current.removePriceLine(line);
            supportResistanceLinesRef.current.delete(key);
            console.log(`🧹 Removed line ${key}`);
          } catch (error) {
            console.warn(`❌ Error removing price line ${key}:`, error);
          }
        }
      });

      const lineConfigs = [];

      // Add daily lines if enabled
      if (daily) {
        const dailyLines = [
          { key: "support_1", title: "S1", color: themeColors.supportColor },
          { key: "support_1_1", title: "S1.1", color: themeColors.supportColor },
          { key: "resistance_1", title: "R1", color: themeColors.resistanceColor },
          { key: "resistance_1_1", title: "R1.1", color: themeColors.resistanceColor },
        ];
        lineConfigs.push(...dailyLines);
      }

      // Add weekly lines if enabled
      if (weekly) {
        const weeklyLines = [
          { key: "support_2", title: "S2", color: themeColors.supportColor },
          { key: "support_2_1", title: "S2.1", color: themeColors.supportColor },
          { key: "resistance_2", title: "R2", color: themeColors.resistanceColor },
          { key: "resistance_2_1", title: "R2.1", color: themeColors.resistanceColor },
        ];
        lineConfigs.push(...weeklyLines);
      }

      // Create lines
      let createdCount = 0;
      lineConfigs.forEach((config) => {
        const priceValue = levels[config.key];
        
        if (priceValue !== null && priceValue !== undefined && !isNaN(parseFloat(priceValue))) {
          try {
            const line = candleSeriesRef.current.createPriceLine({
              price: parseFloat(priceValue),
              color: config.color,
              lineWidth: 2,
              lineStyle: LineStyle.Dashed,
              axisLabelVisible: true,
              title: config.title,
            });
            
            supportResistanceLinesRef.current.set(config.key, line);
            createdCount++;
            // console.log(`✅ Created line ${config.title} at price ${priceValue}`);
          } catch (error) {
            console.error(`❌ Error creating price line for ${config.key}:`, error);
          }
        }
      });

      console.log(`🎨 Successfully created ${createdCount} support/resistance lines`);
    },
    [daily, weekly, themeColors.supportColor, themeColors.resistanceColor]
  );

  // Draw lines when levels or settings change
  useEffect(() => {
    if (supportResistanceLevels && candleSeriesRef.current && connectionStatus === "connected") {
      const currentLevelsString = JSON.stringify(supportResistanceLevels);
      const lastLevelsString = JSON.stringify(lastSupportDataRef.current);

      if (currentLevelsString !== lastLevelsString || lastSupportDataRef.current === null) {
        console.log("📈 Levels changed, updating lines");
        lastSupportDataRef.current = supportResistanceLevels;
        
        setTimeout(() => {
          drawSupportResistanceLines(supportResistanceLevels);
        }, 100);
      }
    }
  }, [supportResistanceLevels, daily, weekly, drawSupportResistanceLines, connectionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      supportResistanceLinesRef.current.clear();
    };
  }, []);

  return (
    <div>
      {supportResistanceLevels ? (
        <>
          <div>S1: {supportResistanceLevels.support_1}</div>
          <div>S2: {supportResistanceLevels.support_2}</div>
          <div>R1: {supportResistanceLevels.resistance_1}</div>
          <div>R2: {supportResistanceLevels.resistance_2}</div>
        </>
      ) : (
        <div>Loading support/resistance levels...</div>
      )}
    </div>
  );
};

export default SupportResistanceLines;
