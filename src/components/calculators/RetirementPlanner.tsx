import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";
import { RetirementPlannerProvider } from "./retirementplanner/RetirementPlannerContext";
import Inputs from "./retirementplanner/Inputs";
import Summary from "./retirementplanner/Summary";
import RetirementChart from "./retirementplanner/RetirementChart";
import RetirementTable from "./retirementplanner/RetirementTable";

const RetirementPlanner: React.FC<PanelProps> = (props) => {
  return (
    <RetirementPlannerProvider>
      <Box
        sx={{
          width: "100%",
          p: 3,
          height: "100vh",
          overflowY: "auto",
          textAlign: "left",
        }}
      >
        <Header as="h2" textAlign="left" style={{ margin: 0 }}>
          {props.name}
        </Header>
        <Header
          as="h5"
          textAlign="left"
          style={{ marginTop: 8, color: "#666" }}
        >
          {
            CALCULATORS_AND_SIMULATORS.find((item) => item.name === props.name)
              ?.description
          }
        </Header>

        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          {/* Inputs Section */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Inputs />
          </Paper>

          {/* Summary Cards */}
          <Summary />

          {/* Chart Section */}
          <Paper elevation={3} sx={{ p: 2, minHeight: 400 }}>
            <RetirementChart />
          </Paper>

          {/* Table Section */}
          <RetirementTable />
        </Stack>
      </Box>
    </RetirementPlannerProvider>
  );
};

export default RetirementPlanner;
