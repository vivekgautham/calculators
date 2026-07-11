import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface CorporateDebtTaxSaverContextType {
  debt: number;
  setDebt: (val: number) => void;
  taxRate: number;
  setTaxRate: (val: number) => void;
  interestRate: number;
  setInterestRate: (val: number) => void;
  ebit: number;
  setEbit: (val: number) => void;

  // Computed values
  annualInterest: number;
  netTaxSaving: number;
  afterTaxCostOfDebt: number;
  taxWithoutDebt: number;
  taxWithDebt: number;
  effectiveTaxRateWithoutDebt: number;
  effectiveTaxRateWithDebt: number;
  netProfitWithoutDebt: number;
  netProfitWithDebt: number;
}

const CorporateDebtTaxSaverContext = createContext<CorporateDebtTaxSaverContextType | undefined>(undefined);

export const CorporateDebtTaxSaverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [debt, setDebt] = useState<number>(10000000000); // Default $10,000,000,000 (10 billion)
  const [taxRate, setTaxRate] = useState<number>(21); // Default 21% (US federal corporate rate)
  const [interestRate, setInterestRate] = useState<number>(6.5); // Default 6.5%
  const [ebit, setEbit] = useState<number>(15000000000); // Default $15,000,000,000 EBIT (15 billion)

  const computedValues = useMemo(() => {
    const tRate = taxRate / 100;
    const iRate = interestRate / 100;

    // 1. Annual Interest Expense
    const annualInterest = debt * iRate;

    // 2. Pre-tax Income without Debt (EBT without debt)
    const ebtWithoutDebt = Math.max(0, ebit);
    const taxWithoutDebt = ebtWithoutDebt * tRate;
    const netProfitWithoutDebt = ebit - taxWithoutDebt;

    // 3. Pre-tax Income with Debt (EBT with debt)
    const ebtWithDebt = Math.max(0, ebit - annualInterest);
    const taxWithDebt = ebtWithDebt * tRate;
    const netProfitWithDebt = ebit - annualInterest - taxWithDebt;

    // 4. Net Tax Saving (Interest Tax Shield)
    // The savings is the difference in tax bills
    const netTaxSaving = Math.max(0, taxWithoutDebt - taxWithDebt);

    // 5. After-Tax Cost of Debt
    const afterTaxCostOfDebt = interestRate * (1 - tRate);

    // 6. Effective Tax Rates relative to EBIT (Operating Income)
    const effectiveTaxRateWithoutDebt = ebit > 0 ? (taxWithoutDebt / ebit) * 100 : 0;
    const effectiveTaxRateWithDebt = ebit > 0 ? (taxWithDebt / ebit) * 100 : 0;

    return {
      annualInterest,
      netTaxSaving,
      afterTaxCostOfDebt,
      taxWithoutDebt,
      taxWithDebt,
      effectiveTaxRateWithoutDebt,
      effectiveTaxRateWithDebt,
      netProfitWithoutDebt,
      netProfitWithDebt,
    };
  }, [debt, taxRate, interestRate, ebit]);

  return (
    <CorporateDebtTaxSaverContext.Provider
      value={{
        debt,
        setDebt,
        taxRate,
        setTaxRate,
        interestRate,
        setInterestRate,
        ebit,
        setEbit,
        ...computedValues,
      }}
    >
      {children}
    </CorporateDebtTaxSaverContext.Provider>
  );
};

export const useCorporateDebtTaxSaver = () => {
  const context = useContext(CorporateDebtTaxSaverContext);
  if (!context) {
    throw new Error("useCorporateDebtTaxSaver must be used within a CorporateDebtTaxSaverProvider");
  }
  return context;
};
