import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { DailyReserveRunwayProvider } from "./dailyreserverunway/DailyReserveRunwayContext";
import Inputs from "./dailyreserverunway/Inputs";
import RunwaySummaryCards from "./dailyreserverunway/RunwaySummaryCards";

const DailyReserveRunway: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item: { name: string; value: string }) =>
      item.name === props.name || item.value === "dailyreserverunway",
  );

  return (
    <DailyReserveRunwayProvider>
      <Box
        sx={{
          width: "100%",
          p: { xs: 2, md: 3 },
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
            {props.name || "Daily Reserve Runway Calculator"}
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
            "Estimate your exact daily spendable allowance and burn runway from total reserve dollars, start date, and target horizon in years, factoring in leap years, investment yields, inflation, and interactive depletion schedules."}
        </Header>

        {/* Content Modules: 3 parameters + 1 result card */}
        <Stack spacing={3} sx={{ mt: 3, pb: 8, maxWidth: "1050px" }}>
          <Inputs />
          <RunwaySummaryCards />
        </Stack>
      </Box>
    </DailyReserveRunwayProvider>
  );
};

export default DailyReserveRunway;
