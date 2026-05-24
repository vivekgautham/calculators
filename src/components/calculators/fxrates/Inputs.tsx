import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
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
          <DateRangePicker
            localeText={{ start: 'Start Date', end: 'End Date' }}
            value={[startDate, endDate]}
            onChange={(newValue) => {
              setStartDate(newValue[0]);
              setEndDate(newValue[1]);
            }}
            slots={{ field: SingleInputDateRangeField }}
            sx={{ width: 300 }}
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
