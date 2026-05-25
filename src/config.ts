import FXRates from "./components/calculators/FXRates";
import RateOfGrowth from "./components/calculators/RateOfGrowth";
import GrowthTarget from "./components/calculators/GrowthTarget";

export const CALCULATORS_AND_SIMULATORS = [
    {
        name: "Rate of Growth",
        value: "rateofgrowth",
        tags: ["finance", "economics"],
        description: "The rate at which a variable increases over a specific period of time.",
        panel: RateOfGrowth
    },
    {
        name: "Growth Target",
        value: "growthtarget",
        tags: ["finance", "planning", "investment"],
        description: "Calculate the required annual growth rate to reach a target amount over time.",
        panel: GrowthTarget
    },
    {
        name: "FX Rates",
        value: "fxrates",
        tags: ["finance", "forex"],
        description: "Historical FX rates for fiat currencies.",
        panel: FXRates
    }
]
