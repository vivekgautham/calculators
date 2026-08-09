import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { BalanceSheetProvider } from "./balancesheet/BalanceSheetContext";
import Inputs from "./balancesheet/Inputs";
import HealthGauge from "./balancesheet/HealthGauge";
import MetricsBreakdown from "./balancesheet/MetricsBreakdown";

const BalanceSheet: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item: { name: string; value: string }) =>
      item.name === props.name || item.value === "balancesheet",
  );

  return (
    <BalanceSheetProvider>
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
            {props.name || "Balance Sheet Health Calculator"}
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
            "Evaluate financial health across 5 critical balance sheet pillars: Cash Cushion, Debt Burden, Short-Term Solvency, Retained Earnings Track Record, and Asset Quality."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          <Inputs />
          <MetricsBreakdown />
          <HealthGauge />
        </Stack>
      </Box>
    </BalanceSheetProvider>
  );
};

export default BalanceSheet;
