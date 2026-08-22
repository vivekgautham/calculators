export interface SeriesOption {
  id: string;
  name: string;
  shortName: string;
  category: "Treasury Yields" | "Fed Policy Rates";
}

export const FED_SERIES_OPTIONS: SeriesOption[] = [
  {
    id: "DGS2",
    name: "2-Year Treasury Yield",
    shortName: "2Y Treasury",
    category: "Treasury Yields",
  },
  {
    id: "DGS10",
    name: "10-Year Treasury Yield",
    shortName: "10Y Treasury",
    category: "Treasury Yields",
  },
  {
    id: "DGS30",
    name: "30-Year Treasury Yield",
    shortName: "30Y Treasury",
    category: "Treasury Yields",
  },
  {
    id: "DGS5",
    name: "5-Year Treasury Yield",
    shortName: "5Y Treasury",
    category: "Treasury Yields",
  },
  {
    id: "DGS1",
    name: "1-Year Treasury Yield",
    shortName: "1Y Treasury",
    category: "Treasury Yields",
  },
  {
    id: "DGS3MO",
    name: "3-Month Treasury Yield",
    shortName: "3M Treasury",
    category: "Treasury Yields",
  },
  {
    id: "DFF",
    name: "Effective Federal Funds Rate (EFFR)",
    shortName: "EFFR",
    category: "Fed Policy Rates",
  },
  {
    id: "SOFR",
    name: "Secured Overnight Financing Rate (SOFR)",
    shortName: "SOFR",
    category: "Fed Policy Rates",
  },
];

// Show all benchmark rates by default
export const DEFAULT_FED_SERIES: SeriesOption[] = [...FED_SERIES_OPTIONS];
