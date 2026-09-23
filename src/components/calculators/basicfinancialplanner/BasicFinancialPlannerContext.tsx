import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export interface YearlyData {
  year: number;
  projectedBalance: number;
  netExpense: number;
  taxAmount: number;
  withdrawnAmount: number;
  remainingBalance: number;
}

interface BasicFinancialPlannerContextType {
  corpusAmount: number;
  yearsToGo: number;
  annualExpense: number;
  inflationRate: number;
  corpusGrowthRate: number;
  withdrawalTaxRate: number;
  planData: YearlyData[];
  multiplier: number;
  baseMultiplier: number;
  totalNetExpenses: number;
  totalTaxes: number;
  totalWithdrawn: number;
  setCorpusAmount: (value: number) => void;
  setYearsToGo: (value: number) => void;
  setAnnualExpense: (value: number) => void;
  setInflationRate: (value: number) => void;
  setCorpusGrowthRate: (value: number) => void;
  setWithdrawalTaxRate: (value: number) => void;
}

const BasicFinancialPlannerContext = createContext<
  BasicFinancialPlannerContextType | undefined
>(undefined);

export const BasicFinancialPlannerProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [corpusAmount, setCorpusAmount] = useState<number>(5000000);
  const [yearsToGo, setYearsToGo] = useState<number>(35);
  const [annualExpense, setAnnualExpense] = useState<number>(50000);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [corpusGrowthRate, setCorpusGrowthRate] = useState<number>(10);
  const [withdrawalTaxRate, setWithdrawalTaxRate] = useState<number>(15);

  const planData = useMemo(() => {
    const data: YearlyData[] = [];

    // Initial row (Year 0)
    data.push({
      year: 0,
      projectedBalance: corpusAmount,
      netExpense: 0,
      taxAmount: 0,
      withdrawnAmount: 0,
      remainingBalance: corpusAmount,
    });

    let currentRemainingBalance = corpusAmount;
    let currentNetExpense = annualExpense;
    const taxFraction = Math.min(Math.max(withdrawalTaxRate, 0), 99) / 100;

    for (let year = 1; year <= yearsToGo; year++) {
      const projectedBalance =
        currentRemainingBalance * (1 + corpusGrowthRate / 100);
      const netExpense = currentNetExpense * (1 + inflationRate / 100);
      // To receive netExpense after taxFraction is deducted, gross withdrawal is:
      // Gross * (1 - taxFraction) = netExpense => Gross = netExpense / (1 - taxFraction)
      const withdrawnAmount =
        taxFraction < 1 ? netExpense / (1 - taxFraction) : netExpense;
      const taxAmount = withdrawnAmount - netExpense;
      const remainingBalance = projectedBalance - withdrawnAmount;

      data.push({
        year,
        projectedBalance,
        netExpense,
        taxAmount,
        withdrawnAmount,
        remainingBalance,
      });

      currentRemainingBalance = remainingBalance;
      currentNetExpense = netExpense; // Inflate for next year
    }

    return data;
  }, [
    corpusAmount,
    yearsToGo,
    annualExpense,
    inflationRate,
    corpusGrowthRate,
    withdrawalTaxRate,
  ]);

  const baseMultiplier = useMemo(() => {
    const r = (1 + inflationRate / 100) / (1 + corpusGrowthRate / 100);
    if (Math.abs(r - 1) < 0.0001) {
      return yearsToGo;
    }
    return (r * (1 - Math.pow(r, yearsToGo))) / (1 - r);
  }, [yearsToGo, inflationRate, corpusGrowthRate]);

  const multiplier = useMemo(() => {
    const taxFraction = Math.min(Math.max(withdrawalTaxRate, 0), 99) / 100;
    return taxFraction < 1
      ? baseMultiplier / (1 - taxFraction)
      : baseMultiplier;
  }, [baseMultiplier, withdrawalTaxRate]);

  const { totalNetExpenses, totalTaxes, totalWithdrawn } = useMemo(() => {
    let net = 0;
    let tax = 0;
    let gross = 0;
    for (const row of planData) {
      net += row.netExpense;
      tax += row.taxAmount;
      gross += row.withdrawnAmount;
    }
    return {
      totalNetExpenses: net,
      totalTaxes: tax,
      totalWithdrawn: gross,
    };
  }, [planData]);

  return (
    <BasicFinancialPlannerContext.Provider
      value={{
        corpusAmount,
        yearsToGo,
        annualExpense,
        inflationRate,
        corpusGrowthRate,
        withdrawalTaxRate,
        planData,
        multiplier,
        baseMultiplier,
        totalNetExpenses,
        totalTaxes,
        totalWithdrawn,
        setCorpusAmount,
        setYearsToGo,
        setAnnualExpense,
        setInflationRate,
        setCorpusGrowthRate,
        setWithdrawalTaxRate,
      }}
    >
      {children}
    </BasicFinancialPlannerContext.Provider>
  );
};

export const useBasicFinancialPlanner = () => {
  const context = useContext(BasicFinancialPlannerContext);
  if (!context) {
    throw new Error(
      "useBasicFinancialPlanner must be used within a BasicFinancialPlannerProvider",
    );
  }
  return context;
};
