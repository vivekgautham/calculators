import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Investment {
  key: string;
  id: string;
  name: string;
  amount: number;
  rate: number;
  color: string;
}

interface BlendedInvestmentContextType {
  investments: Investment[];
  totalYears: number;
  setTotalYears: (years: number) => void;
  addInvestment: () => void;
  removeInvestment: (key: string) => void;
  updateInvestment: (key: string, updates: Partial<Investment>) => void;
  availableColors: string[];
}

const BlendedInvestmentContext = createContext<BlendedInvestmentContextType | undefined>(undefined);

export const AVAILABLE_COLORS = [
  "#2E86C1", // Blue
  "#28B463", // Green
  "#8E44AD", // Purple
  "#D35400", // Pumpkin
  "#C70039", // Crimson
  "#16A085", // Dark Teal
  "#F39C12", // Orange
  "#2C3E50", // Midnight Blue
  "#008080", // Teal
  "#FF5733", // Orange-Red
];

export const BlendedInvestmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalYears, setTotalYears] = useState<number>(10);
  const [investments, setInvestments] = useState<Investment[]>([
    {
      key: "inv-1",
      id: "1",
      name: "S&P 500",
      amount: 10000,
      rate: 8,
      color: AVAILABLE_COLORS[0],
    },
    {
      key: "inv-2",
      id: "2",
      name: "Bonds",
      amount: 5000,
      rate: 4,
      color: AVAILABLE_COLORS[1],
    },
  ]);

  const addInvestment = () => {
    const existingIds = investments.map(i => parseInt(i.id)).filter(id => !isNaN(id));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : investments.length + 1;

    const usedColors = investments.map(i => i.color);
    const nextColor = AVAILABLE_COLORS.find(c => !usedColors.includes(c)) ||
                      AVAILABLE_COLORS[investments.length % AVAILABLE_COLORS.length];

    const newInvestment: Investment = {
      key: `inv-${Date.now()}`,
      id: nextNum.toString(),
      name: `Investment ${nextNum}`,
      amount: 1000,
      rate: 5,
      color: nextColor,
    };
    setInvestments([...investments, newInvestment]);
  };

  const removeInvestment = (key: string) => {
    if (investments.length > 1) {
      setInvestments(investments.filter((i) => i.key !== key));
    }
  };

  const updateInvestment = (key: string, updates: Partial<Investment>) => {
    setInvestments(
      investments.map((i) => (i.key === key ? { ...i, ...updates } : i))
    );
  };

  return (
    <BlendedInvestmentContext.Provider
      value={{
        investments,
        totalYears,
        setTotalYears,
        addInvestment,
        removeInvestment,
        updateInvestment,
        availableColors: AVAILABLE_COLORS,
      }}
    >
      {children}
    </BlendedInvestmentContext.Provider>
  );
};

export const useBlendedInvestment = () => {
  const context = useContext(BlendedInvestmentContext);
  if (!context) {
    throw new Error("useBlendedInvestment must be used within a BlendedInvestmentProvider");
  }
  return context;
};
