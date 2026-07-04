import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

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
  initialCorpus: number | string;
  currentCorpus: number | string;
  setInitialCorpus: (amount: number | string) => void;
  setCurrentCorpus: (amount: number | string) => void;
  scenarios: ShockScenario[];
}

const PortfolioShockMatrixContext = createContext<
  PortfolioShockMatrixContextType | undefined
>(undefined);

export const PortfolioShockMatrixProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [initialCorpus, setInitialCorpus] = useState<number | string>(75000); // 75k default
  const [currentCorpus, setCurrentCorpus] = useState<number | string>(85000); // 85k default

  const scenarios = useMemo(() => {
    const init = parseFloat(initialCorpus.toString()) || 0;
    const current = parseFloat(currentCorpus.toString()) || 0;

    const results: ShockScenario[] = [];

    // Generate scenarios from -40% to +40% in 5% steps
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
