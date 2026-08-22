import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack, Box, Autocomplete, TextField, Chip } from "@mui/material";
import { useFedRates } from "./FedRatesContext";
import { FED_SERIES_OPTIONS } from "./constants";

const Inputs: React.FC = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedSeries,
    setSelectedSeries,
  } = useFedRates();

  const handleSelectAll = () => {
    setSelectedSeries([...FED_SERIES_OPTIONS]);
  };

  const handleSelectKeyTreasuries = () => {
    setSelectedSeries(
      FED_SERIES_OPTIONS.filter((s) =>
        ["DGS2", "DGS10", "DGS30"].includes(s.id),
      ),
    );
  };

  const handleSelectAllTreasuries = () => {
    setSelectedSeries(
      FED_SERIES_OPTIONS.filter((s) => s.category === "Treasury Yields"),
    );
  };

  const handleSelectFedRates = () => {
    setSelectedSeries(
      FED_SERIES_OPTIONS.filter((s) => s.category === "Fed Policy Rates"),
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1 }}>
        <Stack spacing={2}>
          {/* Row 1: Date Range */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
              slotProps={{
                textField: { size: "small", sx: { minWidth: 180 } },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
              slotProps={{
                textField: { size: "small", sx: { minWidth: 180 } },
              }}
            />
          </Stack>

          {/* Row 2: Select Yields / Rates (Own Row) */}
          <Box sx={{ width: "100%" }}>
            <Autocomplete
              multiple
              options={FED_SERIES_OPTIONS}
              groupBy={(option) => option.category}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedSeries}
              onChange={(_, newValue) => setSelectedSeries(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  label="Select Yields / Rates"
                  placeholder="Choose series..."
                />
              )}
              sx={{ width: "100%" }}
            />
          </Box>

          {/* Row 3: Preset Filter Chips */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="All Benchmarks"
              size="small"
              clickable
              color={
                selectedSeries.length === FED_SERIES_OPTIONS.length
                  ? "primary"
                  : "default"
              }
              onClick={handleSelectAll}
            />
            <Chip
              label="Key Treasuries (2Y, 10Y, 30Y)"
              size="small"
              clickable
              variant="outlined"
              onClick={handleSelectKeyTreasuries}
            />
            <Chip
              label="All Treasury Yields"
              size="small"
              clickable
              variant="outlined"
              onClick={handleSelectAllTreasuries}
            />
            <Chip
              label="Fed Rates (EFFR, SOFR)"
              size="small"
              clickable
              variant="outlined"
              onClick={handleSelectFedRates}
            />
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default Inputs;
