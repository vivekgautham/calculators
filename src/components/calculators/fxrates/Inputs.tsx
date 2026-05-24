import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack, Box } from "@mui/material";
import { useFXRates } from "./FXRatesContext";

const Inputs: React.FC = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useFXRates();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={3}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default Inputs;
