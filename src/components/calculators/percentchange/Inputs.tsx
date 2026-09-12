import React, { useState } from "react";
import {
  Paper,
  Box,
  TextField,
  Slider,
  Button,
  Stack,
  Typography,
  Chip,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  usePercentChange,
  AmountScale,
  getScaleSuffix,
  getAmountSliderConfig,
} from "./PercentChangeContext";

const QUICK_POSITIVE = [1, 5, 10, 15, 20, 25, 50, 100];
const QUICK_NEGATIVE = [-1, -5, -10, -15, -20, -25, -50, -75];

export const Inputs: React.FC = () => {
  const {
    amountScale,
    setAmountScale,
    initialAmountUnits,
    setInitialAmountUnits,
    initialValue,
    steps,
    addStep,
    removeStep,
    sp500Info,
    resetToSP500,
  } = usePercentChange();

  const suffix = getScaleSuffix(amountScale);
  const amountCfg = getAmountSliderConfig(amountScale, initialAmountUnits);

  // Custom step state
  const [customPercent, setCustomPercent] = useState<string>("10");

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseFloat(customPercent);
    if (!isNaN(val)) {
      addStep(val);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack spacing={3}>
        {/* Top Controls: Scale Selector & Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            Percent Change Parameters
          </Typography>

          {/* Scale Radio Group */}
          <FormControl component="fieldset">
            <Stack direction="row" spacing={1} alignItems="center">
              <FormLabel
                component="legend"
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#475569",
                  mr: 1,
                  textTransform: "uppercase",
                }}
              >
                Scale Unit:
              </FormLabel>
              <RadioGroup
                row
                name="percent-change-scale-radio-group"
                value={amountScale}
                onChange={(e) => setAmountScale(e.target.value as AmountScale)}
              >
                <FormControlLabel
                  value="hundreds"
                  control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Hundreds (100)
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="thousands"
                  control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Thousands (1K)
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="millions"
                  control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Millions (1M)
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="billions"
                  control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Billions (1B)
                    </Typography>
                  }
                />
              </RadioGroup>
            </Stack>
          </FormControl>
        </Stack>

        {/* Index Slider Box */}
        <Box
          sx={{
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: 2,
            border: "1px solid #e2e8f0",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{ mb: 1 }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#1e293b" }}
              >
                Index
              </Typography>
              <Tooltip title="Initial baseline index value before percentage changes are applied. Defaulted to the latest S&P 500 close from FRED API.">
                <HelpOutlineIcon
                  fontSize="small"
                  sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                />
              </Tooltip>
              <Chip
                component="a"
                href={sp500Info.source}
                target="_blank"
                rel="noopener noreferrer"
                clickable
                label={`FRED S&P 500: ${sp500Info.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${sp500Info.date})`}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderColor: "#38bdf8",
                  color: "#0284c7",
                  bgcolor: "#f0f9ff",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#e0f2fe",
                  },
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {Math.abs(initialValue - sp500Info.value) > 0.05 && (
                <Button
                  size="small"
                  variant="text"
                  onClick={resetToSP500}
                  sx={{
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#0284c7",
                    p: 0,
                    minWidth: "auto",
                  }}
                >
                  Reset to S&P 500
                </Button>
              )}
              <Chip
                label={`${initialAmountUnits.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#e0f2fe",
                  color: "#0369a1",
                }}
              />
            </Stack>
          </Stack>
          <Slider
            min={amountCfg.min}
            max={amountCfg.max}
            step={amountCfg.step}
            value={initialAmountUnits}
            onChange={(_, val) => setInitialAmountUnits(val as number)}
            valueLabelDisplay="auto"
            valueLabelFormat={(val) => `${val} ${suffix}`}
            sx={{ color: "#0284c7" }}
          />
        </Box>

        <Divider />

        {/* Single Row: Quick Add Percent Changes + Percent Change Input + Add Change Button */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            Quick Add Percent Changes (Click to append step):
          </Typography>

          {/* Positive Quick Buttons */}
          {QUICK_POSITIVE.map((pct) => (
            <Chip
              key={`pos-${pct}`}
              label={`+${pct}%`}
              size="small"
              clickable
              onClick={() => addStep(pct)}
              sx={{
                fontWeight: 600,
                bgcolor: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0",
                "&:hover": {
                  bgcolor: "#10b981",
                  color: "#ffffff",
                },
              }}
            />
          ))}

          {/* Negative Quick Buttons */}
          {QUICK_NEGATIVE.map((pct) => (
            <Chip
              key={`neg-${pct}`}
              label={`${pct}%`}
              size="small"
              clickable
              onClick={() => addStep(pct)}
              sx={{
                fontWeight: 600,
                bgcolor: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                "&:hover": {
                  bgcolor: "#ef4444",
                  color: "#ffffff",
                },
              }}
            />
          ))}

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, height: 28 }}
          />

          {/* Custom Percent Change Input & Add Change Button */}
          <Box component="form" onSubmit={handleAddCustom}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Percent Change (%)"
                type="number"
                size="small"
                sx={{ width: 150 }}
                value={customPercent}
                onChange={(e) => setCustomPercent(e.target.value)}
                placeholder="e.g. 10"
              />
              <Button
                variant="contained"
                type="submit"
                size="medium"
                startIcon={<AddIcon />}
                sx={{
                  whiteSpace: "nowrap",
                  bgcolor:
                    parseFloat(customPercent) >= 0 ? "#16a34a" : "#dc2626",
                  "&:hover": {
                    bgcolor:
                      parseFloat(customPercent) >= 0 ? "#15803d" : "#b91c1c",
                  },
                }}
              >
                Add Change
              </Button>
            </Stack>
          </Box>
        </Stack>

        {/* Applied Steps Sequence */}
        {steps.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ pt: 0.5 }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "#64748b", mr: 0.5 }}
            >
              Applied Sequence ({steps.length}):
            </Typography>
            {steps.map((step, idx) => (
              <Chip
                key={step.id}
                size="small"
                label={`Step ${idx + 1}: ${step.percentChange > 0 ? "+" : ""}${step.percentChange}%`}
                onDelete={() => removeStep(step.id)}
                sx={{
                  fontWeight: 600,
                  bgcolor: step.percentChange >= 0 ? "#ecfdf5" : "#fef2f2",
                  color: step.percentChange >= 0 ? "#047857" : "#b91c1c",
                  border: `1px solid ${
                    step.percentChange >= 0 ? "#a7f3d0" : "#fecaca"
                  }`,
                }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default Inputs;
