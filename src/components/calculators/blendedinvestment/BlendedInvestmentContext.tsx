import React, { createContext, useContext, useState, ReactNode } from "react";

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

export interface Investment {
  key: string;
  id: string;
  name: string;
  amount: number; // Stored in base currency dollars ($)
  rate: number; // Percentage e.g. 9 for 9%
  color: string;
}

interface BlendedInvestmentContextType {
  investments: Investment[];
  totalYears: number;
  setTotalYears: (years: number) => void;
  amountScale: AmountScale;
  setAmountScale: (scale: AmountScale) => void;
  addInvestment: () => void;
  removeInvestment: (key: string) => void;
  updateInvestment: (key: string, updates: Partial<Investment>) => void;
  availableColors: string[];
}

const BlendedInvestmentContext = createContext<
  BlendedInvestmentContextType | undefined
>(undefined);

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

export const BlendedInvestmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [totalYears, setTotalYears] = useState<number>(10);
  const [amountScale, setAmountScale] = useState<AmountScale>("thousands");
  const [investments, setInvestments] = useState<Investment[]>([
    {
      key: "inv-1",
      id: "1",
      name: "Equity",
      amount: 150000,
      rate: 9,
      color: AVAILABLE_COLORS[0],
    },
    {
      key: "inv-2",
      id: "2",
      name: "FD",
      amount: 400000,
      rate: 4,
      color: AVAILABLE_COLORS[1],
    },
    {
      key: "inv-3",
      id: "3",
      name: "HYSA",
      amount: 500000,
      rate: 3,
      color: AVAILABLE_COLORS[2],
    },
  ]);

  const addInvestment = () => {
    const existingIds = investments
      .map((i) => parseInt(i.id))
      .filter((id) => !isNaN(id));
    const nextNum =
      existingIds.length > 0
        ? Math.max(...existingIds) + 1
        : investments.length + 1;

    const usedColors = investments.map((i) => i.color);
    const nextColor =
      AVAILABLE_COLORS.find((c) => !usedColors.includes(c)) ||
      AVAILABLE_COLORS[investments.length % AVAILABLE_COLORS.length];

    const newInvestment: Investment = {
      key: `inv-${Date.now()}`,
      id: nextNum.toString(),
      name: `Investment ${nextNum}`,
      amount: 100000, // Default $100K
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
      investments.map((i) => (i.key === key ? { ...i, ...updates } : i)),
    );
  };

  return (
    <BlendedInvestmentContext.Provider
      value={{
        investments,
        totalYears,
        setTotalYears,
        amountScale,
        setAmountScale,
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
    throw new Error(
      "useBlendedInvestment must be used within a BlendedInvestmentProvider",
    );
  }
  return context;
};
