import React from "react";
import { TextField, Stack, Paper, Typography } from "@mui/material";
import { useGrowthTarget } from "./GrowthTargetContext";

const Inputs: React.FC = () => {
  const {
    currentAmount,
    setCurrentAmount,
    targetAmount,
    setTargetAmount,
    years,
    setYears,
  } = useGrowthTarget();

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Growth Parameters
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Current Amount"
          type="number"
          variant="outlined"
          fullWidth
          value={currentAmount}
          onChange={(e) => setCurrentAmount(Number(e.target.value))}
        />
        <TextField
          label="Target Amount"
          type="number"
          variant="outlined"
          fullWidth
          value={targetAmount}
          onChange={(e) => setTargetAmount(Number(e.target.value))}
        />
        <TextField
          label="Time Period (Years)"
          type="number"
          variant="outlined"
          fullWidth
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />
      </Stack>
    </Paper>
  );
};

export default Inputs;
