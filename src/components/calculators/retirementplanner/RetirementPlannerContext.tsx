import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export interface RetirementYearData {
  year: number;
  age: number;
  phase: "Accumulation" | "Retirement";
  annualContribution: number;
  annualWithdrawal: number;
  investmentEarnings: number;
  endingBalance: number;
}

interface RetirementPlannerContextType {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentNestEgg: number;
  monthlyContribution: number;
  contributionIncreaseRate: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  inflationRate: number;
  monthlyExpensesRetirement: number;

  setCurrentAge: (val: number) => void;
  setRetirementAge: (val: number) => void;
  setLifeExpectancy: (val: number) => void;
  setCurrentNestEgg: (val: number) => void;
  setMonthlyContribution: (val: number) => void;
  setContributionIncreaseRate: (val: number) => void;
  setPreRetirementReturn: (val: number) => void;
  setPostRetirementReturn: (val: number) => void;
  setInflationRate: (val: number) => void;
  setMonthlyExpensesRetirement: (val: number) => void;

  yearlyData: RetirementYearData[];
  retirementCorpus: number;
  depletionAge: number | null;
}

const RetirementPlannerContext = createContext<
  RetirementPlannerContextType | undefined
>(undefined);

export const RetirementPlannerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(45);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(65);
  const [currentNestEgg, setCurrentNestEgg] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2000);
  const [contributionIncreaseRate, setContributionIncreaseRate] =
    useState<number>(0);
  const [preRetirementReturn, setPreRetirementReturn] = useState<number>(10);
  const [postRetirementReturn, setPostRetirementReturn] = useState<number>(5);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [monthlyExpensesRetirement, setMonthlyExpensesRetirement] =
    useState<number>(2000);

  const { yearlyData, retirementCorpus, depletionAge } = useMemo(() => {
    const data: RetirementYearData[] = [];
    const totalYears = Math.max(0, lifeExpectancy - currentAge);
    const accumulationYears = Math.max(0, retirementAge - currentAge);

    let balance = currentNestEgg;
    let currentMonthlyContrib = monthlyContribution;
    let depletionAgeVal: number | null = null;
    let corpusAtRetirement = 0;

    // Year 0 (Current state)
    data.push({
      year: 0,
      age: currentAge,
      phase: "Accumulation",
      annualContribution: 0,
      annualWithdrawal: 0,
      investmentEarnings: 0,
      endingBalance: balance,
    });

    const preRetirementMonthlyRate = preRetirementReturn / 100 / 12;
    const postRetirementMonthlyRate = postRetirementReturn / 100 / 12;

    for (let year = 1; year <= totalYears; year++) {
      const currentAgeOfSimulation = currentAge + year;
      const isAccumulation = currentAgeOfSimulation <= retirementAge;

      let annualContribution = 0;
      let annualWithdrawal = 0;
      let annualEarnings = 0;

      // Increment monthly contribution by the increase rate each year
      if (year > 1 && isAccumulation) {
        currentMonthlyContrib =
          currentMonthlyContrib * (1 + contributionIncreaseRate / 100);
      }

      // Simulate 12 months for this year
      for (let month = 1; month <= 12; month++) {
        // If accumulation phase
        if (isAccumulation) {
          const interest = balance * preRetirementMonthlyRate;
          annualEarnings += interest;
          balance += interest + currentMonthlyContrib;
          annualContribution += currentMonthlyContrib;
        } else {
          // Decumulation / Retirement phase
          const interest = balance * postRetirementMonthlyRate;
          annualEarnings += interest;

          // Inflated monthly withdrawal
          // (assuming inflation compounds annually for withdrawal amounts)
          const inflatedMonthlyWithdrawal =
            monthlyExpensesRetirement *
            Math.pow(1 + inflationRate / 100, year - 1 - accumulationYears);

          annualWithdrawal += inflatedMonthlyWithdrawal;
          balance += interest - inflatedMonthlyWithdrawal;
        }

        // If balance falls below 0, clip to 0 and mark depletion age
        if (balance < 0) {
          balance = 0;
          if (depletionAgeVal === null) {
            depletionAgeVal = currentAgeOfSimulation;
          }
        }
      }

      // Record corpus at the exact moment of retirement
      if (currentAgeOfSimulation === retirementAge) {
        corpusAtRetirement = balance;
      }

      data.push({
        year,
        age: currentAgeOfSimulation,
        phase: isAccumulation ? "Accumulation" : "Retirement",
        annualContribution,
        annualWithdrawal,
        investmentEarnings: annualEarnings,
        endingBalance: balance,
      });
    }

    return {
      yearlyData: data,
      retirementCorpus: corpusAtRetirement,
      depletionAge: depletionAgeVal,
    };
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentNestEgg,
    monthlyContribution,
    contributionIncreaseRate,
    preRetirementReturn,
    postRetirementReturn,
    inflationRate,
    monthlyExpensesRetirement,
  ]);

  return (
    <RetirementPlannerContext.Provider
      value={{
        currentAge,
        retirementAge,
        lifeExpectancy,
        currentNestEgg,
        monthlyContribution,
        contributionIncreaseRate,
        preRetirementReturn,
        postRetirementReturn,
        inflationRate,
        monthlyExpensesRetirement,
        setCurrentAge,
        setRetirementAge,
        setLifeExpectancy,
        setCurrentNestEgg,
        setMonthlyContribution,
        setContributionIncreaseRate,
        setPreRetirementReturn,
        setPostRetirementReturn,
        setInflationRate,
        setMonthlyExpensesRetirement,
        yearlyData,
        retirementCorpus,
        depletionAge,
      }}
    >
      {children}
    </RetirementPlannerContext.Provider>
  );
};

export const useRetirementPlanner = () => {
  const context = useContext(RetirementPlannerContext);
  if (!context) {
    throw new Error(
      "useRetirementPlanner must be used within a RetirementPlannerProvider",
    );
  }
  return context;
};
