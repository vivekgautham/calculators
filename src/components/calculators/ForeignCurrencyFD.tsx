import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { ForeignCurrencyFDProvider } from "./foreigncurrencyfd/ForeignCurrencyFDContext";
import Inputs from "./foreigncurrencyfd/Inputs";
import SummaryCards from "./foreigncurrencyfd/SummaryCards";
import ScheduleTable from "./foreigncurrencyfd/ScheduleTable";

const ForeignCurrencyFD: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item) => item.name === props.name || item.value === "foreigncurrencyfd",
  );

  return (
    <ForeignCurrencyFDProvider>
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
            {props.name || "Foreign Currency Fixed Deposit"}
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
            "Calculate net yields and fee drag for Foreign Currency Fixed Deposits considering 3 creation spreads (x, y, z bps), semi-annual interest payouts with servicing spreads (a, b bps), and maturity redemption spreads (u, v bps)."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          <Inputs />
          <ScheduleTable />
          <SummaryCards />
        </Stack>
      </Box>
    </ForeignCurrencyFDProvider>
  );
};

export default ForeignCurrencyFD;
