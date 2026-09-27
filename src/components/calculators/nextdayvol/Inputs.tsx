import React from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Slider,
  Stack,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import BoltIcon from "@mui/icons-material/Bolt";
import { useNextDayVol } from "./NextDayVolContext";

const REGIME_PRESETS = [
  { label: "Low Vol", vix: 12.0, color: "#10b981" },
  { label: "Long-term Avg", vix: 15.5, color: "#0284c7" },
  { label: "Elevated", vix: 22.0, color: "#f59e0b" },
  { label: "High Fear", vix: 32.0, color: "#ef4444" },
  { label: "Panic", vix: 48.0, color: "#7c3aed" },
];

export const Inputs: React.FC = () => {
  const {
    spotPrice,
    setSpotPrice,
    vix,
    setVix,
    latestData,
    resetToLatest,
    applyVixPreset,
  } = useNextDayVol();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2.5,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a", fontSize: "17px" }}
          >
            Predictor Inputs
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Enter S&P 500 spot and CBOE VIX, or test different volatility
            scenarios
          </Typography>
        </Box>

        {latestData && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<SyncIcon />}
            onClick={resetToLatest}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "12px",
              borderColor: "#cbd5e1",
              color: "#334155",
              "&:hover": {
                bgcolor: "#f8fafc",
                borderColor: "#94a3b8",
              },
            }}
          >
            Reset to FRED Data (SPX: {latestData.sp500Value.toFixed(1)}, VIX:{" "}
            {latestData.vixValue.toFixed(1)})
          </Button>
        )}
      </Stack>

      <Grid container spacing={3} alignItems="center">
        {/* S&P 500 Spot Price */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="S&P 500 Spot Price"
            type="number"
            value={spotPrice || ""}
            onChange={(e) => setSpotPrice(parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontWeight: 700, color: "#64748b" }}>
                    $
                  </Typography>
                </InputAdornment>
              ),
            }}
            helperText={
              latestData?.sp500Date
                ? `FRED latest close: ${latestData.sp500Date}`
                : "Current S&P 500 Index level"
            }
            size="small"
          />
        </Grid>

        {/* CBOE VIX Level */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="CBOE VIX Level"
            type="number"
            value={vix || ""}
            onChange={(e) =>
              setVix(Math.max(1, parseFloat(e.target.value) || 0))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontWeight: 700, color: "#64748b" }}>
                    %
                  </Typography>
                </InputAdornment>
              ),
            }}
            helperText={
              latestData?.vixDate
                ? `FRED latest close: ${latestData.vixDate}`
                : "30-day annualized implied volatility"
            }
            size="small"
          />
        </Grid>

        {/* VIX Slider Quick Adjust */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ px: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#475569" }}
              >
                VIX SLIDER (5 to 60)
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 800, color: "#0284c7" }}
              >
                {vix.toFixed(1)}
              </Typography>
            </Stack>
            <Slider
              value={typeof vix === "number" && !isNaN(vix) ? vix : 15}
              min={5}
              max={60}
              step={0.5}
              onChange={(_, val) => setVix(val as number)}
              sx={{
                color: "#0284c7",
                "& .MuiSlider-thumb": {
                  boxShadow: "0 2px 6px rgba(2, 132, 199, 0.4)",
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Volatility Regime Presets */}
      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 1 }}>
          <BoltIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
            }}
          >
            Quick Scenarios:
          </Typography>
        </Stack>

        {REGIME_PRESETS.map((preset) => {
          const isActive = Math.abs(vix - preset.vix) < 0.1;
          return (
            <Chip
              key={preset.label}
              label={`${preset.label} (${preset.vix})`}
              size="small"
              onClick={() => applyVixPreset(preset.vix)}
              sx={{
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
                bgcolor: isActive ? `${preset.color}20` : "#f8fafc",
                borderColor: isActive ? preset.color : "#cbd5e1",
                color: isActive ? preset.color : "#334155",
                borderWidth: "1px",
                borderStyle: "solid",
                "&:hover": {
                  bgcolor: `${preset.color}15`,
                  borderColor: preset.color,
                },
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default Inputs;
