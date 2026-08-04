import React from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Stack,
  Chip,
  Slider,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useDoublingGrowth, PRESET_SCENARIOS } from "./DoublingGrowthContext";

export const Inputs: React.FC = () => {
  const {
    initialValue,
    setInitialValue,
    growthFactor,
    setGrowthFactor,
    doublingInterval,
    setDoublingInterval,
    totalDuration,
    setTotalDuration,
    timeUnit,
    setTimeUnit,
    scaleType,
    setScaleType,
    selectedPreset,
    loadPreset,
  } = useDoublingGrowth();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      {/* Top Presets Row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1.5}
        sx={{ mb: 3 }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          gap={0.5}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "#555",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Preset Scenarios:
          </Typography>
          {PRESET_SCENARIOS.map((preset) => (
            <Chip
              key={preset.key}
              label={preset.name}
              size="small"
              onClick={() => loadPreset(preset.key)}
              color={selectedPreset === preset.key ? "primary" : "default"}
              variant={selectedPreset === preset.key ? "filled" : "outlined"}
              sx={{ fontWeight: "bold" }}
            />
          ))}
        </Stack>

        {/* Scale Switcher (Linear vs Logarithmic) */}
        <ToggleButtonGroup
          value={scaleType}
          exclusive
          onChange={(_, val) => val && setScaleType(val)}
          size="small"
        >
          <ToggleButton value="linear" sx={{ fontWeight: "bold", px: 2 }}>
            <ShowChartIcon sx={{ mr: 0.5, fontSize: 18 }} /> Linear Scale
          </ToggleButton>
          <ToggleButton value="logarithmic" sx={{ fontWeight: "bold", px: 2 }}>
            <TimelineIcon sx={{ mr: 0.5, fontSize: 18 }} /> Log Scale (log₁₀)
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Grid container spacing={3}>
        {/* Starting Value */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#1a2035" }}
              >
                Starting Number (N₀)
              </Typography>
              <Tooltip title="Initial baseline starting number before doubling cycles begin.">
                <HelpOutlineIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", cursor: "pointer" }}
                />
              </Tooltip>
            </Stack>
            <TextField
              size="small"
              type="number"
              fullWidth
              value={initialValue}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) setInitialValue(val);
              }}
              inputProps={{ min: "0.0001", step: "any" }}
            />
            {/* Quick Starting Value Presets */}
            <Stack
              direction="row"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 1, gap: 0.5 }}
            >
              {[1, 2, 10, 100, 1000].map((v) => (
                <Chip
                  key={v}
                  label={`${v}`}
                  size="small"
                  variant="outlined"
                  onClick={() => setInitialValue(v)}
                  sx={{ fontSize: "11px", cursor: "pointer" }}
                />
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Growth Multiple Factor */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#1a2035" }}
              >
                Growth Factor per Step
              </Typography>
              <Tooltip title="Multiplier per step (2 = Doubling, 3 = Tripling, 1.5 = +50% growth).">
                <HelpOutlineIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", cursor: "pointer" }}
                />
              </Tooltip>
            </Stack>
            <TextField
              size="small"
              type="number"
              fullWidth
              value={growthFactor}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) setGrowthFactor(val);
              }}
              inputProps={{ min: "1.01", step: "0.1" }}
            />
            <Stack
              direction="row"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 1, gap: 0.5 }}
            >
              {[
                { label: "2x (Double)", val: 2 },
                { label: "3x (Triple)", val: 3 },
                { label: "1.5x (+50%)", val: 1.5 },
              ].map((f) => (
                <Chip
                  key={f.val}
                  label={f.label}
                  size="small"
                  color={growthFactor === f.val ? "secondary" : "default"}
                  variant={growthFactor === f.val ? "filled" : "outlined"}
                  onClick={() => setGrowthFactor(f.val)}
                  sx={{ fontSize: "11px", cursor: "pointer" }}
                />
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Unit Time / Doubling Interval */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#1a2035" }}
              >
                Doubling Interval (Unit Time)
              </Typography>
              <Tooltip title="Time period required for one growth cycle / doubling event.">
                <HelpOutlineIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", cursor: "pointer" }}
                />
              </Tooltip>
            </Stack>
            <TextField
              size="small"
              type="number"
              fullWidth
              value={doublingInterval}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) setDoublingInterval(val);
              }}
              inputProps={{ min: "0.01", step: "1" }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#666", mt: 0.5, display: "block" }}
            >
              1 doubling every {doublingInterval} {timeUnit}
            </Typography>
          </Box>
        </Grid>

        {/* Total Duration / End Time */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#1a2035" }}
              >
                Total End Time ({totalDuration} {timeUnit})
              </Typography>
              <TextField
                size="small"
                type="text"
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                placeholder="Unit Label"
                sx={{ width: 90 }}
              />
            </Stack>
            <Slider
              min={1}
              max={100}
              step={1}
              value={totalDuration > 100 ? 100 : totalDuration}
              onChange={(_, val) => setTotalDuration(val as number)}
              valueLabelDisplay="auto"
            />
            <Stack
              direction="row"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 0.5, gap: 0.5 }}
            >
              {[10, 20, 30, 50, 64].map((t) => (
                <Chip
                  key={t}
                  label={`${t} ${timeUnit}`}
                  size="small"
                  variant="outlined"
                  onClick={() => setTotalDuration(t)}
                  sx={{ fontSize: "11px", cursor: "pointer" }}
                />
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Inputs;
