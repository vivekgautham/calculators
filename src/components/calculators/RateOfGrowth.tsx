import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";
import { RateOfGrowthProvider } from "./rateofgrowth/RateOfGrowthContext";
import Inputs from "./rateofgrowth/Inputs";
import GrowthLineChart from "./rateofgrowth/GrowthLineChart";

const RateOfGrowth: React.FunctionComponent<PanelProps> = (props) => {
  return (
    <RateOfGrowthProvider>
      <Box sx={{ width: '60vW', p: 1 }}>
        <Header as="h2" textAlign="left">
          {props.name}
        </Header>
        <Header as="h5" textAlign="left">
          {
            CALCULATORS_AND_SIMULATORS.find((item) => item.name === props.name)
              ?.description
          }
        </Header>

        <Stack spacing={3} sx={{ mt: 2 }}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Inputs />
          </Paper>
          <Paper elevation={3} sx={{ p: 1, minHeight: 450 }}>
            <GrowthLineChart />
          </Paper>
        </Stack>
      </Box>
    </RateOfGrowthProvider>
  );
};

export default RateOfGrowth;
