import React, { createContext, useContext, useState, ReactNode } from "react";

export enum GrowthFrequency {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  ANNUALLY = "Annually",
}

export enum AmountUnit {
  THOUSAND = "K",
  MILLION = "M",
  BILLION = "B",
  TRILLION = "T",
}

export interface Scenario {
  key: string;
  name: string;
  initialAmount: number;
  unit: AmountUnit;
  rate: number;
  color: string;
}

interface RateOfGrowthContextType {
  scenarios: Scenario[];
  addScenario: () => void;
  removeScenario: (key: string) => void;
  updateScenario: (key: string, updates: Partial<Scenario>) => void;
  availableColors: string[];
  timeSpan: number;
  setTimeSpan: (val: number) => void;
  frequency: GrowthFrequency;
  setFrequency: (val: GrowthFrequency) => void;
}

const RateOfGrowthContext = createContext<RateOfGrowthContextType | undefined>(
  undefined,
);

export const AVAILABLE_COLORS = [
  "#008080", // Teal
  "#FF5733", // Orange-Red
  "#2E86C1", // Blue
  "#28B463", // Green
  "#8E44AD", // Purple
  "#D35400", // Pumpkin
  "#C70039", // Crimson
  "#16A085", // Dark Teal
  "#F39C12", // Orange
  "#2C3E50", // Midnight Blue
];

export const RateOfGrowthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      key: "init-1",
      name: "Scenario 1",
      initialAmount: 1000000,
      unit: AmountUnit.MILLION,
      rate: 5,
      color: AVAILABLE_COLORS[0],
    },
    {
      key: "init-2",
      name: "Scenario 2",
      initialAmount: 1000000,
      unit: AmountUnit.MILLION,
      rate: 6,
      color: AVAILABLE_COLORS[1],
    },
  ]);

  const [timeSpan, setTimeSpan] = useState<number>(10); // Default 10 years
  const [frequency, setFrequency] = useState<GrowthFrequency>(GrowthFrequency.ANNUALLY); // Default Annually

  const addScenario = () => {
    // Generate a unique number for name based on current scenarios
    const existingNames = scenarios.map((s) => s.name);
    let nextNum = scenarios.length + 1;
    while (existingNames.includes(`Scenario ${nextNum}`)) {
      nextNum++;
    }

    // Try to find a color that isn't used yet, or just cycle
    const usedColors = scenarios.map((s) => s.color);
    const nextColor =
      AVAILABLE_COLORS.find((c) => !usedColors.includes(c)) ||
      AVAILABLE_COLORS[scenarios.length % AVAILABLE_COLORS.length];

    const newScenario: Scenario = {
      key: `scenario-${Date.now()}`,
      name: `Scenario ${nextNum}`,
      initialAmount: 1000000,
      unit: AmountUnit.MILLION,
      rate: 5,
      color: nextColor,
    };
    setScenarios([...scenarios, newScenario]);
  };

  const removeScenario = (key: string) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter((s) => s.key !== key));
    }
  };

  const updateScenario = (key: string, updates: Partial<Scenario>) => {
    setScenarios(
      scenarios.map((s) => (s.key === key ? { ...s, ...updates } : s)),
    );
  };

  return (
    <RateOfGrowthContext.Provider
      value={{
        scenarios,
        addScenario,
        removeScenario,
        updateScenario,
        availableColors: AVAILABLE_COLORS,
        timeSpan,
        setTimeSpan,
        frequency,
        setFrequency,
      }}
    >
      {children}
    </RateOfGrowthContext.Provider>
  );
};

export const useRateOfGrowth = () => {
  const context = useContext(RateOfGrowthContext);
  if (!context) {
    throw new Error(
      "useRateOfGrowth must be used within a RateOfGrowthProvider",
    );
  }
  return context;
};
