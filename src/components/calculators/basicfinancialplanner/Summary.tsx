import React from "react";
import { Alert, Typography, Box } from "@mui/material";
import { useBasicFinancialPlanner } from "./BasicFinancialPlannerContext";

const Summary: React.FC = () => {
  const { yearsToGo, multiplier, inflationRate, corpusGrowthRate } =
    useBasicFinancialPlanner();

  return (
    <Box>
      <Alert
        severity="info"
        sx={{
          border: "1px solid #2196f3",
          backgroundColor: "#e3f2fd",
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          When you have <strong>{yearsToGo}</strong> years to go, your corpus
          amount needs to be <strong>{multiplier.toFixed(2)}</strong> times the
          Annual Expense if we have <strong>{inflationRate}%</strong> YoY
          Inflation and <strong>{corpusGrowthRate}%</strong> YoY Corpus Growth
          Rate for you to not go into debt ever.
        </Typography>
      </Alert>
    </Box>
  );
};

export default Summary;
