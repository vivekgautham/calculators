import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type AmountScale = "thousands" | "millions" | "billions";

export const getScaleMultiplier = (scale: AmountScale): number => {
  switch (scale) {
    case "thousands":
      return 1000;
    case "millions":
      return 1000000;
    case "billions":
      return 1000000000;
  }
};

export const getScaleSuffix = (scale: AmountScale): string => {
  switch (scale) {
    case "thousands":
      return "K";
    case "millions":
      return "M";
    case "billions":
      return "B";
  }
};

export interface CashFlowPeriod {
  period: number;
  periodLabel: string;
  type: "Creation" | "Interest Payout" | "Maturity Redemption";
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  cumulativeCashFlow: number;
}

export interface FDPreset {
  name: string;
  amount: number; // scale units
  scale: AmountScale;
  years: number;
  annualRate: number;
  spreadX: number;
  spreadY: number;
  spreadZ: number;
  spreadA: number;
  spreadB: number;
  spreadU: number;
  spreadV: number;
}

export const PRESETS: FDPreset[] = [
  {
    name: "Standard Retail Offshore FD",
    amount: 10, // $10K
    scale: "thousands",
    years: 5,
    annualRate: 5.0,
    spreadX: 40, // 40 bps
    spreadY: 25, // 25 bps
    spreadZ: 15, // 15 bps
    spreadA: 15, // 15 bps
    spreadB: 10, // 10 bps
    spreadU: 35, // 35 bps
    spreadV: 15, // 15 bps
  },
  {
    name: "High-Fee Emerging Market FD",
    amount: 50, // $50K
    scale: "thousands",
    years: 3,
    annualRate: 8.5,
    spreadX: 100, // 100 bps
    spreadY: 75, // 75 bps
    spreadZ: 50, // 50 bps
    spreadA: 30, // 30 bps
    spreadB: 20, // 20 bps
    spreadU: 80, // 80 bps
    spreadV: 40, // 40 bps
  },
  {
    name: "Institutional Low-Spread FD",
    amount: 5, // $5M
    scale: "millions",
    years: 10,
    annualRate: 4.5,
    spreadX: 10, // 10 bps
    spreadY: 5, // 5 bps
    spreadZ: 5, // 5 bps
    spreadA: 5, // 5 bps
    spreadB: 2, // 2 bps
    spreadU: 10, // 10 bps
    spreadV: 5, // 5 bps
  },
];

interface ForeignCurrencyFDContextType {
  amountScale: AmountScale;
  setAmountScale: (scale: AmountScale) => void;
  initialGrossAmount: number;
  setInitialGrossAmount: (val: number) => void;
  years: number;
  setYears: (val: number) => void;
  annualRate: number;
  setAnnualRate: (val: number) => void;

  // Creation Fee Spreads (bps)
  spreadX: number;
  setSpreadX: (val: number) => void;
  spreadY: number;
  setSpreadY: (val: number) => void;
  spreadZ: number;
  setSpreadZ: (val: number) => void;

  // Interest Payout Servicing Spreads (bps)
  spreadA: number;
  setSpreadA: (val: number) => void;
  spreadB: number;
  setSpreadB: (val: number) => void;

  // Redemption Spreads (bps)
  spreadU: number;
  setSpreadU: (val: number) => void;
  spreadV: number;
  setSpreadV: (val: number) => void;

  loadPreset: (preset: FDPreset) => void;

  // Computed Outputs
  effectiveGrossAmount: number;
  totalCreationSpreadBps: number;
  creationFeesDollar: number;
  netInvestedDeposit: number;
  totalPayoutSpreadBps: number;
  grossHalfYearlyRatePct: number;
  netHalfYearlyRatePct: number;
  halfYearlyPayoutDollar: number;
  totalPayoutsCount: number;
  cumulativeInterestDollar: number;
  totalRedemptionSpreadBps: number;
  redemptionFeesDollar: number;
  netPrincipalReturned: number;
  totalCashReturned: number;
  netProfitLossDollar: number;
  netCagrPct: number;
  totalFeesDollar: number;
  feeDragPct: number;
  cashFlowTimeline: CashFlowPeriod[];
}

const ForeignCurrencyFDContext = createContext<
  ForeignCurrencyFDContextType | undefined
>(undefined);

export const ForeignCurrencyFDProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [amountScale, setAmountScale] = useState<AmountScale>("thousands");
  const [initialGrossAmount, setInitialGrossAmount] = useState<number>(10); // $10K default
  const [years, setYears] = useState<number>(5);
  const [annualRate, setAnnualRate] = useState<number>(5.0);

  // Creation spreads (bps)
  const [spreadX, setSpreadX] = useState<number>(40); // e.g. 40 bps FX conversion
  const [spreadY, setSpreadY] = useState<number>(25); // e.g. 25 bps Transfer fee
  const [spreadZ, setSpreadZ] = useState<number>(15); // e.g. 15 bps Setup fee

  // Interest payout spreads (bps)
  const [spreadA, setSpreadA] = useState<number>(15); // e.g. 15 bps Servicing
  const [spreadB, setSpreadB] = useState<number>(10); // e.g. 10 bps Transfer

  // Redemption spreads (bps)
  const [spreadU, setSpreadU] = useState<number>(35); // e.g. 35 bps Redemption FX
  const [spreadV, setSpreadV] = useState<number>(15); // e.g. 15 bps Repatriation

  const loadPreset = (preset: FDPreset) => {
    setAmountScale(preset.scale);
    setInitialGrossAmount(preset.amount);
    setYears(preset.years);
    setAnnualRate(preset.annualRate);
    setSpreadX(preset.spreadX);
    setSpreadY(preset.spreadY);
    setSpreadZ(preset.spreadZ);
    setSpreadA(preset.spreadA);
    setSpreadB(preset.spreadB);
    setSpreadU(preset.spreadU);
    setSpreadV(preset.spreadV);
  };

  const multiplier = getScaleMultiplier(amountScale);
  const effectiveGrossAmount = initialGrossAmount * multiplier;

  // 1. Creation Fees ($x, y, z$ bps)
  const totalCreationSpreadBps = useMemo(
    () => spreadX + spreadY + spreadZ,
    [spreadX, spreadY, spreadZ],
  );
  const creationFeesDollar = useMemo(
    () => effectiveGrossAmount * (totalCreationSpreadBps / 10000),
    [effectiveGrossAmount, totalCreationSpreadBps],
  );
  const netInvestedDeposit = useMemo(
    () => Math.max(0, effectiveGrossAmount - creationFeesDollar),
    [effectiveGrossAmount, creationFeesDollar],
  );

  // 2. Half-Yearly Payouts ($a, b$ bps)
  const totalPayoutSpreadBps = useMemo(
    () => spreadA + spreadB,
    [spreadA, spreadB],
  );
  const grossHalfYearlyRatePct = useMemo(() => annualRate / 2, [annualRate]);
  const netHalfYearlyRatePct = useMemo(
    () => Math.max(0, grossHalfYearlyRatePct - totalPayoutSpreadBps / 100),
    [grossHalfYearlyRatePct, totalPayoutSpreadBps],
  );
  const halfYearlyPayoutDollar = useMemo(
    () => netInvestedDeposit * (netHalfYearlyRatePct / 100),
    [netInvestedDeposit, netHalfYearlyRatePct],
  );
  const totalPayoutsCount = useMemo(() => years * 2, [years]);
  const cumulativeInterestDollar = useMemo(
    () => halfYearlyPayoutDollar * totalPayoutsCount,
    [halfYearlyPayoutDollar, totalPayoutsCount],
  );

  // 3. Maturity Redemption ($u, v$ bps)
  const totalRedemptionSpreadBps = useMemo(
    () => spreadU + spreadV,
    [spreadU, spreadV],
  );
  const redemptionFeesDollar = useMemo(
    () => netInvestedDeposit * (totalRedemptionSpreadBps / 10000),
    [netInvestedDeposit, totalRedemptionSpreadBps],
  );
  const netPrincipalReturned = useMemo(
    () => Math.max(0, netInvestedDeposit - redemptionFeesDollar),
    [netInvestedDeposit, redemptionFeesDollar],
  );

  // 4. Totals & Returns
  const totalCashReturned = useMemo(
    () => cumulativeInterestDollar + netPrincipalReturned,
    [cumulativeInterestDollar, netPrincipalReturned],
  );
  const netProfitLossDollar = useMemo(
    () => totalCashReturned - effectiveGrossAmount,
    [totalCashReturned, effectiveGrossAmount],
  );
  const netCagrPct = useMemo(() => {
    if (effectiveGrossAmount <= 0 || years <= 0) return 0;
    return (
      (Math.pow(totalCashReturned / effectiveGrossAmount, 1 / years) - 1) * 100
    );
  }, [totalCashReturned, effectiveGrossAmount, years]);

  const servicingFeesDollarTotal = useMemo(
    () =>
      netInvestedDeposit * (totalPayoutSpreadBps / 10000) * totalPayoutsCount,
    [netInvestedDeposit, totalPayoutSpreadBps, totalPayoutsCount],
  );
  const totalFeesDollar = useMemo(
    () => creationFeesDollar + servicingFeesDollarTotal + redemptionFeesDollar,
    [creationFeesDollar, servicingFeesDollarTotal, redemptionFeesDollar],
  );
  const feeDragPct = useMemo(
    () =>
      effectiveGrossAmount > 0
        ? (totalFeesDollar / effectiveGrossAmount) * 100
        : 0,
    [totalFeesDollar, effectiveGrossAmount],
  );

  // Cash Flow Timeline
  const cashFlowTimeline = useMemo(() => {
    const timeline: CashFlowPeriod[] = [];
    let cumulative = -effectiveGrossAmount;

    // Period 0: Deposit Creation
    timeline.push({
      period: 0,
      periodLabel: "Creation (Y0)",
      type: "Creation",
      grossAmount: -effectiveGrossAmount,
      feeAmount: creationFeesDollar,
      netAmount: -netInvestedDeposit,
      cumulativeCashFlow: cumulative,
    });

    // Semi-Annual Payouts
    const grossHalfYearlyPayout =
      netInvestedDeposit * (grossHalfYearlyRatePct / 100);
    const halfYearlyFee = netInvestedDeposit * (totalPayoutSpreadBps / 10000);

    for (let p = 1; p <= totalPayoutsCount; p++) {
      const year = (p / 2).toFixed(1);
      cumulative += halfYearlyPayoutDollar;
      timeline.push({
        period: p,
        periodLabel: `Payout ${p} (Y${year})`,
        type: "Interest Payout",
        grossAmount: grossHalfYearlyPayout,
        feeAmount: halfYearlyFee,
        netAmount: halfYearlyPayoutDollar,
        cumulativeCashFlow: cumulative,
      });
    }

    // Maturity Redemption
    cumulative += netPrincipalReturned;
    timeline.push({
      period: totalPayoutsCount + 1,
      periodLabel: `Maturity (Y${years})`,
      type: "Maturity Redemption",
      grossAmount: netInvestedDeposit,
      feeAmount: redemptionFeesDollar,
      netAmount: netPrincipalReturned,
      cumulativeCashFlow: cumulative,
    });

    return timeline;
  }, [
    effectiveGrossAmount,
    creationFeesDollar,
    netInvestedDeposit,
    grossHalfYearlyRatePct,
    totalPayoutSpreadBps,
    halfYearlyPayoutDollar,
    totalPayoutsCount,
    netPrincipalReturned,
    redemptionFeesDollar,
    years,
  ]);

  return (
    <ForeignCurrencyFDContext.Provider
      value={{
        amountScale,
        setAmountScale,
        initialGrossAmount,
        setInitialGrossAmount,
        years,
        setYears,
        annualRate,
        setAnnualRate,
        spreadX,
        setSpreadX,
        spreadY,
        setSpreadY,
        spreadZ,
        setSpreadZ,
        spreadA,
        setSpreadA,
        spreadB,
        setSpreadB,
        spreadU,
        setSpreadU,
        spreadV,
        setSpreadV,
        loadPreset,
        effectiveGrossAmount,
        totalCreationSpreadBps,
        creationFeesDollar,
        netInvestedDeposit,
        totalPayoutSpreadBps,
        grossHalfYearlyRatePct,
        netHalfYearlyRatePct,
        halfYearlyPayoutDollar,
        totalPayoutsCount,
        cumulativeInterestDollar,
        totalRedemptionSpreadBps,
        redemptionFeesDollar,
        netPrincipalReturned,
        totalCashReturned,
        netProfitLossDollar,
        netCagrPct,
        totalFeesDollar,
        feeDragPct,
        cashFlowTimeline,
      }}
    >
      {children}
    </ForeignCurrencyFDContext.Provider>
  );
};

export const useForeignCurrencyFD = () => {
  const context = useContext(ForeignCurrencyFDContext);
  if (!context) {
    throw new Error(
      "useForeignCurrencyFD must be used within a ForeignCurrencyFDProvider",
    );
  }
  return context;
};
