import SharpeRatio from "./components/calculators/SharpeRatio";
import UnleveredBeta from "./components/calculators/UnleveredBeta";


export const CALCULATORS_AND_SIMULATORS = [
    {
        name: "Sharpe Ratio",
        value: "sharperatio",
        tags: ["finance", "econ"],
        description: "A measure of an investement's risk adjusted performance, calculated by comparing its return to that of a risk free asset",
        panel: SharpeRatio

    },
    {
        name: "Unlevered Beta",
        value: "unleveredbeta",
        tags: ["finance", "econ"],
        description: "A measure of company's market risk (systematic risk) without the influence of debt. It isolates the risk inherent in the company's core operations and assets, allowing for a pure comparison of business risk between companies with different capital structures. ",
        panel: UnleveredBeta
    }
]
