import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { Stack, Box } from "@mui/material";
import React from "react";
import { useFXRates } from "./FXRatesContext";

const Inputs: React.FC = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useFXRates();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={3}>
          <DateRangePicker
            localeText={{ start: 'Start Date', end: 'End Date' }}
            value={[startDate, endDate]}
            onChange={(newValue) => {
              setStartDate(newValue[0]);
              setEndDate(newValue[1]);
            }}
            slots={{ field: SingleInputDateRangeField }}
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default Inputs;
