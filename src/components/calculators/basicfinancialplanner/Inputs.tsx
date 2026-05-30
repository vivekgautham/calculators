import React from "react";
import { TextField, Stack, Box } from "@mui/material";
import { useBasicFinancialPlanner } from "./BasicFinancialPlannerContext";

const Inputs: React.FC = () => {
  const {
    corpusAmount,
    setCorpusAmount,
    yearsToGo,
    setYearsToGo,
    annualExpense,
    setAnnualExpense,
    inflationRate,
    setInflationRate,
    corpusGrowthRate,
    setCorpusGrowthRate,
  } = useBasicFinancialPlanner();

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ width: "100%" }}>
        <TextField
          label="Corpus Amount"
          type="number"
          value={corpusAmount}
          onChange={(e) => setCorpusAmount(Number(e.target.value))}
          fullWidth
          size="small"
        />
        <TextField
          label="Years To Go"
          type="number"
          value={yearsToGo}
          onChange={(e) => setYearsToGo(Number(e.target.value))}
          fullWidth
          size="small"
        />
        <TextField
          label="Annual Expense"
          type="number"
          value={annualExpense}
          onChange={(e) => setAnnualExpense(Number(e.target.value))}
          fullWidth
          size="small"
        />
        <TextField
          label="Inflation Rate (%)"
          type="number"
          value={inflationRate}
          onChange={(e) => setInflationRate(Number(e.target.value))}
          fullWidth
          size="small"
        />
        <TextField
          label="Corpus Growth Rate (%)"
          type="number"
          value={corpusGrowthRate}
          onChange={(e) => setCorpusGrowthRate(Number(e.target.value))}
          fullWidth
          size="small"
        />
      </Stack>
    </Box>
  );
};

export default Inputs;
