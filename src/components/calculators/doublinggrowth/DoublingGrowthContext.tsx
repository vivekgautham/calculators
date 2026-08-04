import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";

export interface TimeStepData {
  step: number;
  time: number;
  timeLabel: string;
  value: number;
  formattedValue: string;
  growthFactorFromStart: number;
  incrementalChange: number;
}

export interface GrowthMilestone {
  name: string;
  target: number;
  reachedAtTime: number | null;
  reachedAtStep: number | null;
}

export interface PresetScenario {
  key: string;
  name: string;
  initialValue: number;
  growthFactor: number;
  doublingInterval: number;
  totalDuration: number;
  timeUnit: string;
  description: string;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    key: "wheat_chessboard",
    name: "Wheat & Chessboard (64 Squares)",
    initialValue: 1,
    growthFactor: 2,
    doublingInterval: 1,
    totalDuration: 64,
    timeUnit: "Square",
    description:
      "1 grain of wheat on square 1, doubling on each square up to 64 squares.",
  },
  {
    key: "bacteria_culture",
    name: "Bacteria Division (Every 20 Mins)",
    initialValue: 100,
    growthFactor: 2,
    doublingInterval: 20,
    totalDuration: 480, // 8 hours
    timeUnit: "Minutes",
    description:
      "Bacterial cell division doubling every 20 minutes over 8 hours.",
  },
  {
    key: "moore_law",
    name: "Moore's Law (Transistor Count)",
    initialValue: 2300, // Intel 4004 (1971)
    growthFactor: 2,
    doublingInterval: 2,
    totalDuration: 50, // 50 years
    timeUnit: "Years",
    description:
      "Transistor count doubling every 2 years over 50 years of semiconductor development.",
  },
  {
    key: "paper_fold",
    name: "Paper Folding Thickness",
    initialValue: 0.1, // 0.1 mm paper thickness
    growthFactor: 2,
    doublingInterval: 1,
    totalDuration: 42,
    timeUnit: "Folds",
    description:
      "Folding a 0.1 mm piece of paper in half 42 times (reaches the distance to the Moon!).",
  },
  {
    key: "viral_r0",
    name: "Viral Outbreak (Daily Doubling)",
    initialValue: 10,
    growthFactor: 2,
    doublingInterval: 3,
    totalDuration: 60,
    timeUnit: "Days",
    description:
      "Epidemic infection cases doubling every 3 days over 2 months.",
  },
];

export const formatLargeNumber = (num: number): string => {
  if (!isFinite(num)) return "Infinity";
  if (num === 0) return "0";
  const abs = Math.abs(num);

  if (abs >= 1e24) return num.toExponential(4);
  if (abs >= 1e21) return `${(num / 1e21).toFixed(2)} Septillion`;
  if (abs >= 1e18) return `${(num / 1e18).toFixed(2)} Quintillion`;
  if (abs >= 1e15) return `${(num / 1e15).toFixed(2)} Quadrillion`;
  if (abs >= 1e12) return `${(num / 1e12).toFixed(2)} Trillion`;
  if (abs >= 1e9) return `${(num / 1e9).toFixed(2)} Billion`;
  if (abs >= 1e6) return `${(num / 1e6).toFixed(2)} Million`;
  if (abs >= 1e3) return `${(num / 1e3).toFixed(2)} Thousand`;
  if (abs < 0.001) return num.toExponential(4);

  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

interface DoublingGrowthContextType {
  initialValue: number;
  setInitialValue: (val: number) => void;
  growthFactor: number;
  setGrowthFactor: (val: number) => void;
  doublingInterval: number;
  setDoublingInterval: (val: number) => void;
  totalDuration: number;
  setTotalDuration: (val: number) => void;
  timeUnit: string;
  setTimeUnit: (val: string) => void;
  scaleType: "linear" | "logarithmic";
  setScaleType: (val: "linear" | "logarithmic") => void;
  selectedPreset: string;
  loadPreset: (key: string) => void;
  fullTimeSeries: TimeStepData[];
  visibleTimeSeries: TimeStepData[];
  currentSimStep: number;
  setCurrentSimStep: (step: number) => void;
  isSimulating: boolean;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  playSim: () => void;
  pauseSim: () => void;
  stepSim: () => void;
  resetSim: () => void;
  finalValue: number;
  currentSimValue: number;
  totalDoublings: number;
  overallMultiplier: number;
  milestones: GrowthMilestone[];
}

const DoublingGrowthContext = createContext<
  DoublingGrowthContextType | undefined
>(undefined);

export const DoublingGrowthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [initialValue, setInitialValue] = useState<number>(1);
  const [growthFactor, setGrowthFactor] = useState<number>(2); // 2 = Doubling
  const [doublingInterval, setDoublingInterval] = useState<number>(1);
  const [totalDuration, setTotalDuration] = useState<number>(30);
  const [timeUnit, setTimeUnit] = useState<string>("Steps");
  const [scaleType, setScaleType] = useState<"linear" | "logarithmic">(
    "linear",
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");

  // Simulation State
  const [currentSimStep, setCurrentSimStep] = useState<number>(30);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(400); // ms per step

  const loadPreset = (key: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.key === key);
    if (!preset) return;
    setSelectedPreset(preset.key);
    setInitialValue(preset.initialValue);
    setGrowthFactor(preset.growthFactor);
    setDoublingInterval(preset.doublingInterval);
    setTotalDuration(preset.totalDuration);
    setTimeUnit(preset.timeUnit);
    setCurrentSimStep(0);
    setIsSimulating(false);
  };

  // Calculate Full Time Series Data
  const fullTimeSeries = useMemo(() => {
    const data: TimeStepData[] = [];
    const stepCount = Math.min(
      Math.max(1, Math.floor(totalDuration / (doublingInterval || 1))),
      500,
    );

    let currentValue = initialValue;
    let prevValue = initialValue;

    for (let step = 0; step <= stepCount; step++) {
      const time = step * doublingInterval;
      const timeLabel = `${time} ${timeUnit}`;

      if (step === 0) {
        currentValue = initialValue;
      } else {
        currentValue = initialValue * Math.pow(growthFactor, step);
      }

      const incrementalChange = step === 0 ? 0 : currentValue - prevValue;
      const growthFactorFromStart =
        initialValue > 0 ? currentValue / initialValue : 0;

      data.push({
        step,
        time,
        timeLabel,
        value: currentValue,
        formattedValue: formatLargeNumber(currentValue),
        growthFactorFromStart,
        incrementalChange,
      });

      prevValue = currentValue;
    }

    return data;
  }, [initialValue, growthFactor, doublingInterval, totalDuration, timeUnit]);

  // Sync currentSimStep if out of bounds
  useEffect(() => {
    if (currentSimStep > fullTimeSeries.length - 1) {
      setCurrentSimStep(fullTimeSeries.length - 1);
    }
  }, [fullTimeSeries.length, currentSimStep]);

  // Visible Time Series up to active sim step
  const visibleTimeSeries = useMemo(() => {
    return fullTimeSeries.slice(0, currentSimStep + 1);
  }, [fullTimeSeries, currentSimStep]);

  const currentSimValue = useMemo(() => {
    if (visibleTimeSeries.length === 0) return initialValue;
    return visibleTimeSeries[visibleTimeSeries.length - 1].value;
  }, [visibleTimeSeries, initialValue]);

  const finalValue = useMemo(() => {
    return fullTimeSeries.length > 0
      ? fullTimeSeries[fullTimeSeries.length - 1].value
      : initialValue;
  }, [fullTimeSeries, initialValue]);

  const totalDoublings = useMemo(() => {
    return doublingInterval > 0 ? totalDuration / doublingInterval : 0;
  }, [totalDuration, doublingInterval]);

  const overallMultiplier = useMemo(() => {
    return initialValue > 0 ? currentSimValue / initialValue : 0;
  }, [currentSimValue, initialValue]);

  // Simulation Controls
  const playSim = useCallback(() => {
    if (currentSimStep >= fullTimeSeries.length - 1) {
      setCurrentSimStep(0);
    }
    setIsSimulating(true);
  }, [currentSimStep, fullTimeSeries.length]);

  const pauseSim = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const stepSim = useCallback(() => {
    setCurrentSimStep((prev) => Math.min(prev + 1, fullTimeSeries.length - 1));
  }, [fullTimeSeries.length]);

  const resetSim = useCallback(() => {
    setIsSimulating(false);
    setCurrentSimStep(0);
  }, []);

  // Live Timer Effect for Animation
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSimulating) {
      timerRef.current = setInterval(() => {
        setCurrentSimStep((prev) => {
          if (prev >= fullTimeSeries.length - 1) {
            setIsSimulating(false);
            return prev;
          }
          return prev + 1;
        });
      }, simSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, simSpeed, fullTimeSeries.length]);

  // Calculate Milestones
  const milestones = useMemo(() => {
    const targets = [
      { name: "1 Thousand (10³)", target: 1e3 },
      { name: "1 Million (10⁶)", target: 1e6 },
      { name: "1 Billion (10⁹)", target: 1e9 },
      { name: "1 Trillion (10¹²)", target: 1e12 },
      { name: "1 Quadrillion (10¹⁵)", target: 1e15 },
      { name: "1 Quintillion (10¹⁸)", target: 1e18 },
    ];

    return targets.map((m) => {
      const found = visibleTimeSeries.find((d) => d.value >= m.target);
      return {
        name: m.name,
        target: m.target,
        reachedAtTime: found ? found.time : null,
        reachedAtStep: found ? found.step : null,
      };
    });
  }, [visibleTimeSeries]);

  return (
    <DoublingGrowthContext.Provider
      value={{
        initialValue,
        setInitialValue,
        growthFactor,
        setGrowthFactor,
        doublingInterval,
        setDoublingInterval,
        totalDuration,
        setTotalDuration,
        timeUnit,
        setTimeUnit,
        scaleType,
        setScaleType,
        selectedPreset,
        loadPreset,
        fullTimeSeries,
        visibleTimeSeries,
        currentSimStep,
        setCurrentSimStep,
        isSimulating,
        simSpeed,
        setSimSpeed,
        playSim,
        pauseSim,
        stepSim,
        resetSim,
        finalValue,
        currentSimValue,
        totalDoublings,
        overallMultiplier,
        milestones,
      }}
    >
      {children}
    </DoublingGrowthContext.Provider>
  );
};

export const useDoublingGrowth = () => {
  const context = useContext(DoublingGrowthContext);
  if (!context) {
    throw new Error(
      "useDoublingGrowth must be used within a DoublingGrowthProvider",
    );
  }
  return context;
};
