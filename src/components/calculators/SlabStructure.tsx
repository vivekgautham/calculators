import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { SlabStructureProvider } from "./slabstructure/SlabStructureContext";
import Inputs from "./slabstructure/Inputs";
import Results from "./slabstructure/Results";
import SlabChart from "./slabstructure/SlabChart";
import SlabTable from "./slabstructure/SlabTable";

const SlabStructure: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item) => item.name === props.name || item.value === "slabstructure",
  );

  return (
    <SlabStructureProvider>
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
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexWrap: "wrap", mb: 1 }}
        >
          <Header as="h2" textAlign="left" style={{ margin: 0 }}>
            {props.name || "Slab Structure"}
          </Header>
          {calculatorMeta?.tags.map((tag) => {
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
            "Calculate GST and fee slab structures for transactions with interactive charts from ₹1 Lakh to ₹20 Lakh."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          <Inputs />
          <Results />
          <SlabChart />
          <SlabTable />
        </Stack>
      </Box>
    </SlabStructureProvider>
  );
};

export default SlabStructure;
