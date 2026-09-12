import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { PercentChangeProvider } from "./percentchange/PercentChangeContext";
import Inputs from "./percentchange/Inputs";
import PercentChangeBarChart from "./percentchange/PercentChangeBarChart";
import ReturnToBaselineCard from "./percentchange/ReturnToBaselineCard";

const PercentChange: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item: { name: string; value: string }) =>
      item.name === props.name || item.value === "percentchange",
  );

  return (
    <PercentChangeProvider>
      <Box
        sx={{
          width: "100%",
          p: 3,
          height: "100vh",
          overflowY: "auto",
          textAlign: "left",
          bgcolor: "#f4f6f8",
        }}
      >
        {/* Header Block with Color-coded Tags */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexWrap: "wrap", mb: 1 }}
        >
          <Header as="h2" textAlign="left" style={{ margin: 0 }}>
            {props.name || "Percent Change Calculator"}
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

        <Header
          as="h5"
          textAlign="left"
          style={{ marginTop: 8, color: "#666" }}
        >
          {calculatorMeta?.description ||
            "Start with an initial index, apply sequential positive and negative percent changes, and visualize how the value rises and falls on an interactive bar chart."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 6 }}>
          <Inputs />
          <PercentChangeBarChart />
          <ReturnToBaselineCard />
        </Stack>
      </Box>
    </PercentChangeProvider>
  );
};

export default PercentChange;
