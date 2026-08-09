import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Slider,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Stack,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  usePortfolioShockMatrix,
  getScaleMultiplier,
  getScaleSuffix,
  AmountScale,
} from "./PortfolioShockMatrixContext";

const Inputs: React.FC = () => {
  const {
    initialCorpus,
    currentCorpus,
    setInitialCorpus,
    setCurrentCorpus,
    amountScale,
    setAmountScale,
  } = usePortfolioShockMatrix();

  const multiplier = getScaleMultiplier(amountScale);
  const suffix = getScaleSuffix(amountScale);

  const scaledInitial = initialCorpus / multiplier;
  const scaledCurrent = currentCorpus / multiplier;

  const getSliderConfig = (scale: AmountScale, currentAmount: number) => {
    const scaledVal = currentAmount / getScaleMultiplier(scale);
    switch (scale) {
      case "thousands":
        return {
          step: 1,
          min: 0,
          max: Math.max(1000, Math.ceil(scaledVal * 1.3)),
        };
      case "millions":
        return {
          step: 0.1,
          min: 0,
          max: Math.max(100, Math.ceil(scaledVal * 1.3)),
        };
      case "billions":
        return {
          step: 0.01,
          min: 0,
          max: Math.max(10, Math.ceil(scaledVal * 1.3)),
        };
    }
  };

  const initialCfg = getSliderConfig(amountScale, initialCorpus);
  const currentCfg = getSliderConfig(amountScale, currentCorpus);

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
      {/* Header Bar + Scale Radio Button Selector */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 3, pb: 2, borderBottom: "1px solid #f1f5f9" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e293b" }}>
          Portfolio Shock Parameters & Sliders
        </Typography>

        {/* Radio Button Group for Scale Units */}
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
              name="shock-scale-radio-group"
              value={amountScale}
              onChange={(e) => setAmountScale(e.target.value as AmountScale)}
            >
              <FormControlLabel
                value="thousands"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Thousands ($1K)
                  </Typography>
                }
              />
              <FormControlLabel
                value="millions"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Millions ($1M)
                  </Typography>
                }
              />
              <FormControlLabel
                value="billions"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Billions ($1B)
                  </Typography>
                }
              />
            </RadioGroup>
          </Stack>
        </FormControl>
      </Stack>

      <Grid container spacing={3}>
        {/* 1. Initial Corpus Amount */}
        <Grid size={{ xs: 12, sm: 6 }}>
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
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  1. Initial Corpus Amount
                </Typography>
                <Tooltip title="The baseline cost basis or original investment amount put into the portfolio.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${scaledInitial.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#fee2e2",
                  color: "#b91c1c",
                }}
              />
            </Stack>
            <Slider
              min={initialCfg.min}
              max={initialCfg.max}
              step={initialCfg.step}
              value={scaledInitial}
              onChange={(_, val) =>
                setInitialCorpus((val as number) * multiplier)
              }
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#dc2626" }}
            />
          </Box>
        </Grid>

        {/* 2. Current Corpus Amount */}
        <Grid size={{ xs: 12, sm: 6 }}>
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
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  2. Current Corpus Amount
                </Typography>
                <Tooltip title="The current mark-to-market value of the portfolio before applying market shock scenarios.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${scaledCurrent.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#e0f2fe",
                  color: "#0369a1",
                }}
              />
            </Stack>
            <Slider
              min={currentCfg.min}
              max={currentCfg.max}
              step={currentCfg.step}
              value={scaledCurrent}
              onChange={(_, val) =>
                setCurrentCorpus((val as number) * multiplier)
              }
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#0284c7" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Inputs;
