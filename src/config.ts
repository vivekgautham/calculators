import SharpeRatio from "./components/calculators/SharpeRatio";


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
        description: "",
        panel: SharpeRatio
    }
]
