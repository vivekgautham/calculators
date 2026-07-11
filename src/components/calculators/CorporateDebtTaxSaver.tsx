import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { CorporateDebtTaxSaverProvider } from "./corporatedebttaxsaver/CorporateDebtTaxSaverContext";
import Inputs from "./corporatedebttaxsaver/Inputs";
import Results from "./corporatedebttaxsaver/Results";

const CorporateDebtTaxSaver: React.FunctionComponent<PanelProps> = (props) => {
  return (
    <CorporateDebtTaxSaverProvider>
      <Box
        sx={{
          width: "100%",
          p: 3,
          height: "100vh",
          overflowY: "auto",
          textAlign: "left",
        }}
      >
        {/* Header Block with Color-coded Tags */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: "wrap", mb: 1 }}>
          <Header as="h2" textAlign="left" style={{ margin: 0 }}>
            {props.name}
          </Header>
          {CALCULATORS_AND_SIMULATORS.find((item) => item.name === props.name)
            ?.tags.map((tag) => {
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
        <Header as="h5" textAlign="left" style={{ marginTop: 8, color: "#666" }}>
          {
            CALCULATORS_AND_SIMULATORS.find((item) => item.name === props.name)
              ?.description
          }
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          <Inputs />
          <Results />
        </Stack>
      </Box>
    </CorporateDebtTaxSaverProvider>
  );
};

export default CorporateDebtTaxSaver;
