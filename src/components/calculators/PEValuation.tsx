import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { PEValuationProvider } from "./pevaluation/PEValuationContext";
import Inputs from "./pevaluation/Inputs";
import SummaryCards from "./pevaluation/SummaryCards";
import PEChart from "./pevaluation/PEChart";
import QuarterlyBreakdownTable from "./pevaluation/QuarterlyBreakdownTable";

export const PEValuation: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item) => item.name === props.name || item.value === "pevaluation",
  );

  return (
    <PEValuationProvider>
      <Box
        sx={{
          width: "100%",
          p: 3,
          height: "100vh",
          overflowY: "auto",
          textAlign: "left",
          bgcolor: "#f4f6f8",
        }}
      >
        {/* Header Block with Color-coded Tags */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexWrap: "wrap", mb: 1 }}
        >
          <Header as="h2" textAlign="left" style={{ margin: 0 }}>
            {props.name || "TTM P/E & Forward P/E Valuation"}
          </Header>
          {calculatorMeta?.tags.map((tag: string) => {
            const styles = getTagStyles(tag);
            return (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: styles.backgroundColor,
                  color: styles.color,
                  borderColor: styles.borderColor,
                }}
              />
            );
          })}
        </Stack>
        <Header
          as="h5"
          textAlign="left"
          style={{ marginTop: 8, color: "#666" }}
        >
          {calculatorMeta?.description ||
            "Analyze stock valuations by comparing Trailing Twelve Months (TTM) P/E ratios against Forward Next Twelve Months (NTM) P/E multiples, earnings yield, PEG ratios, and multiple contraction/expansion."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 8 }}>
          <Inputs />
          <SummaryCards />
          <PEChart />
          <QuarterlyBreakdownTable />
        </Stack>
      </Box>
    </PEValuationProvider>
  );
};

export default PEValuation;
