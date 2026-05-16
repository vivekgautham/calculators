import React from "react";
import { TextField, Stack, Box, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from "@mui/material";
import { useRateOfGrowth, GrowthFrequency } from "./RateOfGrowthContext";

const Inputs: React.FC = () => {
  const {
    initialAmount,
    setInitialAmount,
    frequency,
    setFrequency,
    rate,
    setRate,
    timeSpan,
    setTimeSpan,
  } = useRateOfGrowth();

  const handleFrequencyChange = (event: SelectChangeEvent) => {
    setFrequency(event.target.value as GrowthFrequency);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <TextField
          label="Initial Amount"
          type="number"
          value={initialAmount}
          onChange={(e) => setInitialAmount(Number(e.target.value))}
          fullWidth
          size="small"
        />

        <FormControl fullWidth size="small">
          <InputLabel id="frequency-label">Frequency</InputLabel>
          <Select
            labelId="frequency-label"
            value={frequency}
            label="Frequency"
            onChange={handleFrequencyChange}
          >
            {Object.values(GrowthFrequency).map((freq) => (
              <MenuItem key={freq} value={freq}>
                {freq}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Rate (%)"
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          fullWidth
          size="small"
        />
        <TextField
          label="Time Span (Years)"
          type="number"
          value={timeSpan}
          onChange={(e) => setTimeSpan(Number(e.target.value))}
          fullWidth
          size="small"
        />
      </Stack>
    </Box>
  );
};

export default Inputs;
