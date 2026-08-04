import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip, Grid } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { DoublingGrowthProvider } from "./doublinggrowth/DoublingGrowthContext";
import Inputs from "./doublinggrowth/Inputs";
import LiveSimulationControl from "./doublinggrowth/LiveSimulationControl";
import ResultsSummary from "./doublinggrowth/ResultsSummary";
import GrowthChart from "./doublinggrowth/GrowthChart";
import GrowthTable from "./doublinggrowth/GrowthTable";

const DoublingGrowth: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item: { name: string; value: string }) =>
      item.name === props.name || item.value === "doublinggrowth",
  );

  return (
    <DoublingGrowthProvider>
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
            {props.name || "Exponential Doubling Growth Simulator"}
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
            "Start with an initial number, double (or compound) it at every unit of time, and visualize its exponential growth curve over time on linear and log scale plots."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          <Inputs />
          <LiveSimulationControl />
          <ResultsSummary />

          {/* Full-width Live Growth Chart */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <GrowthChart />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <GrowthTable />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </DoublingGrowthProvider>
  );
};

export default DoublingGrowth;
