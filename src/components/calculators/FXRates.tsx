import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";
import { FXRatesProvider } from "./fxrates/FXRatesContext";
import Inputs from "./fxrates/Inputs";
import FXRatesLineChart from "./fxrates/FXRatesLineChart";
import FXRatesTable from "./fxrates/FXRatesTable";

const FXRates: React.FunctionComponent<PanelProps> = (props) => {
  return (
    <FXRatesProvider>
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
          <FXRatesTable />
          <Paper elevation={3} sx={{ p: 1, minHeight: 450 }}>
            <FXRatesLineChart />
          </Paper>
        </Stack>
      </Box>
    </FXRatesProvider>
  );
};

export default FXRates;
