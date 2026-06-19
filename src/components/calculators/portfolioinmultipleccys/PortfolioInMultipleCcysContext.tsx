import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CurrencyAsset {
  key: string;
  id: string;
  ccyName: string;
  corpusAmount: number;
  growthRate: number;
  annualIncDecRate: number;
}

interface PortfolioInMultipleCcysContextType {
  currencies: CurrencyAsset[];
  totalYears: number;
  setTotalYears: (years: number) => void;
  addCurrency: () => void;
  removeCurrency: (key: string) => void;
  updateCurrency: (key: string, updates: Partial<CurrencyAsset>) => void;
}

const PortfolioInMultipleCcysContext = createContext<
  PortfolioInMultipleCcysContextType | undefined
>(undefined);

export const PortfolioInMultipleCcysProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [totalYears, setTotalYears] = useState<number>(10);
  const [currencies, setCurrencies] = useState<CurrencyAsset[]>([
    {
      key: "ccy-1",
      id: "1",
      ccyName: "USD",
      corpusAmount: 100000,
      growthRate: 8,
      annualIncDecRate: 2,
    },
    {
      key: "ccy-2",
      id: "2",
      ccyName: "EUR",
      corpusAmount: 80000,
      growthRate: 6,
      annualIncDecRate: 1.5,
    },
  ]);

  const addCurrency = () => {
    const existingIds = currencies
      .map((c) => parseInt(c.id))
      .filter((id) => !isNaN(id));
    const nextNum =
      existingIds.length > 0
        ? Math.max(...existingIds) + 1
        : currencies.length + 1;

    const newCurrency: CurrencyAsset = {
      key: `ccy-${Date.now()}`,
      id: nextNum.toString(),
      ccyName: `CCY-${nextNum}`,
      corpusAmount: 50000,
      growthRate: 5,
      annualIncDecRate: 1,
    };
    setCurrencies([...currencies, newCurrency]);
  };

  const removeCurrency = (key: string) => {
    if (currencies.length > 1) {
      setCurrencies(currencies.filter((c) => c.key !== key));
    }
  };

  const updateCurrency = (key: string, updates: Partial<CurrencyAsset>) => {
    setCurrencies(
      currencies.map((c) => (c.key === key ? { ...c, ...updates } : c)),
    );
  };

  return (
    <PortfolioInMultipleCcysContext.Provider
      value={{
        currencies,
        totalYears,
        setTotalYears,
        addCurrency,
        removeCurrency,
        updateCurrency,
      }}
    >
      {children}
    </PortfolioInMultipleCcysContext.Provider>
  );
};

export const usePortfolioInMultipleCcys = () => {
  const context = useContext(PortfolioInMultipleCcysContext);
  if (!context) {
    throw new Error(
      "usePortfolioInMultipleCcys must be used within a PortfolioInMultipleCcysProvider",
    );
  }
  return context;
};
