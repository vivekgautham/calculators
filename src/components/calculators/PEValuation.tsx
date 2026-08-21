import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { PEValuationProvider } from "./pevaluation/PEValuationContext";
import Inputs from "./pevaluation/Inputs";
import SummaryCards from "./pevaluation/SummaryCards";
import PEChart from "./pevaluation/PEChart";
import QuarterlyBreakdownTable from "./pevaluation/QuarterlyBreakdownTable";

export const PEValuationContent: React.FC = () => {
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "800", color: "#0f172a", mb: 1 }}
        >
          TTM P/E & Forward P/E Valuation Calculator
        </Typography>
        <Typography variant="body1" sx={{ color: "#475569" }}>
          Analyze stock valuations by comparing Trailing Twelve Months (TTM) P/E
          ratios against Forward Next Twelve Months (NTM) P/E multiples,
          earnings yield, PEG ratios, and multiple contraction/expansion.
        </Typography>
      </Box>

      <Inputs />
      <SummaryCards />
      <PEChart />
      <QuarterlyBreakdownTable />
    </Box>
  );
};

export const PEValuation: React.FC = () => {
  return (
    <PEValuationProvider>
      <Container maxWidth="xl" disableGutters>
        <PEValuationContent />
      </Container>
    </PEValuationProvider>
  );
};

export default PEValuation;
