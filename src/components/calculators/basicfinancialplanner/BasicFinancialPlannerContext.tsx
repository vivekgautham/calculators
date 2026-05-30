import React, { createContext, useContext, useState, ReactNode } from "react";

interface BasicFinancialPlannerContextType {
  corpusAmount: number;
  yearsToGo: number;
  annualExpense: number;
  inflationRate: number;
  corpusGrowthRate: number;
  setCorpusAmount: (value: number) => void;
  setYearsToGo: (value: number) => void;
  setAnnualExpense: (value: number) => void;
  setInflationRate: (value: number) => void;
  setCorpusGrowthRate: (value: number) => void;
}

const BasicFinancialPlannerContext = createContext<BasicFinancialPlannerContextType | undefined>(undefined);

export const BasicFinancialPlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [corpusAmount, setCorpusAmount] = useState<number>(100000);
  const [yearsToGo, setYearsToGo] = useState<number>(20);
  const [annualExpense, setAnnualExpense] = useState<number>(50000);
  const [inflationRate, setInflationRate] = useState<number>(2);
  const [corpusGrowthRate, setCorpusGrowthRate] = useState<number>(7);

  return (
    <BasicFinancialPlannerContext.Provider
      value={{
        corpusAmount,
        yearsToGo,
        annualExpense,
        inflationRate,
        corpusGrowthRate,
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
