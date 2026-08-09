import React, { createContext, useContext, useState, useMemo } from "react";

export type ScaleUnit = "thousands" | "millions" | "billions";

export const getScaleMultiplier = (unit: ScaleUnit): number => {
  switch (unit) {
    case "thousands":
      return 1000;
    case "millions":
      return 1000000;
    case "billions":
      return 1000000000;
  }
};

export const getScaleSuffix = (unit: ScaleUnit): string => {
  switch (unit) {
    case "thousands":
      return "K";
    case "millions":
      return "M";
    case "billions":
      return "B";
  }
};

export interface MetricEvaluation {
  id: string;
  title: string;
  valueDisplay: string;
  subLabel: string;
  status: "Healthy" | "Moderate" | "Risk";
  score: number; // 0 to 20
  whyItMatters: string;
  ruleOfThumb: string;
}

interface BalanceSheetContextType {
  scaleUnit: ScaleUnit;
  setScaleUnit: (unit: ScaleUnit) => void;
  cash: number;
  setCash: (v: number) => void;
  totalDebt: number;
  setTotalDebt: (v: number) => void;
  currentAssets: number;
  setCurrentAssets: (v: number) => void;
  currentLiabilities: number;
  setCurrentLiabilities: (v: number) => void;
  totalEquity: number;
  setTotalEquity: (v: number) => void;
  retainedEarnings: number;
  setRetainedEarnings: (v: number) => void;
  goodwillAndIntangibles: number;
  setGoodwillAndIntangibles: (v: number) => void;
  totalAssets: number;
  setTotalAssets: (v: number) => void;
  monthlyOpEx: number;
  setMonthlyOpEx: (v: number) => void;

  // Computed metrics
  overallHealthScore: number; // 0 to 100
  healthRating: {
    label: string;
    color: string;
    description: string;
  };
  metrics: MetricEvaluation[];
}

const BalanceSheetContext = createContext<BalanceSheetContextType | undefined>(
  undefined,
);

export const BalanceSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scaleUnit, setScaleUnit] = useState<ScaleUnit>("thousands");
  const [cash, setCash] = useState<number>(65); // in scale units (e.g. 65K)
  const [totalDebt, setTotalDebt] = useState<number>(15);
  const [currentAssets, setCurrentAssets] = useState<number>(95);
  const [currentLiabilities, setCurrentLiabilities] = useState<number>(35);
  const [totalEquity, setTotalEquity] = useState<number>(110);
  const [retainedEarnings, setRetainedEarnings] = useState<number>(75);
  const [goodwillAndIntangibles, setGoodwillAndIntangibles] =
    useState<number>(8);
  const [totalAssets, setTotalAssets] = useState<number>(160);
  const [monthlyOpEx, setMonthlyOpEx] = useState<number>(5);

  const multiplier = getScaleMultiplier(scaleUnit);
  const suffix = getScaleSuffix(scaleUnit);

  // Effective dollar amounts
  const effCash = cash * multiplier;
  const effTotalDebt = totalDebt * multiplier;
  const effCurrentAssets = currentAssets * multiplier;
  const effCurrentLiabilities = currentLiabilities * multiplier;
  const effTotalEquity = totalEquity * multiplier;
  const effRetainedEarnings = retainedEarnings * multiplier;
  const effGoodwill = goodwillAndIntangibles * multiplier;
  const effTotalAssets = totalAssets * multiplier;
  const effMonthlyOpEx = monthlyOpEx * multiplier;

  // Evaluate 5 Key Metrics
  const metrics = useMemo<MetricEvaluation[]>(() => {
    const evals: MetricEvaluation[] = [];

    // 1. Cash Cushion & Runway
    const runwayMonths = effMonthlyOpEx > 0 ? effCash / effMonthlyOpEx : 99;
    const cashRatio =
      effCurrentLiabilities > 0 ? effCash / effCurrentLiabilities : 0;
    let cashStatus: "Healthy" | "Moderate" | "Risk" = "Healthy";
    let cashScore = 20;

    if (runwayMonths >= 6 && cashRatio >= 0.5) {
      cashStatus = "Healthy";
      cashScore = 20;
    } else if (runwayMonths >= 3 && cashRatio >= 0.2) {
      cashStatus = "Moderate";
      cashScore = 12;
    } else {
      cashStatus = "Risk";
      cashScore = 4;
    }

    evals.push({
      id: "cash_cushion",
      title: "1. Cash Cushion & Runway",
      valueDisplay: `${runwayMonths < 90 ? `${runwayMonths.toFixed(1)} Mos` : "> 90 Mos"} (${(cashRatio * 100).toFixed(0)}% Cash Ratio)`,
      subLabel: `Cash: $${cash}${suffix} | Monthly OpEx: $${monthlyOpEx}${suffix}`,
      status: cashStatus,
      score: cashScore,
      whyItMatters:
        "Cash is the ultimate solvency lifeline. A business can be profitable on paper, but running out of liquid cash forces immediate operational shutdown or emergency dilution.",
      ruleOfThumb:
        "Maintain at least 3–6 months of cash runway and a Cash Ratio (Cash / Current Liabilities) ≥ 0.20x to 0.50x.",
    });

    // 2. Debt Burden (Debt-to-Equity)
    const deRatio = effTotalEquity > 0 ? effTotalDebt / effTotalEquity : 99;
    let deStatus: "Healthy" | "Moderate" | "Risk" = "Healthy";
    let deScore = 20;

    if (deRatio <= 1.0) {
      deStatus = "Healthy";
      deScore = 20;
    } else if (deRatio <= 2.0) {
      deStatus = "Moderate";
      deScore = 12;
    } else {
      deStatus = "Risk";
      deScore = 4;
    }

    evals.push({
      id: "debt_burden",
      title: "2. Debt Burden (Debt-to-Equity)",
      valueDisplay: `${deRatio.toFixed(2)}x D/E Ratio`,
      subLabel: `Total Debt: $${totalDebt}${suffix} | Equity: $${totalEquity}${suffix}`,
      status: deStatus,
      score: deScore,
      whyItMatters:
        "High debt amplifies interest rate risk and default potential during recessions. Excessive leverage strips management of strategic flexibility.",
      ruleOfThumb:
        "Keep Debt-to-Equity (D/E) below 1.5x (and below 1.0x for conservative financial fortress strength).",
    });

    // 3. Short-Term Solvency (Quick Ratio & Working Capital)
    const nwc = effCurrentAssets - effCurrentLiabilities;
    const quickRatio =
      effCurrentLiabilities > 0 ? effCash / effCurrentLiabilities : 0;
    let solvencyStatus: "Healthy" | "Moderate" | "Risk" = "Healthy";
    let solvencyScore = 20;

    if (quickRatio >= 1.0 && nwc > 0) {
      solvencyStatus = "Healthy";
      solvencyScore = 20;
    } else if (quickRatio >= 0.7 && nwc >= 0) {
      solvencyStatus = "Moderate";
      solvencyScore = 12;
    } else {
      solvencyStatus = "Risk";
      solvencyScore = 4;
    }

    evals.push({
      id: "short_term_solvency",
      title: "3. Short-Term Solvency & Working Capital",
      valueDisplay: `Quick Ratio: ${quickRatio.toFixed(2)}x | NWC: $${(nwc / multiplier).toFixed(1)}${suffix}`,
      subLabel: `Current Assets: $${currentAssets}${suffix} | Current Liab: $${currentLiabilities}${suffix}`,
      status: solvencyStatus,
      score: solvencyScore,
      whyItMatters:
        "Ensures short-term obligations and supplier invoices due within 12 months can be settled smoothly without liquidating inventory at distress prices.",
      ruleOfThumb:
        "Quick Ratio ≥ 1.0x and positive Net Working Capital (NWC > 0).",
    });

    // 4. Cumulative Health (Retained Earnings % Assets)
    const reAssetRatio =
      effTotalAssets > 0 ? (effRetainedEarnings / effTotalAssets) * 100 : 0;
    let reStatus: "Healthy" | "Moderate" | "Risk" = "Healthy";
    let reScore = 20;

    if (reAssetRatio >= 20 && effRetainedEarnings > 0) {
      reStatus = "Healthy";
      reScore = 20;
    } else if (effRetainedEarnings >= 0) {
      reStatus = "Moderate";
      reScore = 12;
    } else {
      reStatus = "Risk";
      reScore = 4;
    }

    evals.push({
      id: "retained_earnings",
      title: "4. Retained Earnings & Track Record",
      valueDisplay: `${reAssetRatio.toFixed(1)}% of Assets ($${retainedEarnings}${suffix})`,
      subLabel: `Retained Earnings: $${retainedEarnings}${suffix} | Total Assets: $${totalAssets}${suffix}`,
      status: reStatus,
      score: reScore,
      whyItMatters:
        "Positive Retained Earnings reflect a historical track record of profitable reinvestment. An accumulated deficit (negative value) signals chronic past losses.",
      ruleOfThumb:
        "Retained Earnings should be positive and account for > 20% of total assets.",
    });

    // 5. Asset Quality (Goodwill & Intangibles Risk)
    const intangiblesPct =
      effTotalAssets > 0 ? (effGoodwill / effTotalAssets) * 100 : 0;
    let assetStatus: "Healthy" | "Moderate" | "Risk" = "Healthy";
    let assetScore = 20;

    if (intangiblesPct <= 20) {
      assetStatus = "Healthy";
      assetScore = 20;
    } else if (intangiblesPct <= 40) {
      assetStatus = "Moderate";
      assetScore = 12;
    } else {
      assetStatus = "Risk";
      assetScore = 4;
    }

    evals.push({
      id: "asset_quality",
      title: "5. Asset Quality (Goodwill & Intangibles)",
      valueDisplay: `${intangiblesPct.toFixed(1)}% Intangible ($${goodwillAndIntangibles}${suffix})`,
      subLabel: `Hard Tangible Assets: ${(100 - intangiblesPct).toFixed(1)}% ($${(totalAssets - goodwillAndIntangibles).toFixed(1)}${suffix})`,
      status: assetStatus,
      score: assetScore,
      whyItMatters:
        "High Goodwill and Intangibles from past M&A acquisitions carry heavy non-cash impairment write-down risks that can erase book equity overnight.",
      ruleOfThumb:
        "Keep Goodwill & Intangibles below 20–30% of total assets to ensure book value is backed by tangible assets.",
    });

    return evals;
  }, [
    effCash,
    effMonthlyOpEx,
    effCurrentLiabilities,
    effTotalDebt,
    effTotalEquity,
    effCurrentAssets,
    effTotalAssets,
    effRetainedEarnings,
    effGoodwill,
    cash,
    monthlyOpEx,
    currentLiabilities,
    totalDebt,
    totalEquity,
    currentAssets,
    totalAssets,
    retainedEarnings,
    goodwillAndIntangibles,
    suffix,
    multiplier,
  ]);

  const overallHealthScore = useMemo(() => {
    return metrics.reduce((acc, m) => acc + m.score, 0);
  }, [metrics]);

  const healthRating = useMemo(() => {
    if (overallHealthScore >= 80) {
      return {
        label: "Fortress Balance Sheet",
        color: "#2e7d32",
        description:
          "Exceptional financial strength, minimal leverage, deep cash buffers, and low distress risk.",
      };
    } else if (overallHealthScore >= 60) {
      return {
        label: "Stable & Healthy",
        color: "#0284c7",
        description:
          "Solid solvency and liquidity balance with manageable operational leverage.",
      };
    } else if (overallHealthScore >= 40) {
      return {
        label: "Moderate Risk / Watchlist",
        color: "#d97706",
        description:
          "Vulnerable to economic shocks or liquidity tightness. Monitor debt service closely.",
      };
    } else {
      return {
        label: "High Distress Risk",
        color: "#d32f2f",
        description:
          "Severe financial stress, high leverage or low cash runway. High restructuring / default risk.",
      };
    }
  }, [overallHealthScore]);

  return (
    <BalanceSheetContext.Provider
      value={{
        scaleUnit,
        setScaleUnit,
        cash,
        setCash,
        totalDebt,
        setTotalDebt,
        currentAssets,
        setCurrentAssets,
        currentLiabilities,
        setCurrentLiabilities,
        totalEquity,
        setTotalEquity,
        retainedEarnings,
        setRetainedEarnings,
        goodwillAndIntangibles,
        setGoodwillAndIntangibles,
        totalAssets,
        setTotalAssets,
        monthlyOpEx,
        setMonthlyOpEx,
        overallHealthScore,
        healthRating,
        metrics,
      }}
    >
      {children}
    </BalanceSheetContext.Provider>
  );
};

export const useBalanceSheet = () => {
  const context = useContext(BalanceSheetContext);
  if (!context) {
    throw new Error(
      "useBalanceSheet must be used within a BalanceSheetProvider",
    );
  }
  return context;
};
