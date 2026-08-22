import RateOfGrowth from "./components/calculators/RateOfGrowth";
import GrowthTarget from "./components/calculators/GrowthTarget";
import BasicFinancialPlanner from "./components/calculators/BasicFinancialPlanner";
import FedRates from "./components/calculators/FedRates";
import ProgressiveTax from "./components/calculators/ProgressiveTax";
import BlendedInvestment from "./components/calculators/BlendedInvestment";
import StockAnalysis from "./components/calculators/StockAnalysis";
import PortfolioInMultipleCcys from "./components/calculators/PortfolioInMultipleCcys";
import PortfolioShockMatrix from "./components/calculators/PortfolioShockMatrix";
import RetirementPlanner from "./components/calculators/RetirementPlanner";
import RatingsBasedPredictor from "./components/calculators/RatingsBasedPredictor";
import CorporateDebtTaxSaver from "./components/calculators/CorporateDebtTaxSaver";
import SlabStructure from "./components/calculators/SlabStructure";
import SavingsPower from "./components/calculators/SavingsPower";
import PopulationGrowth from "./components/calculators/PopulationGrowth";
import OrderBook from "./components/calculators/OrderBook";
import DoublingGrowth from "./components/calculators/DoublingGrowth";
import BalanceSheet from "./components/calculators/BalanceSheet";
import ForeignCurrencyFD from "./components/calculators/ForeignCurrencyFD";
import PEValuation from "./components/calculators/PEValuation";

export const CALCULATORS_AND_SIMULATORS = [
  {
    name: "TTM P/E & Forward P/E Valuation",
    value: "pevaluation",
    tags: ["finance", "stocks", "valuation", "pe ratio", "earnings"],
    description:
      "Analyze stock valuations by comparing Trailing Twelve Months (TTM) P/E ratios against Forward Next Twelve Months (NTM) P/E multiples, earnings yield, PEG ratios, and multiple contraction/expansion.",
    panel: PEValuation,
  },
  {
    name: "Foreign Currency Fixed Deposit",
    value: "foreigncurrencyfd",
    tags: ["finance", "forex", "investment", "fixed deposit", "fees"],
    description:
      "Calculate net cash flows, yields, and fee drag for Foreign Currency Fixed Deposits with 3 creation spreads (x, y, z bps), semi-annual interest servicing spreads (a, b bps), and maturity redemption spreads (u, v bps).",
    panel: ForeignCurrencyFD,
  },
  {
    name: "Balance Sheet Health Calculator",
    value: "balancesheet",
    tags: ["finance", "accounting", "analysis", "health"],
    description:
      "Evaluate corporate financial health across 5 critical balance sheet pillars: Cash Cushion, Debt Burden, Short-Term Solvency, Retained Earnings Track Record, and Asset Quality.",
    panel: BalanceSheet,
  },
  {
    name: "Doubling Growth Simulator",
    value: "doublinggrowth",
    tags: ["math", "simulation", "exponential", "growth"],
    description:
      "Start with a number, double (or compound) it at every unit of time, and plot its exponential growth trajectory on linear & log scale charts.",
    panel: DoublingGrowth,
  },
  {
    name: "Order Book Simulator",
    value: "orderbook",
    tags: ["finance", "trading", "simulation", "microstructure"],
    description:
      "Simulate a limit order book (LOB) with price-time priority matching engine, bid/ask depth visualization, market orders, auto-trader bots, and live price history execution charts.",
    panel: OrderBook,
  },
  {
    name: "Basic Financial Planner",
    value: "basicfinancialplanner",
    tags: ["finance", "planning"],
    description:
      "A simple tool to plan your financial future based on corpus, expenses, and growth.",
    panel: BasicFinancialPlanner,
  },
  // {
  //   name: "FX Rates",
  //   value: "fxrates",
  //   tags: ["finance", "forex"],
  //   description: "Historical FX rates for fiat currencies.",
  //   panel: FXRates,
  // },
  {
    name: "Fed Rates",
    value: "fedrates",
    tags: ["finance", "economics", "fed"],
    description:
      "US Treasury Yields (2Y, 10Y, 30Y) and Federal Reserve Interest Rates (EFFR, SOFR).",
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
    tags: ["finance", "tax", "investment"],
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
    name: "Portfolio in Currencies",
    value: "portfolioinmultipleccys",
    tags: ["finance", "portfolio", "forex"],
    description:
      "Analyze and track investment portfolios across multiple currencies.",
    panel: PortfolioInMultipleCcys,
  },
  {
    name: "Portfolio Shock Analaysis",
    value: "portfolioshockmatrix",
    tags: ["finance", "portfolio", "risk", "simulation"],
    description:
      "Simulate and visualize the impact of market shocks (-40% to +40%) on your investment portfolio.",
    panel: PortfolioShockMatrix,
  },
  {
    name: "Retirement Plan Tool",
    value: "retirementplanner",
    tags: ["finance", "planning", "retirement"],
    description:
      "Plan your retirement savings accumulation and withdrawal phases, with inflation adjustment and depletion analysis.",
    panel: RetirementPlanner,
  },
  {
    name: "Ratings Based Predictor",
    value: "ratingsbasedpredictor",
    tags: ["statistics", "planning", "risk", "simulation"],
    description:
      "Predict your personal experience score and risk based on rating distribution, sample size, and Bayesian average estimation.",
    panel: RatingsBasedPredictor,
  },
  {
    name: "Corporate Debt Tax Saver",
    value: "corporatedebttaxsaver",
    tags: ["finance", "tax", "planning"],
    description:
      "Calculate interest tax shields, net tax savings, and effective tax rates generated by corporate debt interest deductibility.",
    panel: CorporateDebtTaxSaver,
  },
  {
    name: "Slab Structure",
    value: "slabstructure",
    tags: ["finance", "tax", "gst"],
    description:
      "Calculate GST and fee slab structures for currency exchange & services, with interactive charts from ₹1 Lakh to ₹20 Lakh.",
    panel: SlabStructure,
  },
  {
    name: "Savings Power Comparison",
    value: "savingspower",
    tags: ["finance", "planning", "investment"],
    description:
      "Compare the compounding power of savings and calculate the pre-tax salary equivalence of after-tax savings differences.",
    panel: SavingsPower,
  },
  {
    name: "Population Growth Simulator",
    value: "populationgrowth",
    tags: ["demographics", "planning"],
    description:
      "Simulate demographic trends, fertility rates, life expectancy, and net migration to analyze cohort aging dynamics.",
    panel: PopulationGrowth,
  },
];

export { getTagStyles } from "./utils/color";
