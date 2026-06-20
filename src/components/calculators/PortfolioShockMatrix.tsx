import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";
import { PortfolioShockMatrixProvider } from "./portfolioshockmatrix/PortfolioShockMatrixContext";
import Inputs from "./portfolioshockmatrix/Inputs";
import ShockTable from "./portfolioshockmatrix/ShockTable";
import ShockChart from "./portfolioshockmatrix/ShockChart";

const PortfolioShockMatrix: React.FunctionComponent<PanelProps> = (props) => {
  return (
    <PortfolioShockMatrixProvider>
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
          {/* Input Panel */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Inputs />
          </Paper>

          {/* Visualization Chart */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <ShockChart />
          </Paper>

          {/* Scenario Shock Matrix Table */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <ShockTable />
          </Paper>
        </Stack>
      </Box>
    </PortfolioShockMatrixProvider>
  );
};

export default PortfolioShockMatrix;
