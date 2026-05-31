import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface Bracket {
  id: string;
  min: number;
  max: number | null; // null means "and above"
  rate: number; // percentage
}

export interface TaxResult {
  bracket: Bracket;
  taxableAmountInBracket: number;
  taxPaidInBracket: number;
}

interface ProgressiveTaxContextType {
  income: number;
  setIncome: (income: number) => void;
  brackets: Bracket[];
  addBracket: () => void;
  removeBracket: (id: string) => void;
  updateBracket: (id: string, updates: Partial<Bracket>) => void;
  taxResults: TaxResult[];
  totalTax: number;
  effectiveRate: number;
}

const ProgressiveTaxContext = createContext<ProgressiveTaxContextType | undefined>(undefined);

const DEFAULT_BRACKETS: Bracket[] = [
  { id: "1", min: 0, max: 10000, rate: 10 },
  { id: "2", min: 10000, max: 50000, rate: 20 },
  { id: "3", min: 50000, max: 100000, rate: 30 },
  { id: "4", min: 100000, max: null, rate: 40 },
];

export const ProgressiveTaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [income, setIncome] = useState<number>(75000);
  const [brackets, setBrackets] = useState<Bracket[]>(DEFAULT_BRACKETS);

  const addBracket = () => {
    const lastBracket = brackets[brackets.length - 1];
    const newMin = lastBracket ? (lastBracket.max ?? lastBracket.min + 10000) : 0;
    const newBracket: Bracket = {
      id: Date.now().toString(),
      min: newMin,
      max: null,
      rate: lastBracket ? Math.min(lastBracket.rate + 5, 100) : 10,
    };

    // If the previous last bracket had max: null, we should probably give it a max
    if (lastBracket && lastBracket.max === null) {
        const updatedBrackets = [...brackets];
        updatedBrackets[updatedBrackets.length - 1] = { ...lastBracket, max: newMin };
        setBrackets([...updatedBrackets, newBracket]);
    } else {
        setBrackets([...brackets, newBracket]);
    }
  };

  const removeBracket = (id: string) => {
    if (brackets.length > 1) {
      setBrackets(brackets.filter((b) => b.id !== id));
    }
  };

  const updateBracket = (id: string, updates: Partial<Bracket>) => {
    setBrackets(
      brackets.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const { taxResults, totalTax, effectiveRate } = useMemo(() => {
    const results: TaxResult[] = [];
    let totalTaxAccumulator = 0;

    // Sort brackets by min to ensure correct calculation
    const sortedBrackets = [...brackets].sort((a, b) => a.min - b.min);

    sortedBrackets.forEach((bracket) => {
      const { min, max, rate } = bracket;
      let taxableAmountInBracket = 0;

      if (income > min) {
        const upperLimit = max === null ? income : Math.min(income, max);
        taxableAmountInBracket = Math.max(0, upperLimit - min);
      }

      const taxPaidInBracket = (taxableAmountInBracket * rate) / 100;
      totalTaxAccumulator += taxPaidInBracket;

      results.push({
        bracket,
        taxableAmountInBracket,
        taxPaidInBracket,
      });
    });

    return {
      taxResults: results,
      totalTax: totalTaxAccumulator,
      effectiveRate: income > 0 ? (totalTaxAccumulator / income) * 100 : 0,
    };
  }, [income, brackets]);

  return (
    <ProgressiveTaxContext.Provider
      value={{
        income,
        setIncome,
        brackets,
        addBracket,
        removeBracket,
        updateBracket,
        taxResults,
        totalTax,
        effectiveRate,
      }}
    >
      {children}
    </ProgressiveTaxContext.Provider>
  );
};

export const useProgressiveTax = () => {
  const context = useContext(ProgressiveTaxContext);
  if (!context) {
    throw new Error("useProgressiveTax must be used within a ProgressiveTaxProvider");
  }
  return context;
};
