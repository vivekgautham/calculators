import React from "react";
import { Container, Typography, Box, Stack, Chip } from "@mui/material";
import { GrowthTargetProvider } from "./growthtarget/GrowthTargetContext";
import Inputs from "./growthtarget/Inputs";
import GrowthTable from "./growthtarget/GrowthTable";
import { PanelProps } from "../../types";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";

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
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ flexWrap: "wrap", mb: 2 }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#1a2035", margin: 0 }}
            >
              {name}
            </Typography>
            {CALCULATORS_AND_SIMULATORS.find(
              (item) => item.name === name,
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
          <Inputs />
          <GrowthTable />
        </Container>
      </Box>
    </GrowthTargetProvider>
  );
};

export default GrowthTarget;
