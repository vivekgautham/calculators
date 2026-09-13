import React from "react";
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
import PublicIcon from "@mui/icons-material/Public";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import dayjs from "dayjs";
import { useFXRates } from "./FXRatesContext";
import {
  FX_SERIES_OPTIONS,
  DEFAULT_FX_SERIES,
  FXSeriesOption,
} from "./constants";

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
  } = useFXRates();

  const [isTagsExpanded, setIsTagsExpanded] = React.useState(false);

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

  const handleClearAll = () => {
    setSelectedSeries([]);
    setIsTagsExpanded(false);
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

  const isPopularSelected =
    selectedSeries.length === DEFAULT_FX_SERIES.length &&
    selectedSeries.every((s) => DEFAULT_FX_SERIES.some((d) => d.id === s.id));

  const isMajorSelected =
    selectedSeries.length ===
      FX_SERIES_OPTIONS.filter((s) => s.category === "Major Currencies")
        .length &&
    selectedSeries.every((s) => s.category === "Major Currencies");

  const isEmergingSelected =
    selectedSeries.length ===
      FX_SERIES_OPTIONS.filter(
        (s) => s.category === "Emerging Market Currencies",
      ).length &&
    selectedSeries.every((s) => s.category === "Emerging Market Currencies");

  const isAllSelected = selectedSeries.length === FX_SERIES_OPTIONS.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack spacing={2.5}>
          {/* Row 1: Date Range & Quick Range Buttons */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
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

          {/* Row 2: Fancy Currency Search Box */}
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
                <PublicIcon sx={{ color: "#0284c7", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Select Currencies (vs USD)
                </Typography>
                <Chip
                  label={`${selectedSeries.length} of ${FX_SERIES_OPTIONS.length} Selected`}
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
                {selectedSeries.length > 6 && (
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
            <Autocomplete<FXSeriesOption, true, false, false>
              multiple
              options={FX_SERIES_OPTIONS}
              groupBy={(option) => option.category}
              getOptionLabel={(option) =>
                `${option.code} (${option.currencyName})`
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
                const isLimited = !isTagsExpanded && tagValue.length > 6;
                const visibleTags = isLimited ? tagValue.slice(0, 6) : tagValue;
                const remaining = tagValue.length - 6;

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
                                {option.flag}
                              </span>
                              <span
                                style={{ fontWeight: 700, color: "#0f172a" }}
                              >
                                {option.code}
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
                      <Tooltip title="Click to view all currency pairs" arrow>
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

                    {isTagsExpanded && tagValue.length > 6 && (
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
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}
                    >
                      {option.flag}
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
                        {option.code}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", lineHeight: 1 }}
                      >
                        {option.currencyName}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Chip
                      label={option.symbol}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        borderColor: "#cbd5e1",
                        color: "#475569",
                        height: 20,
                      }}
                    />
                    <Chip
                      label={
                        option.category === "Major Currencies" ? "Major" : "EM"
                      }
                      size="small"
                      sx={{
                        fontSize: "10px",
                        fontWeight: 600,
                        height: 20,
                        bgcolor:
                          option.category === "Major Currencies"
                            ? "#ecfdf5"
                            : "#fffbeb",
                        color:
                          option.category === "Major Currencies"
                            ? "#047857"
                            : "#b45309",
                        border: `1px solid ${
                          option.category === "Major Currencies"
                            ? "#a7f3d0"
                            : "#fde68a"
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
                      ? "Search currencies (e.g. Euro, Yen, INR, DEXUSEU)..."
                      : "Add more currencies..."
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
                label="Popular Currencies (7)"
                size="small"
                clickable
                onClick={handleSelectDefault}
                sx={{
                  fontWeight: 600,
                  bgcolor: isPopularSelected ? "#0284c7" : "#ffffff",
                  color: isPopularSelected ? "#ffffff" : "#334155",
                  border: isPopularSelected
                    ? "1px solid #0284c7"
                    : "1px solid #cbd5e1",
                  "&:hover": {
                    bgcolor: isPopularSelected ? "#0369a1" : "#f1f5f9",
                  },
                  "& .MuiChip-icon": {
                    color: isPopularSelected ? "#ffffff" : "#0284c7",
                  },
                }}
              />
              <Chip
                label="Major Currencies (12)"
                size="small"
                clickable
                onClick={handleSelectMajor}
                sx={{
                  fontWeight: 600,
                  bgcolor: isMajorSelected ? "#0284c7" : "#ffffff",
                  color: isMajorSelected ? "#ffffff" : "#334155",
                  border: isMajorSelected
                    ? "1px solid #0284c7"
                    : "1px solid #cbd5e1",
                  "&:hover": {
                    bgcolor: isMajorSelected ? "#0369a1" : "#f1f5f9",
                  },
                }}
              />
              <Chip
                label="Emerging Markets (6)"
                size="small"
                clickable
                onClick={handleSelectEmerging}
                sx={{
                  fontWeight: 600,
                  bgcolor: isEmergingSelected ? "#0284c7" : "#ffffff",
                  color: isEmergingSelected ? "#ffffff" : "#334155",
                  border: isEmergingSelected
                    ? "1px solid #0284c7"
                    : "1px solid #cbd5e1",
                  "&:hover": {
                    bgcolor: isEmergingSelected ? "#0369a1" : "#f1f5f9",
                  },
                }}
              />
              <Chip
                label="All Currencies (18)"
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
