import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { SavingsPowerProvider } from "./savingspower/SavingsPowerContext";
import Inputs from "./savingspower/Inputs";
import Results from "./savingspower/Results";

const SavingsPower: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item: { name: string; value: string }) => item.name === props.name || item.value === "savingspower",
  );

  return (
    <SavingsPowerProvider>
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
            {props.name || "Savings Power Comparison"}
          </Header>
          {calculatorMeta?.tags.map((tag: string) => {
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
          {calculatorMeta?.description ||
            "Compare the compounding power of savings and calculate the pre-tax salary equivalence of after-tax savings differences."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          <Inputs />
          <Results />
        </Stack>
      </Box>
    </SavingsPowerProvider>
  );
};

export default SavingsPower;
