import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface YearlyData {
  year: number;
  projectedBalance: number;
  withdrawnAmount: number;
  remainingBalance: number;
}

interface BasicFinancialPlannerContextType {
  corpusAmount: number;
  yearsToGo: number;
  annualExpense: number;
  inflationRate: number;
  corpusGrowthRate: number;
  planData: YearlyData[];
  multiplier: number;
  setCorpusAmount: (value: number) => void;
  setYearsToGo: (value: number) => void;
  setAnnualExpense: (value: number) => void;
  setInflationRate: (value: number) => void;
  setCorpusGrowthRate: (value: number) => void;
}

const BasicFinancialPlannerContext = createContext<BasicFinancialPlannerContextType | undefined>(undefined);

export const BasicFinancialPlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [corpusAmount, setCorpusAmount] = useState<number>(1000000);
  const [yearsToGo, setYearsToGo] = useState<number>(35);
  const [annualExpense, setAnnualExpense] = useState<number>(50000);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [corpusGrowthRate, setCorpusGrowthRate] = useState<number>(10);

  const planData = useMemo(() => {
    const data: YearlyData[] = [];

    // Initial row (Year 0)
    data.push({
      year: 0,
      projectedBalance: corpusAmount,
      withdrawnAmount: 0,
      remainingBalance: corpusAmount,
    });

    let currentRemainingBalance = corpusAmount;
    let currentExpense = annualExpense;

    for (let year = 1; year <= yearsToGo; year++) {
      const projectedBalance = currentRemainingBalance * (1 + corpusGrowthRate / 100);
      const withdrawnAmount = currentExpense * (1 + inflationRate / 100);
      const remainingBalance = projectedBalance - withdrawnAmount;

      data.push({
        year,
        projectedBalance,
        withdrawnAmount,
        remainingBalance,
      });

      currentRemainingBalance = remainingBalance;
      currentExpense = withdrawnAmount; // Carry forward the inflated expense
    }

    return data;
  }, [corpusAmount, yearsToGo, annualExpense, inflationRate, corpusGrowthRate]);

  const multiplier = useMemo(() => {
    const r = (1 + inflationRate / 100) / (1 + corpusGrowthRate / 100);
    if (Math.abs(r - 1) < 0.0001) {
      return yearsToGo;
    }
    return r * (1 - Math.pow(r, yearsToGo)) / (1 - r);
  }, [yearsToGo, inflationRate, corpusGrowthRate]);

  return (
    <BasicFinancialPlannerContext.Provider
      value={{
        corpusAmount,
        yearsToGo,
        annualExpense,
        inflationRate,
        corpusGrowthRate,
        planData,
        multiplier,
        setCorpusAmount,
        setYearsToGo,
        setAnnualExpense,
        setInflationRate,
        setCorpusGrowthRate,
      }}
    >
      {children}
    </BasicFinancialPlannerContext.Provider>
  );
};

export const useBasicFinancialPlanner = () => {
  const context = useContext(BasicFinancialPlannerContext);
  if (!context) {
    throw new Error("useBasicFinancialPlanner must be used within a BasicFinancialPlannerProvider");
  }
  return context;
};
