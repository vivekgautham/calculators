import React from "react";
import { Header } from "semantic-ui-react";
import { Paper, Box, Stack } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";
import { ProgressiveTaxProvider } from "./progressivetax/ProgressiveTaxContext";
import Inputs from "./progressivetax/Inputs";
import TaxSummary from "./progressivetax/TaxSummary";
import TaxTable from "./progressivetax/TaxTable";

const ProgressiveTax: React.FunctionComponent<PanelProps> = (props) => {
  return (
    <ProgressiveTaxProvider>
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
          <Paper elevation={3} sx={{ p: 2 }}>
            <Inputs />
          </Paper>
          <TaxSummary />
          <Paper elevation={3} sx={{ p: 1 }}>
            <TaxTable />
          </Paper>
        </Stack>
      </Box>
    </ProgressiveTaxProvider>
  );
};

export default ProgressiveTax;
