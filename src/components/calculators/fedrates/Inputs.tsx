import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Stack,
  Box,
  Autocomplete,
  TextField,
  Chip,
  ButtonGroup,
  Button,
  Paper,
  Typography,
  Checkbox,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import dayjs from "dayjs";
import { useFedRates } from "./FedRatesContext";
import { FED_SERIES_OPTIONS, SeriesOption } from "./constants";

const checkedIcon = <CheckBoxIcon fontSize="small" sx={{ color: "#0284c7" }} />;
const icon = (
  <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: "#94a3b8" }} />
);

const Inputs: React.FC = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedSeries,
    setSelectedSeries,
  } = useFedRates();

  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

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

  const handleClearAll = () => {
    setSelectedSeries([]);
    setIsTagsExpanded(false);
  };

  const handleQuickRange = (years: number | "max") => {
    const end = dayjs();
    setEndDate(end);
    if (years === "max") {
      setStartDate(dayjs("1962-01-01"));
    } else {
      setStartDate(end.subtract(years, "year"));
    }
  };

  const isAllSelected = selectedSeries.length === FED_SERIES_OPTIONS.length;
  const isKeyTreasuriesSelected =
    selectedSeries.length === 3 &&
    ["DGS2", "DGS10", "DGS30"].every((id) =>
      selectedSeries.some((s) => s.id === id),
    );
  const isAllTreasuriesSelected =
    selectedSeries.length === 6 &&
    selectedSeries.every((s) => s.category === "Treasury Yields");
  const isFedRatesSelected =
    selectedSeries.length === 2 &&
    selectedSeries.every((s) => s.category === "Fed Policy Rates");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Stack spacing={2.5}>
          {/* Row 1: Date Pickers & Quick Range */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
          >
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
                  textField: {
                    size: "small",
                    sx: {
                      minWidth: 170,
                      bgcolor: "#ffffff",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    },
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => newValue && setEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      minWidth: 170,
                      bgcolor: "#ffffff",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    },
                  },
                }}
              />
            </Stack>

            {/* Quick Range Buttons */}
            <ButtonGroup
              variant="outlined"
              size="small"
              sx={{
                alignSelf: { xs: "flex-start", md: "center" },
                bgcolor: "#ffffff",
                borderRadius: 2,
                "& .MuiButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#475569",
                  borderColor: "#cbd5e1",
                  px: 1.5,
                  py: 0.5,
                  "&:hover": {
                    bgcolor: "#f1f5f9",
                    borderColor: "#0284c7",
                    color: "#0284c7",
                  },
                },
              }}
            >
              <Button onClick={() => handleQuickRange(1)}>1Y</Button>
              <Button onClick={() => handleQuickRange(3)}>3Y</Button>
              <Button onClick={() => handleQuickRange(5)}>5Y</Button>
              <Button onClick={() => handleQuickRange(10)}>10Y</Button>
              <Button onClick={() => handleQuickRange("max")}>Max</Button>
            </ButtonGroup>
          </Stack>

          {/* Row 2: Fancy Yields & Rates Search Box */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              transition: "border-color 0.2s ease",
              overflow: "hidden",
              maxWidth: "100%",
              "&:hover": {
                borderColor: "#cbd5e1",
              },
            }}
          >
            {/* Header of Search Box */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
              sx={{ mb: 1.5 }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <AccountBalanceIcon sx={{ color: "#0284c7", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Select Yields & Policy Rates
                </Typography>
                <Chip
                  label={`${selectedSeries.length} of ${FED_SERIES_OPTIONS.length} Selected`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: "#e0f2fe",
                    color: "#0369a1",
                    height: 22,
                    fontSize: "11px",
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                {selectedSeries.length > 5 && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setIsTagsExpanded((prev) => !prev)}
                    sx={{
                      fontSize: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#0284c7",
                      py: 0.25,
                      px: 1,
                    }}
                  >
                    {isTagsExpanded
                      ? "Show Less"
                      : `Show All (${selectedSeries.length})`}
                  </Button>
                )}
                <Button
                  size="small"
                  variant="text"
                  startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
                  onClick={handleSelectAll}
                  sx={{
                    fontSize: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#0284c7",
                    py: 0.25,
                    px: 1,
                  }}
                >
                  Select All
                </Button>
                {selectedSeries.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<ClearAllIcon sx={{ fontSize: 16 }} />}
                    onClick={handleClearAll}
                    sx={{
                      fontSize: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#64748b",
                      py: 0.25,
                      px: 1,
                      "&:hover": { color: "#ef4444" },
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Fancy Autocomplete */}
            <Autocomplete<SeriesOption, true, false, false>
              multiple
              options={FED_SERIES_OPTIONS}
              groupBy={(option) => option.category}
              getOptionLabel={(option) =>
                `${option.shortName} - ${option.name}`
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedSeries}
              onChange={(_, newValue) => setSelectedSeries(newValue)}
              disableCloseOnSelect
              slotProps={{
                popper: {
                  sx: { zIndex: 1300, maxWidth: "100vw" },
                },
                paper: {
                  sx: {
                    borderRadius: 2,
                    mt: 0.8,
                    boxShadow:
                      "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                  },
                },
              }}
              ListboxProps={{
                sx: {
                  maxHeight: 320,
                  p: 0,
                },
              }}
              renderTags={(tagValue, getTagProps) => {
                const isLimited = !isTagsExpanded && tagValue.length > 5;
                const visibleTags = isLimited ? tagValue.slice(0, 5) : tagValue;
                const remaining = tagValue.length - 5;

                return (
                  <>
                    {visibleTags.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          {...tagProps}
                          size="small"
                          label={
                            <Stack
                              direction="row"
                              spacing={0.6}
                              alignItems="center"
                            >
                              <span style={{ fontSize: "14px" }}>
                                {option.icon}
                              </span>
                              <span
                                style={{ fontWeight: 700, color: "#0f172a" }}
                              >
                                {option.shortName}
                              </span>
                            </Stack>
                          }
                          sx={{
                            m: "2px",
                            bgcolor: "#ffffff",
                            border: "1px solid #bae6fd",
                            borderRadius: "6px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                            "&:hover": {
                              bgcolor: "#f0f9ff",
                              borderColor: "#38bdf8",
                            },
                            "& .MuiChip-deleteIcon": {
                              color: "#94a3b8",
                              fontSize: "16px",
                              "&:hover": { color: "#ef4444" },
                            },
                          }}
                        />
                      );
                    })}

                    {isLimited && (
                      <Tooltip title="Click to view all rates" arrow>
                        <Chip
                          size="small"
                          label={`+${remaining} more`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsTagsExpanded(true);
                          }}
                          sx={{
                            m: "2px",
                            bgcolor: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "11px",
                            color: "#0284c7",
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              bgcolor: "#e0f2fe",
                              borderColor: "#0284c7",
                              color: "#0369a1",
                            },
                          }}
                        />
                      </Tooltip>
                    )}

                    {isTagsExpanded && tagValue.length > 5 && (
                      <Tooltip title="Click to collapse tags" arrow>
                        <Chip
                          size="small"
                          label="Show less ▴"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsTagsExpanded(false);
                          }}
                          sx={{
                            m: "2px",
                            bgcolor: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "11px",
                            color: "#64748b",
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              bgcolor: "#e2e8f0",
                              color: "#334155",
                            },
                          }}
                        />
                      </Tooltip>
                    )}
                  </>
                );
              }}
              renderOption={(props, option, { selected }) => (
                <li
                  {...props}
                  key={option.id}
                  style={{
                    padding: "7px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      checked={selected}
                      size="small"
                      sx={{ p: 0.5 }}
                    />
                    <Box
                      sx={{
                        width: 38,
                        height: 26,
                        borderRadius: "6px",
                        bgcolor:
                          option.category === "Treasury Yields"
                            ? "#eff6ff"
                            : "#f0fdf4",
                        border: `1px solid ${
                          option.category === "Treasury Yields"
                            ? "#bfdbfe"
                            : "#bbf7d0"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color:
                          option.category === "Treasury Yields"
                            ? "#1d4ed8"
                            : "#15803d",
                      }}
                    >
                      {option.badge}
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          lineHeight: 1.2,
                        }}
                      >
                        {option.shortName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", lineHeight: 1 }}
                      >
                        {option.name}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Chip
                      label={option.tenor}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        borderColor: "#cbd5e1",
                        color: "#475569",
                        height: 20,
                      }}
                    />
                    <Chip
                      label={
                        option.category === "Treasury Yields"
                          ? "Treasury"
                          : "Policy"
                      }
                      size="small"
                      sx={{
                        fontSize: "10px",
                        fontWeight: 600,
                        height: 20,
                        bgcolor:
                          option.category === "Treasury Yields"
                            ? "#eff6ff"
                            : "#ecfdf5",
                        color:
                          option.category === "Treasury Yields"
                            ? "#1d4ed8"
                            : "#047857",
                        border: `1px solid ${
                          option.category === "Treasury Yields"
                            ? "#bfdbfe"
                            : "#a7f3d0"
                        }`,
                      }}
                    />
                  </Stack>
                </li>
              )}
              renderGroup={(params) => (
                <li key={params.key}>
                  <Box
                    sx={{
                      bgcolor: "#f8fafc",
                      px: 2,
                      py: 0.8,
                      fontWeight: 800,
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#475569",
                      borderBottom: "1px solid #e2e8f0",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    {params.group}
                  </Box>
                  <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  placeholder={
                    selectedSeries.length === 0
                      ? "Search yields & policy rates (e.g. 10Y, EFFR, DGS2)..."
                      : "Add more rates..."
                  }
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon
                          sx={{
                            color: "#0284c7",
                            fontSize: 20,
                            mr: 0.5,
                            flexShrink: 0,
                          }}
                        />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "2px",
                      py: "5px",
                      pl: 1,
                      pr: "65px !important",
                      "&:hover fieldset": {
                        borderColor: "#0284c7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0284c7",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiAutocomplete-input": {
                      minWidth: "70px",
                      flexGrow: 1,
                      py: "3px !important",
                    },
                  }}
                />
              )}
              sx={{ width: "100%" }}
            />

            {/* Row 3: Preset Filter Chips */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1.5, flexWrap: "wrap", gap: 0.8 }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mr: 0.5,
                }}
              >
                Presets:
              </Typography>
              <Chip
                icon={<StarOutlineIcon sx={{ fontSize: 16 }} />}
                label="All Benchmarks (8)"
                size="small"
                clickable
                onClick={handleSelectAll}
                sx={{
                  fontWeight: 600,
                  bgcolor: isAllSelected ? "#0284c7" : "#ffffff",
                  color: isAllSelected ? "#ffffff" : "#334155",
                  border: isAllSelected
                    ? "1px solid #0284c7"
                    : "1px solid #cbd5e1",
                  "&:hover": {
                    bgcolor: isAllSelected ? "#0369a1" : "#f1f5f9",
                  },
                  "& .MuiChip-icon": {
                    color: isAllSelected ? "#ffffff" : "#0284c7",
                  },
                }}
              />
              <Chip
                label="Key Treasuries (2Y, 10Y, 30Y)"
                size="small"
                clickable
                onClick={handleSelectKeyTreasuries}
                sx={{
                  fontWeight: 600,
                  bgcolor: isKeyTreasuriesSelected ? "#0284c7" : "#ffffff",
                  color: isKeyTreasuriesSelected ? "#ffffff" : "#334155",
                  border: isKeyTreasuriesSelected
                    ? "1px solid #0284c7"
                    : "1px solid #cbd5e1",
                  "&:hover": {
                    bgcolor: isKeyTreasuriesSelected ? "#0369a1" : "#f1f5f9",
                  },
                }}
              />
              <Chip
                label="All Treasury Yields (6)"
                size="small"
                clickable
                onClick={handleSelectAllTreasuries}
                sx={{
                  fontWeight: 600,
                  bgcolor: isAllTreasuriesSelected ? "#0284c7" : "#ffffff",
                  color: isAllTreasuriesSelected ? "#ffffff" : "#334155",
                  border: isAllTreasuriesSelected
                    ? "1px solid #0284c7"
                    : "1px solid #cbd5e1",
                  "&:hover": {
                    bgcolor: isAllTreasuriesSelected ? "#0369a1" : "#f1f5f9",
                  },
                }}
              />
              <Chip
                label="Fed Policy Rates (2)"
                size="small"
                clickable
                onClick={handleSelectFedRates}
                sx={{
                  fontWeight: 600,
                  bgcolor: isFedRatesSelected ? "#0284c7" : "#ffffff",
                  color: isFedRatesSelected ? "#ffffff" : "#334155",
                  border: isFedRatesSelected
                    ? "1px solid #0284c7"
                    : "1px solid #cbd5e1",
                  "&:hover": {
                    bgcolor: isFedRatesSelected ? "#0369a1" : "#f1f5f9",
                  },
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
};

export default Inputs;
