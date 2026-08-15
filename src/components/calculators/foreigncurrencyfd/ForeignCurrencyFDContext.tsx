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

export interface FeeItem {
  label: string;
  bps: number;
  amount: number;
}

export interface CashFlowPeriod {
  period: number;
  periodLabel: string;
  type: "Creation" | "Interest Payout" | "Maturity Redemption";
  grossAmount: number;
  feeAmount: number;
  feeBreakdown: FeeItem[];
  feeBreakdownStr: string;
  netAmount: number;
  cumulativeCashFlow: number;
}

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

  // Computed Outputs
  effectiveGrossAmount: number;
  totalCreationSpreadBps: number;
  creationFeesDollar: number;
  netInvestedDeposit: number;
  totalPayoutSpreadBps: number;
  grossHalfYearlyRatePct: number;
  netHalfYearlyRatePct: number;
  grossHalfYearlyPayoutDollar: number;
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
  const [initialGrossAmount, setInitialGrossAmount] = useState<number>(10); // $10K ($10,000) default
  const [years, setYears] = useState<number>(3); // Default 3 Years
  const [annualRate, setAnnualRate] = useState<number>(6.25); // Default 6.25% p.a.

  // Creation spreads (bps)
  const [spreadX, setSpreadX] = useState<number>(220); // FX Conversion I default 220 bps
  const [spreadY, setSpreadY] = useState<number>(220); // FX Conversion II default 220 bps
  const [spreadZ, setSpreadZ] = useState<number>(50); // GST I default 50 bps

  // Interest payout spreads (bps)
  const [spreadA, setSpreadA] = useState<number>(220); // FX Conversion Half Yearly default 220 bps
  const [spreadB, setSpreadB] = useState<number>(50); // GST II default 50 bps

  // Redemption spreads (bps)
  const [spreadU, setSpreadU] = useState<number>(220); // Redemption FX Conversion default 220 bps
  const [spreadV, setSpreadV] = useState<number>(50); // GST III default 50 bps

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

  // 2. Half-Yearly Payouts ($a, b$ bps applied directly to Gross Interest Payout)
  const totalPayoutSpreadBps = useMemo(
    () => spreadA + spreadB,
    [spreadA, spreadB],
  );
  const grossHalfYearlyRatePct = useMemo(() => annualRate / 2, [annualRate]);
  const grossHalfYearlyPayoutDollar = useMemo(
    () => netInvestedDeposit * (grossHalfYearlyRatePct / 100),
    [netInvestedDeposit, grossHalfYearlyRatePct],
  );

  const payoutFXFee = useMemo(
    () => grossHalfYearlyPayoutDollar * (spreadA / 10000),
    [grossHalfYearlyPayoutDollar, spreadA],
  );
  const payoutGSTFee = useMemo(
    () => grossHalfYearlyPayoutDollar * (spreadB / 10000),
    [grossHalfYearlyPayoutDollar, spreadB],
  );
  const halfYearlyFeeTotal = useMemo(
    () => payoutFXFee + payoutGSTFee,
    [payoutFXFee, payoutGSTFee],
  );

  const halfYearlyPayoutDollar = useMemo(
    () => Math.max(0, grossHalfYearlyPayoutDollar - halfYearlyFeeTotal),
    [grossHalfYearlyPayoutDollar, halfYearlyFeeTotal],
  );

  const netHalfYearlyRatePct = useMemo(
    () =>
      netInvestedDeposit > 0
        ? (halfYearlyPayoutDollar / netInvestedDeposit) * 100
        : 0,
    [halfYearlyPayoutDollar, netInvestedDeposit],
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
    () => halfYearlyFeeTotal * totalPayoutsCount,
    [halfYearlyFeeTotal, totalPayoutsCount],
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

    // Creation breakdown
    const creationFX1 = effectiveGrossAmount * (spreadX / 10000);
    const creationFX2 = effectiveGrossAmount * (spreadY / 10000);
    const creationGST = effectiveGrossAmount * (spreadZ / 10000);
    const creationItems: FeeItem[] = [
      { label: "FX Conversion I", bps: spreadX, amount: creationFX1 },
      { label: "FX Conversion II", bps: spreadY, amount: creationFX2 },
      { label: "GST I", bps: spreadZ, amount: creationGST },
    ];
    const creationStr = creationItems
      .map(
        (i) =>
          `${i.label} (${i.bps} bps): -$${i.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      )
      .join(" | ");

    // Period 0: Deposit Creation
    timeline.push({
      period: 0,
      periodLabel: "Creation (Y0)",
      type: "Creation",
      grossAmount: -effectiveGrossAmount,
      feeAmount: creationFeesDollar,
      feeBreakdown: creationItems,
      feeBreakdownStr: creationStr,
      netAmount: -netInvestedDeposit,
      cumulativeCashFlow: cumulative,
    });

    // Semi-Annual Payouts
    const payoutItems: FeeItem[] = [
      { label: "FX Conv Half Yearly", bps: spreadA, amount: payoutFXFee },
      { label: "GST II", bps: spreadB, amount: payoutGSTFee },
    ];
    const payoutStr = payoutItems
      .map(
        (i) =>
          `${i.label} (${i.bps} bps): -$${i.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      )
      .join(" | ");

    for (let p = 1; p <= totalPayoutsCount; p++) {
      const year = (p / 2).toFixed(1);
      cumulative += halfYearlyPayoutDollar;
      timeline.push({
        period: p,
        periodLabel: `Payout ${p} (Y${year})`,
        type: "Interest Payout",
        grossAmount: grossHalfYearlyPayoutDollar,
        feeAmount: halfYearlyFeeTotal,
        feeBreakdown: payoutItems,
        feeBreakdownStr: payoutStr,
        netAmount: halfYearlyPayoutDollar,
        cumulativeCashFlow: cumulative,
      });
    }

    // Maturity Redemption
    const redemptionFX = netInvestedDeposit * (spreadU / 10000);
    const redemptionGST = netInvestedDeposit * (spreadV / 10000);
    const redemptionItems: FeeItem[] = [
      { label: "Redemption FX Conv", bps: spreadU, amount: redemptionFX },
      { label: "GST III", bps: spreadV, amount: redemptionGST },
    ];
    const redemptionStr = redemptionItems
      .map(
        (i) =>
          `${i.label} (${i.bps} bps): -$${i.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      )
      .join(" | ");

    cumulative += netPrincipalReturned;
    timeline.push({
      period: totalPayoutsCount + 1,
      periodLabel: `Maturity (Y${years})`,
      type: "Maturity Redemption",
      grossAmount: netInvestedDeposit,
      feeAmount: redemptionFeesDollar,
      feeBreakdown: redemptionItems,
      feeBreakdownStr: redemptionStr,
      netAmount: netPrincipalReturned,
      cumulativeCashFlow: cumulative,
    });

    return timeline;
  }, [
    effectiveGrossAmount,
    creationFeesDollar,
    netInvestedDeposit,
    grossHalfYearlyPayoutDollar,
    payoutFXFee,
    payoutGSTFee,
    halfYearlyFeeTotal,
    halfYearlyPayoutDollar,
    totalPayoutsCount,
    netPrincipalReturned,
    redemptionFeesDollar,
    years,
    spreadX,
    spreadY,
    spreadZ,
    spreadA,
    spreadB,
    spreadU,
    spreadV,
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
        effectiveGrossAmount,
        totalCreationSpreadBps,
        creationFeesDollar,
        netInvestedDeposit,
        totalPayoutSpreadBps,
        grossHalfYearlyRatePct,
        netHalfYearlyRatePct,
        grossHalfYearlyPayoutDollar,
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
