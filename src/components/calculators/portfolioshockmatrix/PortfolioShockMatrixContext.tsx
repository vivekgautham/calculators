import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
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

export interface ShockScenario {
  shockPercent: number;
  initialCorpus: number;
  currentCorpus: number;
  shockAmount: number;
  finalValue: number;
  netProfitLoss: number;
  percentProfitLoss: number;
  isNegativeScenario: boolean;
}

interface PortfolioShockMatrixContextType {
  initialCorpus: number;
  currentCorpus: number;
  setInitialCorpus: (amount: number) => void;
  setCurrentCorpus: (amount: number) => void;
  amountScale: AmountScale;
  setAmountScale: (scale: AmountScale) => void;
  scenarios: ShockScenario[];
}

const PortfolioShockMatrixContext = createContext<
  PortfolioShockMatrixContextType | undefined
>(undefined);

export const PortfolioShockMatrixProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [initialCorpus, setInitialCorpus] = useState<number>(75000); // 75k default
  const [currentCorpus, setCurrentCorpus] = useState<number>(85000); // 85k default
  const [amountScale, setAmountScale] = useState<AmountScale>("thousands");

  const scenarios = useMemo(() => {
    const init = Number(initialCorpus) || 0;
    const current = Number(currentCorpus) || 0;

    const results: ShockScenario[] = [];

    // Generate scenarios from -50% to +50% in 5% steps
    for (let s = -50; s <= 50; s += 5) {
      const shockRate = s / 100;
      const finalValue = current * (1 + shockRate);
      const shockAmount = finalValue - current;
      const netProfitLoss = finalValue - init;
      const percentProfitLoss = init > 0 ? (netProfitLoss / init) * 100 : 0;
      const isNegativeScenario = finalValue < init;

      results.push({
        shockPercent: s,
        initialCorpus: init,
        currentCorpus: current,
        shockAmount,
        finalValue,
        netProfitLoss,
        percentProfitLoss,
        isNegativeScenario,
      });
    }

    return results;
  }, [initialCorpus, currentCorpus]);

  return (
    <PortfolioShockMatrixContext.Provider
      value={{
        initialCorpus,
        currentCorpus,
        setInitialCorpus,
        setCurrentCorpus,
        amountScale,
        setAmountScale,
        scenarios,
      }}
    >
      {children}
    </PortfolioShockMatrixContext.Provider>
  );
};

export const usePortfolioShockMatrix = () => {
  const context = useContext(PortfolioShockMatrixContext);
  if (!context) {
    throw new Error(
      "usePortfolioShockMatrix must be used within a PortfolioShockMatrixProvider",
    );
  }
  return context;
};
