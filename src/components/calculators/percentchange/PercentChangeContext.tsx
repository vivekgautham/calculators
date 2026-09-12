import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type AmountScale = "hundreds" | "thousands" | "millions" | "billions";

export const getScaleMultiplier = (scale: AmountScale): number => {
  switch (scale) {
    case "hundreds":
      return 100;
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
    case "hundreds":
      return "H";
    case "thousands":
      return "K";
    case "millions":
      return "M";
    case "billions":
      return "B";
  }
};

export const getAmountSliderConfig = (
  scale: AmountScale,
  currentVal: number,
) => {
  switch (scale) {
    case "hundreds":
      return {
        step: 0.1,
        min: Math.min(1, Math.max(0.1, Math.floor(currentVal))),
        max: Math.max(150, Math.ceil(currentVal * 1.5)),
      };
    case "thousands":
      return {
        step: 0.01,
        min: Math.min(0.1, Number((currentVal * 0.5).toFixed(2))),
        max: Math.max(20, Math.ceil(currentVal * 1.5)),
      };
    case "millions":
      return {
        step: 0.01,
        min: Math.min(0.01, Number(currentVal.toFixed(4))),
        max: Math.max(10, Math.ceil(currentVal * 1.5)),
      };
    case "billions":
      return {
        step: 0.001,
        min: Math.min(0.001, Number(currentVal.toFixed(6))),
        max: Math.max(1, Math.ceil(currentVal * 1.5)),
      };
  }
};

export interface SP500Info {
  date: string;
  value: number;
  source: string;
}

export const DEFAULT_SP500: SP500Info = {
  date: "2026-09-11",
  value: 7656.98,
  source: "https://fred.stlouisfed.org/series/sp500",
};

export interface PercentChangeStep {
  id: string;
  percentChange: number;
}

export interface CalculatedStep {
  id: string;
  stepIndex: number;
  label: string;
  percentChange: number;
  startValue: number;
  endValue: number;
  absoluteChange: number;
  cumulativePercentChange: number;
  cumulativeMultiplier: number;
}

const DEFAULT_STEPS: PercentChangeStep[] = [];

export interface PercentChangeContextType {
  amountScale: AmountScale;
  setAmountScale: (scale: AmountScale) => void;
  initialAmountUnits: number;
  setInitialAmountUnits: (units: number) => void;
  initialValue: number;
  setInitialValue: (val: number) => void;
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  showDataLabels: boolean;
  setShowDataLabels: (show: boolean) => void;
  steps: PercentChangeStep[];
  calculatedSteps: CalculatedStep[];
  finalValue: number;
  totalAbsoluteChange: number;
  totalPercentChange: number;
  peakValue: { value: number; stepIndex: number; label: string };
  troughValue: { value: number; stepIndex: number; label: string };
  breakEvenGainNeeded: number | null;
  addStep: (percentChange: number) => void;
  updateStep: (id: string, partial: Partial<PercentChangeStep>) => void;
  removeStep: (id: string) => void;
  undoLastStep: () => void;
  clearSteps: () => void;
  resetToDefault: () => void;
  applyMultipleSteps: (percentChange: number, count: number) => void;
  formatCurrency: (val: number, decimals?: number) => string;
  formatNumber: (val: number, decimals?: number) => string;
  formatPercent: (val: number, showSign?: boolean, decimals?: number) => string;
  sp500Info: SP500Info;
  resetToSP500: () => void;
}

const PercentChangeContext = createContext<
  PercentChangeContextType | undefined
>(undefined);

let idCounter = 5;

export const PercentChangeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sp500Info, setSp500Info] = useState<SP500Info>(DEFAULT_SP500);
  const [amountScale, setAmountScaleState] = useState<AmountScale>("thousands");
  // Default to S&P 500 value in thousands: 7656.98 / 1000 = 7.65698
  const [initialAmountUnits, setInitialAmountUnits] = useState<number>(
    DEFAULT_SP500.value / 1000,
  );
  const [currencySymbol, setCurrencySymbol] = useState<string>("");
  const [showDataLabels, setShowDataLabels] = useState<boolean>(true);
  const [steps, setSteps] = useState<PercentChangeStep[]>(DEFAULT_STEPS);

  // Fetch latest SP500 data point from static json generated from FRED API
  useEffect(() => {
    const loadSP500 = async () => {
      try {
        const url = `${import.meta.env.BASE_URL}data/sp500.json`;
        const res = await axios.get<SP500Info>(url);
        if (res.data && res.data.value) {
          setSp500Info(res.data);
          setInitialAmountUnits((prev) => {
            if (Math.abs(prev - DEFAULT_SP500.value / 1000) < 0.001) {
              return res.data.value / 1000;
            }
            return prev;
          });
        }
      } catch {
        // Fallback to DEFAULT_SP500
      }
    };
    loadSP500();
  }, []);

  const multiplier = useMemo(
    () => getScaleMultiplier(amountScale),
    [amountScale],
  );

  const initialValue = useMemo(
    () => Number((initialAmountUnits * multiplier).toFixed(2)),
    [initialAmountUnits, multiplier],
  );

  const setAmountScale = useCallback(
    (newScale: AmountScale) => {
      const oldMultiplier = getScaleMultiplier(amountScale);
      const newMultiplier = getScaleMultiplier(newScale);
      const currentDollarAmount = initialAmountUnits * oldMultiplier;
      setInitialAmountUnits(
        Number((currentDollarAmount / newMultiplier).toFixed(4)),
      );
      setAmountScaleState(newScale);
    },
    [amountScale, initialAmountUnits],
  );

  const setInitialValue = useCallback(
    (val: number) => {
      const units = val / multiplier;
      setInitialAmountUnits(units);
    },
    [multiplier],
  );

  const resetToSP500 = useCallback(() => {
    const val = sp500Info.value;
    const currentMultiplier = getScaleMultiplier(amountScale);
    setInitialAmountUnits(Number((val / currentMultiplier).toFixed(4)));
  }, [sp500Info.value, amountScale]);

  const formatCurrency = useCallback(
    (val: number, decimals: number = 2): string => {
      const isNegative = val < 0;
      const absFormatted = Math.abs(val).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      const sym = currencySymbol === "None" ? "" : currencySymbol;
      if (sym) {
        return isNegative ? `-${sym}${absFormatted}` : `${sym}${absFormatted}`;
      }
      return isNegative ? `-${absFormatted}` : absFormatted;
    },
    [currencySymbol],
  );

  const formatPercent = useCallback(
    (val: number, showSign: boolean = true, decimals: number = 2): string => {
      const formatted = val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (showSign && val > 0) {
        return `+${formatted}%`;
      }
      return `${formatted}%`;
    },
    [],
  );

  const calculatedSteps = useMemo<CalculatedStep[]>(() => {
    const list: CalculatedStep[] = [];

    // Step 0: Initial full amount
    list.push({
      id: "initial-0",
      stepIndex: 0,
      label: "Initial",
      percentChange: 0,
      startValue: initialValue,
      endValue: initialValue,
      absoluteChange: 0,
      cumulativePercentChange: 0,
      cumulativeMultiplier: 1.0,
    });

    let current = initialValue;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const start = current;
      const absoluteChange = start * (step.percentChange / 100);
      const end = start + absoluteChange;
      const cumulativePercentChange =
        initialValue !== 0 ? ((end - initialValue) / initialValue) * 100 : 0;
      const cumulativeMultiplier = initialValue !== 0 ? end / initialValue : 1;

      list.push({
        id: step.id,
        stepIndex: i + 1,
        label: `Step ${i + 1}`,
        percentChange: step.percentChange,
        startValue: start,
        endValue: end,
        absoluteChange,
        cumulativePercentChange,
        cumulativeMultiplier,
      });

      current = end;
    }

    return list;
  }, [initialValue, steps]);

  const finalValue = useMemo(() => {
    return calculatedSteps[calculatedSteps.length - 1].endValue;
  }, [calculatedSteps]);

  const totalAbsoluteChange = useMemo(() => {
    return finalValue - initialValue;
  }, [finalValue, initialValue]);

  const totalPercentChange = useMemo(() => {
    if (initialValue === 0) return 0;
    return ((finalValue - initialValue) / initialValue) * 100;
  }, [finalValue, initialValue]);

  const peakValue = useMemo(() => {
    let max = calculatedSteps[0].endValue;
    let maxStep = calculatedSteps[0];
    for (const step of calculatedSteps) {
      if (step.endValue > max) {
        max = step.endValue;
        maxStep = step;
      }
    }
    return {
      value: maxStep.endValue,
      stepIndex: maxStep.stepIndex,
      label: maxStep.label,
    };
  }, [calculatedSteps]);

  const troughValue = useMemo(() => {
    let min = calculatedSteps[0].endValue;
    let minStep = calculatedSteps[0];
    for (const step of calculatedSteps) {
      if (step.endValue < min) {
        min = step.endValue;
        minStep = step;
      }
    }
    return {
      value: minStep.endValue,
      stepIndex: minStep.stepIndex,
      label: minStep.label,
    };
  }, [calculatedSteps]);

  // If finalValue < initialValue, calculate what % gain is required to reach initialValue again
  const breakEvenGainNeeded = useMemo(() => {
    if (finalValue <= 0 || finalValue >= initialValue) return null;
    return ((initialValue - finalValue) / finalValue) * 100;
  }, [finalValue, initialValue]);

  const addStep = useCallback((percentChange: number) => {
    const nextId = `step-${idCounter++}`;
    setSteps((prev) => [
      ...prev,
      {
        id: nextId,
        percentChange,
      },
    ]);
  }, []);

  const updateStep = useCallback(
    (id: string, partial: Partial<PercentChangeStep>) => {
      setSteps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...partial } : s)),
      );
    },
    [],
  );

  const removeStep = useCallback((id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const undoLastStep = useCallback(() => {
    setSteps((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  const clearSteps = useCallback(() => {
    setSteps([]);
  }, []);

  const resetToDefault = useCallback(() => {
    setAmountScaleState("thousands");
    setInitialAmountUnits(sp500Info.value / 1000);
    setCurrencySymbol("");
    setSteps(DEFAULT_STEPS);
  }, [sp500Info.value]);

  const applyMultipleSteps = useCallback(
    (percentChange: number, count: number) => {
      const newSteps: PercentChangeStep[] = [];
      for (let i = 1; i <= count; i++) {
        newSteps.push({
          id: `step-${idCounter++}`,
          percentChange,
        });
      }
      setSteps((prev) => [...prev, ...newSteps]);
    },
    [],
  );

  return (
    <PercentChangeContext.Provider
      value={{
        amountScale,
        setAmountScale,
        initialAmountUnits,
        setInitialAmountUnits,
        initialValue,
        setInitialValue,
        currencySymbol,
        setCurrencySymbol,
        showDataLabels,
        setShowDataLabels,
        steps,
        calculatedSteps,
        finalValue,
        totalAbsoluteChange,
        totalPercentChange,
        peakValue,
        troughValue,
        breakEvenGainNeeded,
        addStep,
        updateStep,
        removeStep,
        undoLastStep,
        clearSteps,
        resetToDefault,
        applyMultipleSteps,
        formatCurrency,
        formatNumber: formatCurrency,
        formatPercent,
        sp500Info,
        resetToSP500,
      }}
    >
      {children}
    </PercentChangeContext.Provider>
  );
};

export const usePercentChange = (): PercentChangeContextType => {
  const context = useContext(PercentChangeContext);
  if (!context) {
    throw new Error(
      "usePercentChange must be used within a PercentChangeProvider",
    );
  }
  return context;
};
