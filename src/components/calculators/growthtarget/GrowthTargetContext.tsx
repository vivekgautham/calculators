import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface GrowthTargetContextType {
  currentAmount: number;
  targetAmount: number;
  years: number;
  setCurrentAmount: (val: number) => void;
  setTargetAmount: (val: number) => void;
  setYears: (val: number) => void;
  requiredRate: number;
  yearlyData: { year: number; balance: number }[];
}

const GrowthTargetContext = createContext<GrowthTargetContextType | undefined>(
  undefined,
);

export const GrowthTargetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentAmount, setCurrentAmount] = useState<number>(1000000);
  const [targetAmount, setTargetAmount] = useState<number>(3000000);
  const [years, setYears] = useState<number>(5);

  const { requiredRate, yearlyData } = useMemo(() => {
    // CAGR formula: (Target / Current) ^ (1 / years) - 1
    const rate =
      years > 0 && currentAmount > 0
        ? Math.pow(targetAmount / currentAmount, 1 / years) - 1
        : 0;

    const data = [];
    let currentBalance = currentAmount;
    data.push({ year: 0, balance: currentBalance });

    for (let i = 1; i <= years; i++) {
      currentBalance = currentBalance * (1 + rate);
      data.push({ year: i, balance: currentBalance });
    }

    return {
      requiredRate: rate * 100,
      yearlyData: data,
    };
  }, [currentAmount, targetAmount, years]);

  return (
    <GrowthTargetContext.Provider
      value={{
        currentAmount,
        targetAmount,
        years,
        setCurrentAmount,
        setTargetAmount,
        setYears,
        requiredRate,
        yearlyData,
      }}
    >
      {children}
    </GrowthTargetContext.Provider>
  );
};

export const useGrowthTarget = () => {
  const context = useContext(GrowthTargetContext);
  if (!context) {
    throw new Error(
      "useGrowthTarget must be used within a GrowthTargetProvider",
    );
  }
  return context;
};
