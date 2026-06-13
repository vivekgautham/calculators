import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";
import { BlendedInvestmentProvider } from "./blendedinvestment/BlendedInvestmentContext";
import Inputs from "./blendedinvestment/Inputs";
import BlendedBarChart from "./blendedinvestment/BlendedBarChart";
import BlendedPieCharts from "./blendedinvestment/BlendedPieCharts";

const BlendedInvestment: React.FunctionComponent<PanelProps> = (props) => {
  return (
    <BlendedInvestmentProvider>
      <Box sx={{
        width: '100%',
        p: 2,
        height: '100vh',
        overflowY: 'auto',
        textAlign: 'left'
      }}>
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
          <Paper elevation={3} sx={{ p: 2 }}>
            <Inputs />
          </Paper>
          <Paper elevation={3} sx={{ p: 2 }}>
            <BlendedPieCharts />
          </Paper>
          <Paper elevation={3} sx={{ p: 2, minHeight: 450 }}>
            <BlendedBarChart />
          </Paper>
        </Stack>
      </Box>
    </BlendedInvestmentProvider>
  );
};

export default BlendedInvestment;
