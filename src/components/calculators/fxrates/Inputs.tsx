import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack, Box, Autocomplete, TextField, Chip, ButtonGroup, Button } from "@mui/material";
import dayjs from "dayjs";
import { useFXRates } from "./FXRatesContext";
import { FX_SERIES_OPTIONS, DEFAULT_FX_SERIES } from "./constants";

const Inputs: React.FC = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedSeries,
    setSelectedSeries,
  } = useFXRates();

  const handleSelectDefault = () => {
    setSelectedSeries([...DEFAULT_FX_SERIES]);
  };

  const handleSelectMajor = () => {
    setSelectedSeries(
      FX_SERIES_OPTIONS.filter((s) => s.category === "Major Currencies"),
    );
  };

  const handleSelectEmerging = () => {
    setSelectedSeries(
      FX_SERIES_OPTIONS.filter(
        (s) => s.category === "Emerging Market Currencies",
      ),
    );
  };

  const handleSelectAll = () => {
    setSelectedSeries([...FX_SERIES_OPTIONS]);
  };

  const handleQuickRange = (years: number | "max") => {
    const end = dayjs();
    setEndDate(end);
    if (years === "max") {
      setStartDate(dayjs("2006-01-01"));
    } else {
      setStartDate(end.subtract(years, "year"));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1 }}>
        <Stack spacing={2}>
          {/* Row 1: Date Range & Quick Range Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => newValue && setStartDate(newValue)}
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 160 } },
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => newValue && setEndDate(newValue)}
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 160 } },
                }}
              />
            </Stack>

            <ButtonGroup size="small" variant="outlined">
              <Button onClick={() => handleQuickRange(1)}>1Y</Button>
              <Button onClick={() => handleQuickRange(3)}>3Y</Button>
              <Button onClick={() => handleQuickRange(5)}>5Y</Button>
              <Button onClick={() => handleQuickRange(10)}>10Y</Button>
              <Button onClick={() => handleQuickRange("max")}>Max</Button>
            </ButtonGroup>
          </Stack>

          {/* Row 2: Select Currencies (Own Row) */}
          <Box sx={{ width: "100%" }}>
            <Autocomplete
              multiple
              options={FX_SERIES_OPTIONS}
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
                  label="Select Currencies (vs USD)"
                  placeholder="Choose currency pairs..."
                />
              )}
              sx={{ width: "100%" }}
            />
          </Box>

          {/* Row 3: Preset Filter Chips */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="Popular Currencies"
              size="small"
              clickable
              color={
                selectedSeries.length === DEFAULT_FX_SERIES.length &&
                selectedSeries.every((s) =>
                  DEFAULT_FX_SERIES.some((d) => d.id === s.id),
                )
                  ? "primary"
                  : "default"
              }
              onClick={handleSelectDefault}
            />
            <Chip
              label="Major Currencies (G10)"
              size="small"
              clickable
              variant="outlined"
              onClick={handleSelectMajor}
            />
            <Chip
              label="Emerging Market Currencies"
              size="small"
              clickable
              variant="outlined"
              onClick={handleSelectEmerging}
            />
            <Chip
              label="All Currencies"
              size="small"
              clickable
              variant="outlined"
              color={
                selectedSeries.length === FX_SERIES_OPTIONS.length
                  ? "primary"
                  : "default"
              }
              onClick={handleSelectAll}
            />
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default Inputs;
