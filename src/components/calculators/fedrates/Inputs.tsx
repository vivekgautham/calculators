import React from "react";
import { Stack, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFedRates } from "./FedRatesContext";
import { Dayjs } from "dayjs";

const Inputs: React.FC = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useFedRates();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: Dayjs | null) => newValue && setStartDate(newValue)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: Dayjs | null) => newValue && setEndDate(newValue)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default Inputs;
