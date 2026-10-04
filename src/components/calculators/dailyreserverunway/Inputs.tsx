import React from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Slider,
  Stack,
  Button,
  Chip,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import dayjs from "dayjs";
import { useDailyReserveRunway } from "./DailyReserveRunwayContext";

const RESERVE_PRESETS = [
  { label: "$50K", value: 50000 },
  { label: "$100K", value: 100000 },
  { label: "$250K", value: 250000 },
  { label: "$500K", value: 500000 },
  { label: "$1M", value: 1000000 },
  { label: "$2.5M", value: 2500000 },
];

const YEAR_PRESETS = [
  { label: "1 Yr", value: 1 },
  { label: "2 Yrs", value: 2 },
  { label: "3 Yrs", value: 3 },
  { label: "5 Yrs", value: 5 },
  { label: "10 Yrs", value: 10 },
  { label: "20 Yrs", value: 20 },
  { label: "30 Yrs", value: 30 },
];

export const Inputs: React.FC = () => {
  const {
    totalReserve,
    setTotalReserve,
    startDate,
    setStartDate,
    yearsToGo,
    setYearsToGo,
    totalDays,
    endDateFormatted,
    resetDefaults,
  } = useDailyReserveRunway();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
      }}
    >
      {/* Header Row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2.5, pb: 1.5, borderBottom: "1px solid #f1f5f9" }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, fontSize: "16px", color: "#0f172a" }}
          >
            Runway Parameters
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", fontSize: "12px" }}>
            Enter your reserve dollars, start date, and years to go
          </Typography>
        </Box>

        <Tooltip title="Reset inputs to defaults" arrow>
          <Button
            size="small"
            startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
            onClick={resetDefaults}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 600,
              "&:hover": { color: "#0284c7", bgcolor: "#f0f9ff" },
            }}
          >
            Reset
          </Button>
        </Tooltip>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {/* Parameter 1: Total Reserve Dollars */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.8 }}>
            <AttachMoneyIcon sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#1e293b", fontSize: "13px" }}
            >
              1. Total Reserve Dollars
            </Typography>
          </Stack>

          <TextField
            fullWidth
            size="small"
            type="number"
            value={totalReserve || ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setTotalReserve(isNaN(val) ? 0 : Math.max(0, val));
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontWeight: 700,
                fontSize: "16px",
                bgcolor: "#f8fafc",
                borderRadius: "8px",
              },
            }}
          />

          <Box sx={{ px: 1, mt: 1.5 }}>
            <Slider
              value={Math.min(2500000, totalReserve)}
              min={10000}
              max={2500000}
              step={10000}
              onChange={(_, val) => setTotalReserve(val as number)}
              sx={{ color: "#0284c7" }}
            />
          </Box>

          {/* Quick Presets */}
          <Stack
            direction="row"
            spacing={0.6}
            sx={{ flexWrap: "wrap", gap: "4px", mt: 0.8 }}
          >
            {RESERVE_PRESETS.map((preset) => (
              <Chip
                key={preset.value}
                label={preset.label}
                size="small"
                onClick={() => setTotalReserve(preset.value)}
                variant={totalReserve === preset.value ? "filled" : "outlined"}
                color={totalReserve === preset.value ? "primary" : "default"}
                sx={{
                  fontSize: "11px",
                  height: "22px",
                  cursor: "pointer",
                  fontWeight: totalReserve === preset.value ? 700 : 500,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Parameter 2: Start Date */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.8 }}>
            <CalendarMonthIcon sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#1e293b", fontSize: "13px" }}
            >
              2. Start Date
            </Typography>
          </Stack>

          <TextField
            fullWidth
            size="small"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontWeight: 600,
                fontSize: "14px",
                bgcolor: "#f8fafc",
                borderRadius: "8px",
              },
            }}
          />

          {/* Start Date Quick Shortcuts */}
          <Stack
            direction="row"
            spacing={0.6}
            sx={{ flexWrap: "wrap", gap: "4px", mt: 1.5 }}
          >
            <Chip
              label="Today"
              size="small"
              onClick={() => setStartDate(dayjs().format("YYYY-MM-DD"))}
              sx={{ fontSize: "11px", height: "22px", cursor: "pointer" }}
            />
            <Chip
              label="1st Next Month"
              size="small"
              onClick={() =>
                setStartDate(
                  dayjs().add(1, "month").startOf("month").format("YYYY-MM-DD"),
                )
              }
              sx={{ fontSize: "11px", height: "22px", cursor: "pointer" }}
            />
            <Chip
              label="Jan 1 Next Year"
              size="small"
              onClick={() =>
                setStartDate(
                  dayjs().add(1, "year").startOf("year").format("YYYY-MM-DD"),
                )
              }
              sx={{ fontSize: "11px", height: "22px", cursor: "pointer" }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1.2,
              color: "#64748b",
              fontWeight: 500,
              fontSize: "11px",
            }}
          >
            Ends: <b>{endDateFormatted}</b> ({totalDays.toLocaleString()} days)
          </Typography>
        </Box>

        {/* Parameter 3: Years to Go */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.8 }}>
            <HourglassEmptyIcon sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#1e293b", fontSize: "13px" }}
            >
              3. Years to Go
            </Typography>
          </Stack>

          <TextField
            fullWidth
            size="small"
            type="number"
            value={yearsToGo || ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setYearsToGo(isNaN(val) ? 0.5 : Math.max(0.1, Math.min(50, val)));
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Years</span>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontWeight: 700,
                fontSize: "16px",
                bgcolor: "#f8fafc",
                borderRadius: "8px",
              },
            }}
          />

          <Box sx={{ px: 1, mt: 1.5 }}>
            <Slider
              value={yearsToGo}
              min={0.5}
              max={30}
              step={0.5}
              onChange={(_, val) => setYearsToGo(val as number)}
              sx={{ color: "#0284c7" }}
            />
          </Box>

          {/* Quick Presets */}
          <Stack
            direction="row"
            spacing={0.6}
            sx={{ flexWrap: "wrap", gap: "4px", mt: 0.8 }}
          >
            {YEAR_PRESETS.map((preset) => (
              <Chip
                key={preset.value}
                label={preset.label}
                size="small"
                onClick={() => setYearsToGo(preset.value)}
                variant={yearsToGo === preset.value ? "filled" : "outlined"}
                color={yearsToGo === preset.value ? "primary" : "default"}
                sx={{
                  fontSize: "11px",
                  height: "22px",
                  cursor: "pointer",
                  fontWeight: yearsToGo === preset.value ? 700 : 500,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default Inputs;
