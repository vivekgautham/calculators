import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
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
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexWrap: "wrap", mb: 1 }}
        >
          <Header as="h2" textAlign="left" style={{ margin: 0 }}>
            {props.name}
          </Header>
          {CALCULATORS_AND_SIMULATORS.find(
            (item) => item.name === props.name,
          )?.tags.map((tag) => {
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
