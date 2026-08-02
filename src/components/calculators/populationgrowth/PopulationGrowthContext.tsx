import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export interface CohortYearData {
  year: number;
  youth: number;
  working: number;
  elderly: number;
  total: number;
  growthRate: number;
  oldAgeDependency: number;
}

import { COUNTRIES_DEMOGRAPHICS, CountryDemographic } from "./countriesData";

export type CountryPreset = CountryDemographic;

export const PRESETS: Record<string, CountryPreset> = COUNTRIES_DEMOGRAPHICS;

export const getCountryLabel = (
  presetKey: string,
  fallback: string,
): string => {
  const country = COUNTRIES_DEMOGRAPHICS[presetKey];
  return country ? country.name : fallback;
};

export const getFlagEmoji = (presetKey: string): string => {
  if (presetKey === "custom" || !presetKey) return "⚙️";
  const codePoints = presetKey
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
};

export interface ScenarioState {
  presetKey: string;
  initialPopulation: number;
  fertility: number;
  lifeExpectancy: number;
  netMigration: number;
  youthRatio: number;
  workingRatio: number;
  elderlyRatio: number;
}

interface PopulationGrowthContextType {
  scenarioA: ScenarioState;
  setScenarioA: React.Dispatch<React.SetStateAction<ScenarioState>>;
  scenarioB: ScenarioState;
  setScenarioB: React.Dispatch<React.SetStateAction<ScenarioState>>;
  timeHorizon: number;
  setTimeHorizon: (val: number) => void;
  timelineYear: number;
  setTimelineYear: (val: number) => void;

  // Simulation outputs
  projectionA: CohortYearData[];
  projectionB: CohortYearData[];
}

const PopulationGrowthContext = createContext<
  PopulationGrowthContextType | undefined
>(undefined);

export const PopulationGrowthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timeHorizon, setTimeHorizon] = useState<number>(100);
  const [timelineYear, setTimelineYear] = useState<number>(0);

  const [scenarioA, setScenarioA] = useState<ScenarioState>({
    presetKey: "us",
    initialPopulation: 100000000,
    fertility: 1.6,
    lifeExpectancy: 79,
    netMigration: 1000000,
    youthRatio: 0.18,
    workingRatio: 0.65,
    elderlyRatio: 0.17,
  });

  const [scenarioB, setScenarioB] = useState<ScenarioState>({
    presetKey: "kr",
    initialPopulation: 100000000,
    fertility: 0.72,
    lifeExpectancy: 84,
    netMigration: 10000,
    youthRatio: 0.12,
    workingRatio: 0.71,
    elderlyRatio: 0.17,
  });

  // Simulation helper
  const runSimulation = (
    config: ScenarioState,
    years: number,
  ): CohortYearData[] => {
    const data: CohortYearData[] = [];

    let Y = config.initialPopulation * config.youthRatio;
    let W = config.initialPopulation * config.workingRatio;
    let E = config.initialPopulation * config.elderlyRatio;
    let total = Y + W + E;

    data.push({
      year: 0,
      youth: Math.round(Y),
      working: Math.round(W),
      elderly: Math.round(E),
      total: Math.round(total),
      growthRate: 0,
      oldAgeDependency: W > 0 ? (E / W) * 100 : 0,
    });

    for (let t = 1; t <= years; t++) {
      const prevTotal = total;

      // 1. Births (governed by fertility rate and working population childbearing cohort)
      const births = W * 0.01 * config.fertility;

      // 2. Cohort Transitions
      const youthToWorking = Y / 15;
      const workingToElderly = W / 50;

      // 3. Deaths
      const youthDeaths = Y * 0.001; // 0.1% youth mortality
      const workingDeaths = W * 0.003; // 0.3% working age mortality
      const elderlyDuration = Math.max(1, config.lifeExpectancy - 65);
      const elderlyDeaths = E / elderlyDuration;

      // 4. Update Cohorts
      Y = Y + births - youthToWorking - youthDeaths;
      W =
        W +
        youthToWorking +
        config.netMigration -
        workingToElderly -
        workingDeaths;
      E = E + workingToElderly - elderlyDeaths;

      // Clamp to zero to prevent negative populations
      Y = Math.max(0, Y);
      W = Math.max(0, W);
      E = Math.max(0, E);
      total = Y + W + E;

      const growthRate =
        prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
      const oldAgeDependency = W > 0 ? (E / W) * 100 : 0;

      data.push({
        year: t,
        youth: Math.round(Y),
        working: Math.round(W),
        elderly: Math.round(E),
        total: Math.round(total),
        growthRate,
        oldAgeDependency,
      });
    }

    return data;
  };

  const projectionA = useMemo(
    () => runSimulation(scenarioA, timeHorizon),
    [scenarioA, timeHorizon],
  );
  const projectionB = useMemo(
    () => runSimulation(scenarioB, timeHorizon),
    [scenarioB, timeHorizon],
  );

  return (
    <PopulationGrowthContext.Provider
      value={{
        scenarioA,
        setScenarioA,
        scenarioB,
        setScenarioB,
        timeHorizon,
        setTimeHorizon,
        timelineYear,
        setTimelineYear,
        projectionA,
        projectionB,
      }}
    >
      {children}
    </PopulationGrowthContext.Provider>
  );
};

export const usePopulationGrowth = () => {
  const context = useContext(PopulationGrowthContext);
  if (!context) {
    throw new Error(
      "usePopulationGrowth must be used within a PopulationGrowthProvider",
    );
  }
  return context;
};
