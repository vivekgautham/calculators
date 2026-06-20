import FXRates from "./components/calculators/FXRates";
import RateOfGrowth from "./components/calculators/RateOfGrowth";
import GrowthTarget from "./components/calculators/GrowthTarget";
import BasicFinancialPlanner from "./components/calculators/BasicFinancialPlanner";
import FedRates from "./components/calculators/FedRates";
import ProgressiveTax from "./components/calculators/ProgressiveTax";
import BlendedInvestment from "./components/calculators/BlendedInvestment";
import StockAnalysis from "./components/calculators/StockAnalysis";
import PortfolioInMultipleCcys from "./components/calculators/PortfolioInMultipleCcys";
import PortfolioShockMatrix from "./components/calculators/PortfolioShockMatrix";

export const CALCULATORS_AND_SIMULATORS = [
  {
    name: "Basic Financial Planner",
    value: "basicfinancialplanner",
    tags: ["finance", "planning"],
    description:
      "A simple tool to plan your financial future based on corpus, expenses, and growth.",
    panel: BasicFinancialPlanner,
  },
  {
    name: "FX Rates",
    value: "fxrates",
    tags: ["finance", "forex"],
    description: "Historical FX rates for fiat currencies.",
    panel: FXRates,
  },
  {
    name: "Fed Rates",
    value: "fedrates",
    tags: ["finance", "economics", "fed"],
    description:
      "Federal Reserve interest rates (EFFR, SOFR, etc.) from the NY Fed API.",
    panel: FedRates,
  },
  {
    name: "Growth Target",
    value: "growthtarget",
    tags: ["finance", "planning", "investment"],
    description:
      "Calculate the required annual growth rate to reach a target amount over time.",
    panel: GrowthTarget,
  },
  {
    name: "Progressive Tax",
    value: "progressivetax",
    tags: ["finance", "tax"],
    description:
      "Calculate progressive tax based on custom brackets and income.",
    panel: ProgressiveTax,
  },
  {
    name: "Rate of Growth",
    value: "rateofgrowth",
    tags: ["finance", "economics"],
    description:
      "The rate at which a variable increases over a specific period of time.",
    panel: RateOfGrowth,
  },
  {
    name: "Blended Investment",
    value: "blendedinvestment",
    tags: ["finance", "planning", "investment"],
    description:
      "Project growth of a portfolio with multiple different investment types and rates.",
    panel: BlendedInvestment,
  },
  {
    name: "Stock Analysis",
    value: "stockanalysis",
    tags: ["finance", "stocks", "investing"],
    description:
      "Analyze stock price history from CSV files with interactive charts.",
    panel: StockAnalysis,
  },
  {
    name: "Portfolio in Multiple Currencies",
    value: "portfolioinmultipleccys",
    tags: ["finance", "portfolio", "forex"],
    description:
      "Analyze and track investment portfolios across multiple currencies.",
    panel: PortfolioInMultipleCcys,
  },
  {
    name: "Portfolio Shock Matrix",
    value: "portfolioshockmatrix",
    tags: ["finance", "portfolio", "risk", "simulation"],
    description:
      "Simulate and visualize the impact of market shocks (-40% to +40%) on your investment portfolio.",
    panel: PortfolioShockMatrix,
  },
];
