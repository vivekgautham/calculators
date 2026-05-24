import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack, Box, Autocomplete, TextField } from "@mui/material";
import React from "react";
import { useFXRates } from "./FXRatesContext";
import { SERIES_NAMES } from "./constants";

const Inputs: React.FC = () => {
  const { startDate, setStartDate, endDate, setEndDate, selectedSeries, setSelectedSeries } = useFXRates();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ width: 200 }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ width: 200 }}
          />
          <Autocomplete
            multiple
            options={SERIES_NAMES}
            value={selectedSeries}
            onChange={(_, newValue) => setSelectedSeries(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Series" placeholder="Currencies" />
            )}
            sx={{ flexGrow: 1, minWidth: 300 }}
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default Inputs;
