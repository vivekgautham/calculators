import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import {
  AREA_UNITS,
  AreaUnit,
  ConvertedResult,
  BenchmarkComparison,
  PlotDimension,
  UnitCategory,
} from "./types";

interface AreaConverterContextType {
  inputValue: string;
  setInputValue: (val: string) => void;
  parsedInputNumber: number;
  inputUnit: string;
  setInputUnit: (unitId: string) => void;
  selectedUnitMeta: AreaUnit;
  precision: number | "auto";
  setPrecision: (p: number | "auto") => void;
  numberFormat: "standard" | "indian" | "scientific";
  setNumberFormat: (fmt: "standard" | "indian" | "scientific") => void;
  categoryFilter: UnitCategory;
  setCategoryFilter: (filter: UnitCategory) => void;
  areaInSqMeters: number;
  allResults: ConvertedResult[];
  coreResults: ConvertedResult[];
  filteredResults: ConvertedResult[];
  benchmarks: BenchmarkComparison[];
  plotDimensions: PlotDimension[];
  formatValue: (num: number) => string;
  quickSet: (num: number, unitId?: string) => void;
  copyToClipboard: (text: string, label?: string) => Promise<boolean>;
  copyNotification: string | null;
  resetToDefault: () => void;
}

const AreaConverterContext = createContext<
  AreaConverterContextType | undefined
>(undefined);

export const useAreaConverter = () => {
  const context = useContext(AreaConverterContext);
  if (!context) {
    throw new Error(
      "useAreaConverter must be used within an AreaConverterProvider",
    );
  }
  return context;
};

interface AreaConverterProviderProps {
  children: ReactNode;
}

export const AreaConverterProvider: React.FC<AreaConverterProviderProps> = ({
  children,
}) => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [inputUnit, setInputUnit] = useState<string>("acre");
  const [precision, setPrecision] = useState<number | "auto">("auto");
  const [numberFormat, setNumberFormat] = useState<
    "standard" | "indian" | "scientific"
  >("standard");
  const [categoryFilter, setCategoryFilter] = useState<UnitCategory>("all");
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  // Parse numerical input safely
  const parsedInputNumber = useMemo(() => {
    const cleaned = inputValue.replace(/,/g, "").trim();
    if (!cleaned) return 0;
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.max(0, num);
  }, [inputValue]);

  // Active unit metadata
  const selectedUnitMeta = useMemo(() => {
    return (
      AREA_UNITS.find((u) => u.id === inputUnit) ||
      AREA_UNITS.find((u) => u.id === "acre")!
    );
  }, [inputUnit]);

  // Source of truth: Area in Square Meters (m²)
  const areaInSqMeters = useMemo(() => {
    return parsedInputNumber * selectedUnitMeta.sqMetersMultiplier;
  }, [parsedInputNumber, selectedUnitMeta]);

  // Formatter for Indian Lakhs & Crores (e.g. 12,34,567.89)
  const formatIndianNumber = useCallback(
    (num: number, dec: number | "auto"): string => {
      if (num === 0) return "0";
      if (num < 0.0001 && num > 0) return num.toExponential(4);

      let decPlaces = 2;
      if (dec !== "auto") {
        decPlaces = dec;
      } else {
        if (num >= 1000) decPlaces = 2;
        else if (num >= 1) decPlaces = 4;
        else if (num >= 0.01) decPlaces = 6;
        else decPlaces = 8;
      }

      const parts = num.toFixed(decPlaces).split(".");
      const integerPart = parts[0];
      const decimalPart = parts.length > 1 ? parts[1] : "";

      // Format integer part with Indian commas (last 3, then groups of 2)
      let lastThree = integerPart.substring(integerPart.length - 3);
      const otherNumbers = integerPart.substring(0, integerPart.length - 3);
      if (otherNumbers !== "") {
        lastThree = "," + lastThree;
      }
      const formattedInteger =
        otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

      if (dec === "auto") {
        // Strip trailing zeros if auto
        const cleanDec = decimalPart.replace(/0+$/, "");
        return cleanDec ? `${formattedInteger}.${cleanDec}` : formattedInteger;
      }
      return decPlaces > 0
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;
    },
    [],
  );

  // Standard/Auto number formatter
  const formatValue = useCallback(
    (num: number): string => {
      if (num === 0) return "0";
      if (numberFormat === "scientific") {
        return num.toExponential(
          precision === "auto" ? 4 : Math.min(precision, 8),
        );
      }

      if (numberFormat === "indian") {
        return formatIndianNumber(num, precision);
      }

      // Standard International Format (1,234,567.89)
      if (precision !== "auto") {
        if (num >= 1e15 || (num < 1e-6 && num > 0)) {
          return num.toExponential(Math.min(precision, 6));
        }
        return num.toLocaleString("en-US", {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
      }

      // Auto precision
      if (num >= 1e12 || (num < 1e-5 && num > 0)) {
        return num.toExponential(4);
      }

      let maxDec = 4;
      if (num >= 1000) maxDec = 2;
      else if (num >= 1) maxDec = 4;
      else if (num >= 0.01) maxDec = 6;
      else maxDec = 8;

      return num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDec,
      });
    },
    [numberFormat, precision, formatIndianNumber],
  );

  // Calculate conversion for all units
  const allResults: ConvertedResult[] = useMemo(() => {
    return AREA_UNITS.map((targetUnit) => {
      const targetValue = areaInSqMeters / targetUnit.sqMetersMultiplier;
      const ratio =
        selectedUnitMeta.sqMetersMultiplier / targetUnit.sqMetersMultiplier;

      return {
        unit: targetUnit,
        value: targetValue,
        formattedValue: formatValue(targetValue),
        scientificValue: targetValue.toExponential(4),
        ratioFromInput: ratio,
      };
    });
  }, [areaInSqMeters, selectedUnitMeta, formatValue]);

  // Core results (The 7 requested units: Hectare, Acre, Sq Ft, Sq M, Sq Km, Sq Mile, Cent)
  const coreResults = useMemo(() => {
    return allResults.filter((r) => r.unit.isCoreUnit);
  }, [allResults]);

  // Filtered results based on category selector
  const filteredResults = useMemo(() => {
    if (categoryFilter === "core") return coreResults;
    if (categoryFilter === "all") return allResults;
    return allResults.filter((r) => r.unit.category === categoryFilter);
  }, [categoryFilter, coreResults, allResults]);

  // Real-world benchmark equivalents
  const benchmarks: BenchmarkComparison[] = useMemo(() => {
    if (areaInSqMeters <= 0) return [];

    const BENCHMARK_ITEMS = [
      {
        id: "football",
        name: "FIFA Football Pitch",
        description: "Standard 105m × 68m pitch",
        areaSqMeters: 7140, // 105 * 68 = 7140 m² (~1.76 acres)
        icon: "⚽",
        unitLabel: "Football Pitches",
      },
      {
        id: "basketball",
        name: "NBA Basketball Court",
        description: "Standard 28.65m × 15.24m court",
        areaSqMeters: 436.64, // 94 ft * 50 ft = 4700 sq ft = ~436.64 m²
        icon: "🏀",
        unitLabel: "Basketball Courts",
      },
      {
        id: "tennis",
        name: "Standard Tennis Court",
        description: "Full court doubles play area",
        areaSqMeters: 260.75, // 78 ft * 36 ft = 2808 sq ft = ~260.87 m²
        icon: "🎾",
        unitLabel: "Tennis Courts",
      },
      {
        id: "olympic_pool",
        name: "Olympic Swimming Pool",
        description: "50m × 25m water surface",
        areaSqMeters: 1250, // 50 * 25 = 1250 m²
        icon: "🏊",
        unitLabel: "Olympic Pools",
      },
      {
        id: "house_plot",
        name: "2,400 sq ft Plot (1 Ground)",
        description: "Standard urban residential site (60' × 40')",
        areaSqMeters: 222.967, // 2400 sq ft = 222.967 m²
        icon: "🏡",
        unitLabel: "Standard Residential Plots",
      },
      {
        id: "apartment",
        name: "1,200 sq ft 2-BHK Apartment",
        description: "Typical urban family home",
        areaSqMeters: 111.483, // 1200 sq ft = 111.483 m²
        icon: "🏢",
        unitLabel: "Apartment Units",
      },
      {
        id: "central_park",
        name: "Central Park (New York)",
        description: "Famous urban park (843 acres = 3.41 km²)",
        areaSqMeters: 3410000,
        icon: "🌳",
        unitLabel: "Central Parks",
      },
    ];

    return BENCHMARK_ITEMS.map((item) => ({
      ...item,
      count: areaInSqMeters / item.areaSqMeters,
    }));
  }, [areaInSqMeters]);

  // Land plot geometric dimensions
  const plotDimensions: PlotDimension[] = useMemo(() => {
    if (areaInSqMeters <= 0) return [];

    const sqFt = areaInSqMeters / 0.09290304;

    // 1. Square Plot: s = sqrt(A)
    const squareSideM = Math.sqrt(areaInSqMeters);
    const squareSideFt = Math.sqrt(sqFt);

    // 2. Rectangle 1:2 (e.g. 30' x 60' or 40' x 80')
    // w * 2w = A => w = sqrt(A / 2), l = 2w
    const rect1_2_w_M = Math.sqrt(areaInSqMeters / 2);
    const rect1_2_l_M = rect1_2_w_M * 2;
    const rect1_2_w_Ft = Math.sqrt(sqFt / 2);
    const rect1_2_l_Ft = rect1_2_w_Ft * 2;

    // 3. Rectangle 3:4 (Standard residential building site e.g. 30' x 40' or 60' x 80')
    // 3k * 4k = A => 12 k^2 = A => k = sqrt(A / 12)
    const k_M = Math.sqrt(areaInSqMeters / 12);
    const rect3_4_w_M = 3 * k_M;
    const rect3_4_l_M = 4 * k_M;
    const k_Ft = Math.sqrt(sqFt / 12);
    const rect3_4_w_Ft = 3 * k_Ft;
    const rect3_4_l_Ft = 4 * k_Ft;

    // 4. Rectangle 1:3 (Narrow Long Plot)
    const rect1_3_w_M = Math.sqrt(areaInSqMeters / 3);
    const rect1_3_l_M = rect1_3_w_M * 3;
    const rect1_3_w_Ft = Math.sqrt(sqFt / 3);
    const rect1_3_l_Ft = rect1_3_w_Ft * 3;

    return [
      {
        shape: "square",
        label: "Square Plot",
        aspectRatio: "1 : 1",
        description: "Equal length & width",
        widthMeters: squareSideM,
        lengthMeters: squareSideM,
        widthFeet: squareSideFt,
        lengthFeet: squareSideFt,
        perimeterMeters: 4 * squareSideM,
        perimeterFeet: 4 * squareSideFt,
      },
      {
        shape: "rect_3_4",
        label: "Standard Plot",
        aspectRatio: "3 : 4 (or 4 : 3)",
        description: "Classic residential site (e.g., 30×40 or 60×80)",
        widthMeters: rect3_4_w_M,
        lengthMeters: rect3_4_l_M,
        widthFeet: rect3_4_w_Ft,
        lengthFeet: rect3_4_l_Ft,
        perimeterMeters: 2 * (rect3_4_w_M + rect3_4_l_M),
        perimeterFeet: 2 * (rect3_4_w_Ft + rect3_4_l_Ft),
      },
      {
        shape: "rect_1_2",
        label: "Double-Depth Plot",
        aspectRatio: "1 : 2",
        description: "Length is twice the frontage width",
        widthMeters: rect1_2_w_M,
        lengthMeters: rect1_2_l_M,
        widthFeet: rect1_2_w_Ft,
        lengthFeet: rect1_2_l_Ft,
        perimeterMeters: 2 * (rect1_2_w_M + rect1_2_l_M),
        perimeterFeet: 2 * (rect1_2_w_Ft + rect1_2_l_Ft),
      },
      {
        shape: "rect_1_3",
        label: "Narrow Strip Plot",
        aspectRatio: "1 : 3",
        description: "Long corridor / agricultural strip",
        widthMeters: rect1_3_w_M,
        lengthMeters: rect1_3_l_M,
        widthFeet: rect1_3_w_Ft,
        lengthFeet: rect1_3_l_Ft,
        perimeterMeters: 2 * (rect1_3_w_M + rect1_3_l_M),
        perimeterFeet: 2 * (rect1_3_w_Ft + rect1_3_l_Ft),
      },
    ];
  }, [areaInSqMeters]);

  // Quick preset helper
  const quickSet = useCallback((num: number, unitId?: string) => {
    setInputValue(num.toString());
    if (unitId) {
      setInputUnit(unitId);
    }
  }, []);

  // Reset to default
  const resetToDefault = useCallback(() => {
    setInputValue("1");
    setInputUnit("acre");
    setPrecision("auto");
    setNumberFormat("standard");
    setCategoryFilter("core");
  }, []);

  // Copy helper
  const copyToClipboard = useCallback(
    async (text: string, label?: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopyNotification(label ? `Copied ${label}: ${text}` : "Copied!");
        setTimeout(() => setCopyNotification(null), 2500);
        return true;
      } catch {
        setCopyNotification("Failed to copy");
        setTimeout(() => setCopyNotification(null), 2500);
        return false;
      }
    },
    [],
  );

  return (
    <AreaConverterContext.Provider
      value={{
        inputValue,
        setInputValue,
        parsedInputNumber,
        inputUnit,
        setInputUnit,
        selectedUnitMeta,
        precision,
        setPrecision,
        numberFormat,
        setNumberFormat,
        categoryFilter,
        setCategoryFilter,
        areaInSqMeters,
        allResults,
        coreResults,
        filteredResults,
        benchmarks,
        plotDimensions,
        formatValue,
        quickSet,
        copyToClipboard,
        copyNotification,
        resetToDefault,
      }}
    >
      {children}
    </AreaConverterContext.Provider>
  );
};
