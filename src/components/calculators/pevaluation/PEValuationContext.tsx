import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type ValuationMode = "perShare" | "corporate";

export interface QuarterlyEps {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  fq1: number;
  fq2: number;
  fq3: number;
  fq4: number;
}

interface PEValuationContextType {
  mode: ValuationMode;
  setMode: (mode: ValuationMode) => void;

  // Per Share Mode Inputs
  sharePrice: number;
  setSharePrice: (val: number) => void;
  ttmEps: number;
  setTtmEps: (val: number) => void;
  forwardEps: number;
  setForwardEps: (val: number) => void;

  quarterlyMode: boolean;
  setQuarterlyMode: (val: boolean) => void;
  quarterlyEps: QuarterlyEps;
  setQuarterlyEps: React.Dispatch<React.SetStateAction<QuarterlyEps>>;

  growthRate: number;
  setGrowthRate: (val: number) => void;
  benchmarkPe: number;
  setBenchmarkPe: (val: number) => void;

  // Corporate Mode Inputs
  marketCap: number;
  setMarketCap: (val: number) => void;
  sharesOutstanding: number;
  setSharesOutstanding: (val: number) => void;
  ttmNetIncome: number;
  setTtmNetIncome: (val: number) => void;
  forwardNetIncome: number;
  setForwardNetIncome: (val: number) => void;

  // Computed Outputs
  effectivePrice: number;
  effectiveTtmEps: number;
  effectiveForwardEps: number;
  ttmPe: number;
  forwardPe: number;
  impliedEpsGrowthPct: number;
  ttmEarningsYieldPct: number;
  forwardEarningsYieldPct: number;
  pegRatio: number;
  peMultipleDiff: number;
  peMultipleDiffBps: number;
}

const PEValuationContext = createContext<PEValuationContextType | undefined>(
  undefined,
);

export const PEValuationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ValuationMode>("perShare");

  // Per-share state
  const [sharePrice, setSharePrice] = useState<number>(150); // $150.00
  const [ttmEps, setTtmEps] = useState<number>(6.0); // $6.00 TTM EPS
  const [forwardEps, setForwardEps] = useState<number>(7.5); // $7.50 Forward EPS

  const [quarterlyMode, setQuarterlyMode] = useState<boolean>(false);
  const [quarterlyEps, setQuarterlyEps] = useState<QuarterlyEps>({
    q1: 1.4,
    q2: 1.45,
    q3: 1.55,
    q4: 1.6,
    fq1: 1.7,
    fq2: 1.8,
    fq3: 1.95,
    fq4: 2.05,
  });

  const [growthRate, setGrowthRate] = useState<number>(15); // 15% Long Term EPS Growth
  const [benchmarkPe, setBenchmarkPe] = useState<number>(20.0); // S&P 500 benchmark ~20x

  // Corporate state
  const [marketCap, setMarketCap] = useState<number>(15000000000); // $15 Billion
  const [sharesOutstanding, setSharesOutstanding] = useState<number>(100000000); // 100 Million shares
  const [ttmNetIncome, setTtmNetIncome] = useState<number>(600000000); // $600 Million
  const [forwardNetIncome, setForwardNetIncome] = useState<number>(750000000); // $750 Million

  // Effective Share Price
  const effectivePrice = useMemo(() => {
    if (mode === "perShare") return sharePrice;
    return sharesOutstanding > 0 ? marketCap / sharesOutstanding : 0;
  }, [mode, sharePrice, marketCap, sharesOutstanding]);

  // Effective TTM EPS
  const effectiveTtmEps = useMemo(() => {
    if (mode === "perShare") {
      if (quarterlyMode) {
        return (
          quarterlyEps.q1 + quarterlyEps.q2 + quarterlyEps.q3 + quarterlyEps.q4
        );
      }
      return ttmEps;
    }
    return sharesOutstanding > 0 ? ttmNetIncome / sharesOutstanding : 0;
  }, [
    mode,
    quarterlyMode,
    quarterlyEps,
    ttmEps,
    sharesOutstanding,
    ttmNetIncome,
  ]);

  // Effective Forward EPS
  const effectiveForwardEps = useMemo(() => {
    if (mode === "perShare") {
      if (quarterlyMode) {
        return (
          quarterlyEps.fq1 +
          quarterlyEps.fq2 +
          quarterlyEps.fq3 +
          quarterlyEps.fq4
        );
      }
      return forwardEps;
    }
    return sharesOutstanding > 0 ? forwardNetIncome / sharesOutstanding : 0;
  }, [
    mode,
    quarterlyMode,
    quarterlyEps,
    forwardEps,
    sharesOutstanding,
    forwardNetIncome,
  ]);

  // Valuation Outputs
  const ttmPe = useMemo(
    () => (effectiveTtmEps > 0 ? effectivePrice / effectiveTtmEps : 0),
    [effectivePrice, effectiveTtmEps],
  );

  const forwardPe = useMemo(
    () => (effectiveForwardEps > 0 ? effectivePrice / effectiveForwardEps : 0),
    [effectivePrice, effectiveForwardEps],
  );

  const impliedEpsGrowthPct = useMemo(() => {
    if (effectiveTtmEps <= 0) return 0;
    return (effectiveForwardEps / effectiveTtmEps - 1) * 100;
  }, [effectiveTtmEps, effectiveForwardEps]);

  const ttmEarningsYieldPct = useMemo(
    () => (effectivePrice > 0 ? (effectiveTtmEps / effectivePrice) * 100 : 0),
    [effectiveTtmEps, effectivePrice],
  );

  const forwardEarningsYieldPct = useMemo(
    () =>
      effectivePrice > 0 ? (effectiveForwardEps / effectivePrice) * 100 : 0,
    [effectiveForwardEps, effectivePrice],
  );

  const pegRatio = useMemo(() => {
    const rateToUse = growthRate > 0 ? growthRate : impliedEpsGrowthPct;
    if (rateToUse <= 0) return 0;
    return forwardPe / rateToUse;
  }, [growthRate, impliedEpsGrowthPct, forwardPe]);

  const peMultipleDiff = useMemo(() => ttmPe - forwardPe, [ttmPe, forwardPe]);
  const peMultipleDiffBps = useMemo(
    () => peMultipleDiff * 100,
    [peMultipleDiff],
  );

  return (
    <PEValuationContext.Provider
      value={{
        mode,
        setMode,
        sharePrice,
        setSharePrice,
        ttmEps,
        setTtmEps,
        forwardEps,
        setForwardEps,
        quarterlyMode,
        setQuarterlyMode,
        quarterlyEps,
        setQuarterlyEps,
        growthRate,
        setGrowthRate,
        benchmarkPe,
        setBenchmarkPe,
        marketCap,
        setMarketCap,
        sharesOutstanding,
        setSharesOutstanding,
        ttmNetIncome,
        setTtmNetIncome,
        forwardNetIncome,
        setForwardNetIncome,
        effectivePrice,
        effectiveTtmEps,
        effectiveForwardEps,
        ttmPe,
        forwardPe,
        impliedEpsGrowthPct,
        ttmEarningsYieldPct,
        forwardEarningsYieldPct,
        pegRatio,
        peMultipleDiff,
        peMultipleDiffBps,
      }}
    >
      {children}
    </PEValuationContext.Provider>
  );
};

export const usePEValuation = () => {
  const context = useContext(PEValuationContext);
  if (!context) {
    throw new Error("usePEValuation must be used within a PEValuationProvider");
  }
  return context;
};
