import React, { createContext, useContext, useState, ReactNode } from "react";

interface SavingsPowerContextType {
  salary: number;
  setSalary: (val: number) => void;
  taxRate: number;
  setTaxRate: (val: number) => void;
  spendingA: number;
  setSpendingA: (val: number) => void;
  spendingB: number;
  setSpendingB: (val: number) => void;
  spendingC: number;
  setSpendingC: (val: number) => void;

  // Computed values
  takeHome: number;
  savingsA: number;
  savingsB: number;
  savingsC: number;
  savingsDiffAB: number;
  preTaxEquivalentAB: number;
}

const SavingsPowerContext = createContext<SavingsPowerContextType | undefined>(undefined);

export const SavingsPowerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [salary, setSalary] = useState<number>(100000);
  const [taxRate, setTaxRate] = useState<number>(27);
  const [spendingA, setSpendingA] = useState<number>(40000);
  const [spendingB, setSpendingB] = useState<number>(50000);
  const [spendingC, setSpendingC] = useState<number>(73000); // Defaults to takeHome

  // Computed values
  const takeHome = salary * (1 - taxRate / 100);

  // Sync Person C spending to full take-home income whenever takeHome changes
  React.useEffect(() => {
    setSpendingC(Math.round(takeHome));
  }, [takeHome]);

  // Clamp spending to make sure it doesn't exceed take-home
  const savingsA = Math.max(0, takeHome - spendingA);
  const savingsB = Math.max(0, takeHome - spendingB);
  const savingsC = Math.max(0, takeHome - spendingC);

  const savingsDiffAB = Math.abs(savingsA - savingsB);

  // Pre-tax equivalent based on tax-to-savings ratio: Diff_pre_tax = Diff_after_tax / (taxRate / 100)
  const preTaxEquivalentAB = taxRate > 0 ? savingsDiffAB / (taxRate / 100) : 0;

  return (
    <SavingsPowerContext.Provider
      value={{
        salary,
        setSalary,
        taxRate,
        setTaxRate,
        spendingA,
        setSpendingA,
        spendingB,
        setSpendingB,
        spendingC,
        setSpendingC,
        takeHome,
        savingsA,
        savingsB,
        savingsC,
        savingsDiffAB,
        preTaxEquivalentAB,
      }}
    >
      {children}
    </SavingsPowerContext.Provider>
  );
};

export const useSavingsPower = () => {
  const context = useContext(SavingsPowerContext);
  if (!context) {
    throw new Error("useSavingsPower must be used within a SavingsPowerProvider");
  }
  return context;
};
