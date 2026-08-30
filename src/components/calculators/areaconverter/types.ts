export type UnitCategory =
  | "core"
  | "all"
  | "metric"
  | "imperial"
  | "regional"
  | "micro";

export interface AreaUnit {
  id: string;
  name: string;
  plural: string;
  symbol: string;
  sqMetersMultiplier: number; // 1 unit = X square meters
  category: "metric" | "imperial" | "regional" | "micro";
  description: string;
  formulaRelation: string;
  isCoreUnit: boolean;
  accentColor: string;
}

export interface ConvertedResult {
  unit: AreaUnit;
  value: number;
  formattedValue: string;
  scientificValue: string;
  ratioFromInput: number;
}

export interface BenchmarkComparison {
  id: string;
  name: string;
  description: string;
  areaSqMeters: number;
  icon: string;
  count: number;
  unitLabel: string;
}

export const AREA_UNITS: AreaUnit[] = [
  // 7 Core Units Requested by User
  {
    id: "hectare",
    name: "Hectare",
    plural: "Hectares",
    symbol: "ha",
    sqMetersMultiplier: 10000,
    category: "metric",
    description: "Standard metric land unit (100m × 100m square = 10,000 m²)",
    formulaRelation: "1 ha = 10,000 m² = 2.471 ac = 247.11 cents",
    isCoreUnit: true,
    accentColor: "#16a34a",
  },
  {
    id: "acre",
    name: "Acre",
    plural: "Acres",
    symbol: "ac",
    sqMetersMultiplier: 4046.8564224,
    category: "imperial",
    description: "Traditional Imperial/US land unit (43,560 sq ft = 100 cents)",
    formulaRelation: "1 ac = 43,560 sq ft = 100 cents = 0.4047 ha",
    isCoreUnit: true,
    accentColor: "#d97706",
  },
  {
    id: "cent",
    name: "Cent",
    plural: "Cents",
    symbol: "cent",
    sqMetersMultiplier: 40.468564224,
    category: "regional",
    description:
      "Standard South Asian land unit equal to 0.01 acre (435.6 sq ft)",
    formulaRelation: "1 cent = 0.01 ac = 435.6 sq ft = 40.469 m²",
    isCoreUnit: true,
    accentColor: "#0284c7",
  },
  {
    id: "sq_ft",
    name: "Square Foot",
    plural: "Square Feet",
    symbol: "sq ft",
    sqMetersMultiplier: 0.09290304,
    category: "imperial",
    description: "Common architectural & real estate unit (1 ft × 1 ft)",
    formulaRelation: "1 sq ft = 0.0929 m² = 1/43560 ac = 1/435.6 cent",
    isCoreUnit: true,
    accentColor: "#9333ea",
  },
  {
    id: "sq_m",
    name: "Square Meter",
    plural: "Square Meters",
    symbol: "sq m",
    sqMetersMultiplier: 1,
    category: "metric",
    description: "SI base derived unit for area (1m × 1m)",
    formulaRelation: "1 m² = 10.7639 sq ft = 0.0001 ha = 0.0247 cent",
    isCoreUnit: true,
    accentColor: "#2563eb",
  },
  {
    id: "sq_km",
    name: "Square Kilometer",
    plural: "Square Kilometers",
    symbol: "sq km",
    sqMetersMultiplier: 1000000,
    category: "metric",
    description: "Large geographic area unit (1,000m × 1,000m = 100 hectares)",
    formulaRelation: "1 km² = 1,000,000 m² = 100 ha = 247.105 ac",
    isCoreUnit: true,
    accentColor: "#0891b2",
  },
  {
    id: "sq_mi",
    name: "Square Mile",
    plural: "Square Miles",
    symbol: "sq mi",
    sqMetersMultiplier: 2589988.110336,
    category: "imperial",
    description: "Imperial land & geographic unit (1 mi × 1 mi = 640 acres)",
    formulaRelation: "1 sq mi = 640 ac = 64,000 cents = 2.590 km² = 259.0 ha",
    isCoreUnit: true,
    accentColor: "#ea580c",
  },

  // Additional Popular Regional, Metric, and Imperial Units
  {
    id: "sq_yd",
    name: "Square Yard (Gaj)",
    plural: "Square Yards",
    symbol: "sq yd",
    sqMetersMultiplier: 0.83612736,
    category: "imperial",
    description:
      "Equal to 9 square feet, commonly known as 1 Gaj in South Asia",
    formulaRelation: "1 sq yd = 9 sq ft = 0.8361 m² = 1 Gaj",
    isCoreUnit: false,
    accentColor: "#4f46e5",
  },
  {
    id: "ground",
    name: "Ground",
    plural: "Grounds",
    symbol: "ground",
    sqMetersMultiplier: 222.967296,
    category: "regional",
    description:
      "South Indian real estate unit equal to 2,400 sq ft (~5.51 cents)",
    formulaRelation: "1 ground = 2,400 sq ft = 5.5096 cents = 222.97 m²",
    isCoreUnit: false,
    accentColor: "#ca8a04",
  },
  {
    id: "sq_in",
    name: "Square Inch",
    plural: "Square Inches",
    symbol: "sq in",
    sqMetersMultiplier: 0.00064516,
    category: "imperial",
    description: "Small imperial area unit (1/144 sq ft)",
    formulaRelation: "1 sq in = 1/144 sq ft = 6.4516 cm²",
    isCoreUnit: false,
    accentColor: "#7c3aed",
  },
  {
    id: "sq_mil_micro",
    name: "Square Mil (Thou²)",
    plural: "Square Mils",
    symbol: "mil²",
    sqMetersMultiplier: 6.4516e-10,
    category: "micro",
    description:
      "Precision micro-engineering unit (1 mil = 0.001 in, 1 mil² = 10⁻⁶ sq in)",
    formulaRelation: "1 mil² = 10⁻⁶ sq in = 6.4516 × 10⁻¹⁰ m²",
    isCoreUnit: false,
    accentColor: "#64748b",
  },
];
