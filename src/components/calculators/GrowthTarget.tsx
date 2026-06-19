import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { GrowthTargetProvider } from "./growthtarget/GrowthTargetContext";
import Inputs from "./growthtarget/Inputs";
import GrowthTable from "./growthtarget/GrowthTable";
import { PanelProps } from "../../types";

const GrowthTarget: React.FC<PanelProps> = ({ name }) => {
  return (
    <GrowthTargetProvider>
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#f4f6f8",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1a2035" }}
          >
            {name}
          </Typography>
          <Inputs />
          <GrowthTable />
        </Container>
      </Box>
    </GrowthTargetProvider>
  );
};

export default GrowthTarget;
