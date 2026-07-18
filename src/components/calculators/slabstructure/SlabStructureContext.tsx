import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SlabConfig {
  tier1Max: number;       // ₹100,000 (1 Lakh)
  tier1Rate: number;      // 0.18%
  tier1MinGst: number;    // ₹45
  tier1MaxGst: number;    // ₹180
  tier2Max: number;       // ₹1,000,000 (10 Lakh)
  tier2BaseGst: number;   // ₹180
  tier2Rate: number;      // 0.09%
  tier3BaseGst: number;   // ₹990
  tier3Rate: number;      // 0.018%
  maxGstCap: number;      // ₹60,000 (optional cap, 0 if disabled)
}

export interface CalculationResult {
  gst: number;
  effectiveRate: number;
  marginalRate: number;
  tierName: string;
  breakdown: string;
}

export interface SlabDataPoint {
  amount: number;
  formattedAmount: string;
  gst: number;
  effectiveRate: number;
}

interface SlabStructureContextType {
  config: SlabConfig;
  updateConfig: (updates: Partial<SlabConfig>) => void;
  selectedAmount: number;
  setSelectedAmount: (amount: number) => void;
  chartMinAmount: number;
  setChartMinAmount: (min: number) => void;
  chartMaxAmount: number;
  setChartMaxAmount: (max: number) => void;
  calculateForAmount: (amount: number) => CalculationResult;
  chartData: SlabDataPoint[];
}

export const DEFAULT_CONFIG: SlabConfig = {
  tier1Max: 100000,       // ₹1 Lakh
  tier1Rate: 0.18,        // 0.18%
  tier1MinGst: 45,        // ₹45
  tier1MaxGst: 180,       // ₹180
  tier2Max: 1000000,      // ₹10 Lakh
  tier2BaseGst: 180,      // ₹180
  tier2Rate: 0.09,        // 0.09%
  tier3BaseGst: 990,      // ₹990
  tier3Rate: 0.018,       // 0.018%
  maxGstCap: 60000,       // ₹60,000 max cap
};

export const formatINR = (val: number): string => {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  return `₹${Math.round(val).toLocaleString("en-IN")}`;
};

export const calculateGST = (amount: number, config: SlabConfig): CalculationResult => {
  let gst = 0;
  let marginalRate = 0;
  let tierName = "";
  let breakdown = "";

  if (amount <= config.tier1Max) {
    tierName = `Tier 1: Up to ₹${(config.tier1Max / 100000).toFixed(1)} Lakh`;
    marginalRate = config.tier1Rate;
    const calculated = (amount * config.tier1Rate) / 100;

    // Apply min/max GST bounds
    gst = Math.min(Math.max(calculated, config.tier1MinGst), config.tier1MaxGst);

    if (calculated < config.tier1MinGst) {
      breakdown = `Calculated 0.18% of ₹${amount.toLocaleString("en-IN")} = ₹${calculated.toFixed(2)}, adjusted to Minimum GST threshold of ₹${config.tier1MinGst}.`;
    } else if (calculated > config.tier1MaxGst) {
      breakdown = `Calculated 0.18% of ₹${amount.toLocaleString("en-IN")} = ₹${calculated.toFixed(2)}, capped at Tier 1 Max GST of ₹${config.tier1MaxGst}.`;
    } else {
      breakdown = `Calculated 0.18% of ₹${amount.toLocaleString("en-IN")} = ₹${gst.toFixed(2)}.`;
    }
  } else if (amount <= config.tier2Max) {
    tierName = `Tier 2: ₹${(config.tier1Max / 100000).toFixed(1)} Lakh to ₹${(config.tier2Max / 100000).toFixed(1)} Lakh`;
    marginalRate = config.tier2Rate;
    const excess = amount - config.tier1Max;
    const excessTax = (excess * config.tier2Rate) / 100;
    gst = config.tier2BaseGst + excessTax;
    breakdown = `Base GST ₹${config.tier2BaseGst} + ${config.tier2Rate}% of amount exceeding ₹1 Lakh (₹${excess.toLocaleString("en-IN")}) = ₹${config.tier2BaseGst} + ₹${excessTax.toFixed(2)} = ₹${gst.toFixed(2)}.`;
  } else {
    tierName = `Tier 3: Above ₹${(config.tier2Max / 100000).toFixed(1)} Lakh`;
    marginalRate = config.tier3Rate;
    const excess = amount - config.tier2Max;
    const excessTax = (excess * config.tier3Rate) / 100;
    gst = config.tier3BaseGst + excessTax;

    if (config.maxGstCap > 0 && gst > config.maxGstCap) {
      gst = config.maxGstCap;
      breakdown = `Base GST ₹${config.tier3BaseGst} + ${config.tier3Rate}% of amount exceeding ₹10 Lakh (₹${excess.toLocaleString("en-IN")}) capped at Maximum GST Cap of ₹${config.maxGstCap.toLocaleString("en-IN")}.`;
    } else {
      breakdown = `Base GST ₹${config.tier3BaseGst} + ${config.tier3Rate}% of amount exceeding ₹10 Lakh (₹${excess.toLocaleString("en-IN")}) = ₹${config.tier3BaseGst} + ₹${excessTax.toFixed(2)} = ₹${gst.toFixed(2)}.`;
    }
  }

  const effectiveRate = amount > 0 ? (gst / amount) * 100 : 0;
  return { gst, effectiveRate, marginalRate, tierName, breakdown };
};

const SlabStructureContext = createContext<SlabStructureContextType | undefined>(undefined);

export const SlabStructureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SlabConfig>(DEFAULT_CONFIG);
  const [selectedAmount, setSelectedAmount] = useState<number>(500000); // ₹5 Lakh default
  const [chartMinAmount, setChartMinAmount] = useState<number>(100000);  // ₹1 Lakh
  const [chartMaxAmount, setChartMaxAmount] = useState<number>(2000000); // ₹20 Lakh

  const updateConfig = (updates: Partial<SlabConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const calculateForAmount = (amount: number): CalculationResult => {
    return calculateGST(amount, config);
  };

  // Generate smooth data points for chart between min and max amount
  const chartData: SlabDataPoint[] = React.useMemo(() => {
    const points: SlabDataPoint[] = [];
    const steps = 100;
    const min = Math.max(0, chartMinAmount);
    const max = Math.max(min + 10000, chartMaxAmount);
    const stepSize = (max - min) / steps;

    // Always include exact threshold points (₹1L, ₹10L) if they fall in the range
    const thresholdSet = new Set<number>();
    for (let i = 0; i <= steps; i++) {
      thresholdSet.add(Math.round(min + i * stepSize));
    }
    if (config.tier1Max >= min && config.tier1Max <= max) thresholdSet.add(config.tier1Max);
    if (config.tier2Max >= min && config.tier2Max <= max) thresholdSet.add(config.tier2Max);

    const sortedAmounts = Array.from(thresholdSet).sort((a, b) => a - b);

    sortedAmounts.forEach((amt) => {
      const result = calculateGST(amt, config);
      points.push({
        amount: amt,
        formattedAmount: formatINR(amt),
        gst: parseFloat(result.gst.toFixed(2)),
        effectiveRate: parseFloat(result.effectiveRate.toFixed(4)),
      });
    });

    return points;
  }, [config, chartMinAmount, chartMaxAmount]);

  return (
    <SlabStructureContext.Provider
      value={{
        config,
        updateConfig,
        selectedAmount,
        setSelectedAmount,
        chartMinAmount,
        setChartMinAmount,
        chartMaxAmount,
        setChartMaxAmount,
        calculateForAmount,
        chartData,
      }}
    >
      {children}
    </SlabStructureContext.Provider>
  );
};

export const useSlabStructure = () => {
  const context = useContext(SlabStructureContext);
  if (!context) {
    throw new Error("useSlabStructure must be used within a SlabStructureProvider");
  }
  return context;
};
