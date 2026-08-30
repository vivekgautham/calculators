import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { AreaConverterProvider } from "./areaconverter/AreaConverterContext";
import Inputs from "./areaconverter/Inputs";
import PrimaryCards from "./areaconverter/PrimaryCards";
import VisualEquivalents from "./areaconverter/VisualEquivalents";
import ConversionMatrix from "./areaconverter/ConversionMatrix";

export const AreaConverter: React.FC<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item) => item.name === props.name || item.value === "areaconverter",
  );

  return (
    <AreaConverterProvider>
      <Box
        sx={{
          width: "100%",
          p: { xs: 2, md: 3 },
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
            {props.name || "Area Conversion Calculator"}
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
            "Convert land and surface areas seamlessly across Hectares, Acres, Cents (0.01 acre), Square Feet, Square Meters, Square Kilometers, and Square Miles with instant outputs and plot dimension estimates."}
        </Header>

        {/* Calculator Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 8 }}>
          <Inputs />
          <PrimaryCards />
          <VisualEquivalents />
          <ConversionMatrix />
        </Stack>
      </Box>
    </AreaConverterProvider>
  );
};

export default AreaConverter;
