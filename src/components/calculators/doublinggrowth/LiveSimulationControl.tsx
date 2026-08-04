import React from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Stack,
  Slider,
  Chip,
  Tooltip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ReplayIcon from "@mui/icons-material/Replay";
import FastForwardIcon from "@mui/icons-material/FastForward";
import { useDoublingGrowth, formatLargeNumber } from "./DoublingGrowthContext";

export const LiveSimulationControl: React.FC = () => {
  const {
    fullTimeSeries,
    currentSimStep,
    setCurrentSimStep,
    isSimulating,
    playSim,
    pauseSim,
    stepSim,
    resetSim,
    simSpeed,
    setSimSpeed,
    timeUnit,
    currentSimValue,
  } = useDoublingGrowth();

  const maxStep = Math.max(0, fullTimeSeries.length - 1);
  const isFinished = currentSimStep >= maxStep;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "#0f172a",
        color: "#f8fafc",
        border: "1px solid #1e293b",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        {/* Playback Buttons */}
        <Stack direction="row" spacing={1} alignItems="center">
          {isSimulating ? (
            <Button
              variant="contained"
              color="warning"
              size="small"
              startIcon={<PauseIcon />}
              onClick={pauseSim}
              sx={{ fontWeight: "bold" }}
            >
              Pause Simulation
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={playSim}
              sx={{ fontWeight: "bold" }}
            >
              {isFinished ? "Replay Simulation" : "Start Live Simulation"}
            </Button>
          )}

          <Tooltip title="Step forward 1 unit time">
            <span>
              <Button
                variant="outlined"
                color="info"
                size="small"
                startIcon={<SkipNextIcon />}
                onClick={stepSim}
                disabled={isSimulating || isFinished}
                sx={{
                  fontWeight: "bold",
                  color: "#38bdf8",
                  borderColor: "#38bdf8",
                }}
              >
                Next Step
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Reset simulation to step 0">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<ReplayIcon />}
              onClick={resetSim}
              sx={{ fontWeight: "bold" }}
            >
              Reset
            </Button>
          </Tooltip>
        </Stack>

        {/* Live Ticker Counter Display */}
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.08)",
            px: 2,
            py: 0.8,
            borderRadius: 1.5,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Live Value at t = {fullTimeSeries[currentSimStep]?.time ?? 0}{" "}
              {timeUnit}:
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#34d399", lineHeight: 1 }}
            >
              {formatLargeNumber(currentSimValue)}
            </Typography>
          </Stack>
        </Box>

        {/* Speed Controls */}
        <Stack direction="row" spacing={1} alignItems="center">
          <FastForwardIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: "bold" }}
          >
            Speed:
          </Typography>
          {[
            { label: "Slow (1s)", speed: 1000 },
            { label: "Normal (0.4s)", speed: 400 },
            { label: "Fast (0.1s)", speed: 100 },
          ].map((s) => (
            <Chip
              key={s.speed}
              label={s.label}
              size="small"
              color={simSpeed === s.speed ? "secondary" : "default"}
              variant={simSpeed === s.speed ? "filled" : "outlined"}
              onClick={() => setSimSpeed(s.speed)}
              sx={{
                fontSize: "11px",
                cursor: "pointer",
                color: simSpeed === s.speed ? "white" : "#cbd5e1",
              }}
            />
          ))}
        </Stack>
      </Stack>

      {/* Progress Bar Slider */}
      <Box sx={{ mt: 1.5, px: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            Simulation Step: <b>{currentSimStep}</b> of {maxStep} (
            {fullTimeSeries[currentSimStep]?.timeLabel ?? ""})
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#38bdf8", fontWeight: "bold" }}
          >
            {((currentSimStep / (maxStep || 1)) * 100).toFixed(0)}% Complete
          </Typography>
        </Stack>
        <Slider
          min={0}
          max={maxStep}
          value={currentSimStep}
          onChange={(_, val) => {
            pauseSim();
            setCurrentSimStep(val as number);
          }}
          sx={{
            color: "#34d399",
            height: 6,
            "& .MuiSlider-thumb": {
              width: 14,
              height: 14,
              "&:hover, &.Mui-focusVisible": {
                boxShadow: "0px 0px 0px 8px rgba(52, 211, 153, 0.16)",
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default LiveSimulationControl;
