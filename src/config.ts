import FXRates from "./components/calculators/FXRates";
import RateOfGrowth from "./components/calculators/RateOfGrowth";
import GrowthTarget from "./components/calculators/GrowthTarget";
import BasicFinancialPlanner from "./components/calculators/BasicFinancialPlanner";
import FedRates from "./components/calculators/FedRates";
import ProgressiveTax from "./components/calculators/ProgressiveTax";

export const CALCULATORS_AND_SIMULATORS = [
    {
        name: "Basic Financial Planner",
        value: "basicfinancialplanner",
        tags: ["finance", "planning"],
        description: "A simple tool to plan your financial future based on corpus, expenses, and growth.",
        panel: BasicFinancialPlanner
    },
    {
        name: "FX Rates",
        value: "fxrates",
        tags: ["finance", "forex"],
        description: "Historical FX rates for fiat currencies.",
        panel: FXRates
    },
    {
        name: "Fed Rates",
        value: "fedrates",
        tags: ["finance", "economics", "fed"],
        description: "Federal Reserve interest rates (EFFR, SOFR, etc.) from the NY Fed API.",
        panel: FedRates
    },
    {
        name: "Growth Target",
        value: "growthtarget",
        tags: ["finance", "planning", "investment"],
        description: "Calculate the required annual growth rate to reach a target amount over time.",
        panel: GrowthTarget
    },
    {
        name: "Progressive Tax",
        value: "progressivetax",
        tags: ["finance", "tax"],
        description: "Calculate progressive tax based on custom brackets and income.",
        panel: ProgressiveTax
    },
    {
        name: "Rate of Growth",
        value: "rateofgrowth",
        tags: ["finance", "economics"],
        description: "The rate at which a variable increases over a specific period of time.",
        panel: RateOfGrowth
    }
]
