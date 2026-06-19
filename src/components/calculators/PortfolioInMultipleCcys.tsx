import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack, Typography } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";

const PortfolioInMultipleCcys: React.FunctionComponent<PanelProps> = (
  props,
) => {
  return (
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
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Portfolio in Multiple Currencies
          </Typography>
          <Typography variant="body1">
            This is a placeholder for the Portfolio in Multiple Currencies
            calculator. Requirements and functionality will be defined and
            implemented next.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default PortfolioInMultipleCcys;
