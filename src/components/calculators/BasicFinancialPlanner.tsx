import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";
import { BasicFinancialPlannerProvider } from "./basicfinancialplanner/BasicFinancialPlannerContext";
import Inputs from "./basicfinancialplanner/Inputs";
import PlanTable from "./basicfinancialplanner/PlanTable";
import PlanBarChart from "./basicfinancialplanner/PlanBarChart";
import Summary from "./basicfinancialplanner/Summary";

const BasicFinancialPlanner: React.FunctionComponent<PanelProps> = (props) => {
  return (
    <BasicFinancialPlannerProvider>
      <Box
        sx={{
          width: "100%",
          p: 2,
          height: "100vh",
          overflowY: "auto",
          textAlign: "left",
        }}
      >
        <Header as="h2" textAlign="left">
          {props.name}
        </Header>
        <Header as="h5" textAlign="left">
          {
            CALCULATORS_AND_SIMULATORS.find((item) => item.name === props.name)
              ?.description
          }
        </Header>

        <Stack spacing={3} sx={{ mt: 2, pb: 4 }}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Inputs />
          </Paper>
          <Summary />
          <Paper elevation={3} sx={{ p: 1, minHeight: 400 }}>
            <PlanBarChart />
          </Paper>
          <PlanTable />
        </Stack>
      </Box>
    </BasicFinancialPlannerProvider>
  );
};

export default BasicFinancialPlanner;
