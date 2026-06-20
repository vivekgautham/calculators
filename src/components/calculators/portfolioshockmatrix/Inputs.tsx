import React from "react";
import { TextField, Box, Typography, Grid } from "@mui/material";
import { usePortfolioShockMatrix } from "./PortfolioShockMatrixContext";

const Inputs: React.FC = () => {
  const { initialCorpus, currentCorpus, setInitialCorpus, setCurrentCorpus } =
    usePortfolioShockMatrix();

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        Portfolio Parameters
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Initial Corpus Amount ($)"
            type="number"
            value={initialCorpus}
            onChange={(e) => setInitialCorpus(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Current Corpus Amount ($)"
            type="number"
            value={currentCorpus}
            onChange={(e) => setCurrentCorpus(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inputs;
