import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack, Grid } from "@mui/material";
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

          {/* Visualization and Matrix Table */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                <ShockTable />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                <ShockChart />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </PortfolioShockMatrixProvider>
  );
};

export default PortfolioShockMatrix;
