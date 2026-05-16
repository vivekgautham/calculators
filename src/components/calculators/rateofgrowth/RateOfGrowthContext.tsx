import React, { createContext, useContext, useState, ReactNode } from "react";

export enum GrowthFrequency {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  ANNUALLY = "Annually",
}

interface RateOfGrowthContextType {
  initialAmount: number;
  setInitialAmount: (val: number) => void;
  frequency: GrowthFrequency;
  setFrequency: (val: GrowthFrequency) => void;
  rate: number;
  setRate: (val: number) => void;
  timeSpan: number;
  setTimeSpan: (val: number) => void;
}

const RateOfGrowthContext = createContext<RateOfGrowthContextType | undefined>(undefined);

export const RateOfGrowthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initialAmount, setInitialAmount] = useState<number>(1000);
  const [frequency, setFrequency] = useState<GrowthFrequency>(GrowthFrequency.ANNUALLY);
  const [rate, setRate] = useState<number>(5);
  const [timeSpan, setTimeSpan] = useState<number>(10);

  return (
    <RateOfGrowthContext.Provider
      value={{
        initialAmount,
        setInitialAmount,
        frequency,
        setFrequency,
        rate,
        setRate,
        timeSpan,
        setTimeSpan,
      }}
    >
      {children}
    </RateOfGrowthContext.Provider>
  );
};

export const useRateOfGrowth = () => {
  const context = useContext(RateOfGrowthContext);
  if (!context) {
    throw new Error("useRateOfGrowth must be used within a RateOfGrowthProvider");
  }
  return context;
};
