import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Stack,
  Slider,
  Tooltip,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Divider,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  useForeignCurrencyFD,
  getScaleSuffix,
  AmountScale,
  PRESETS,
  FDPreset,
} from "./ForeignCurrencyFDContext";

export const Inputs: React.FC = () => {
  const {
    amountScale,
    setAmountScale,
    initialGrossAmount,
    setInitialGrossAmount,
    years,
    setYears,
    annualRate,
    setAnnualRate,
    spreadX,
    setSpreadX,
    spreadY,
    setSpreadY,
    spreadZ,
    setSpreadZ,
    spreadA,
    setSpreadA,
    spreadB,
    setSpreadB,
    spreadU,
    setSpreadU,
    spreadV,
    setSpreadV,
    loadPreset,
    totalCreationSpreadBps,
    creationFeesDollar,
    totalPayoutSpreadBps,
    totalRedemptionSpreadBps,
    redemptionFeesDollar,
  } = useForeignCurrencyFD();

  const suffix = getScaleSuffix(amountScale);

  const getAmountSliderConfig = (scale: AmountScale, currentVal: number) => {
    switch (scale) {
      case "thousands":
        return {
          step: 1,
          min: 1,
          max: Math.max(1000, Math.ceil(currentVal * 1.3)),
        };
      case "millions":
        return {
          step: 0.1,
          min: 0.1,
          max: Math.max(100, Math.ceil(currentVal * 1.3)),
        };
      case "billions":
        return {
          step: 0.01,
          min: 0.01,
          max: Math.max(10, Math.ceil(currentVal * 1.3)),
        };
    }
  };

  const amountCfg = getAmountSliderConfig(amountScale, initialGrossAmount);

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
      {/* Preset Scenarios Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: "#475569",
            textTransform: "uppercase",
          }}
        >
          Presets:
        </Typography>
        {PRESETS.map((preset: FDPreset) => (
          <Chip
            key={preset.name}
            label={preset.name}
            clickable
            color="primary"
            variant="outlined"
            onClick={() => loadPreset(preset)}
            sx={{ fontWeight: "bold" }}
          />
        ))}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Top Controls: Scale Selector & Principal/Horizon */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e293b" }}>
          Foreign Currency Deposit Parameters
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
              name="fd-scale-radio-group"
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
        {/* Gross Initial Deposit Amount */}
        <Grid size={{ xs: 12, md: 4 }}>
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
                  1. Gross Initial Deposit ($)
                </Typography>
                <Tooltip title="Initial gross capital applied to open the foreign currency fixed deposit.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${initialGrossAmount.toLocaleString()} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#e0f2fe",
                  color: "#0369a1",
                }}
              />
            </Stack>
            <Slider
              min={amountCfg.min}
              max={amountCfg.max}
              step={amountCfg.step}
              value={initialGrossAmount}
              onChange={(_, val) => setInitialGrossAmount(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#0284c7" }}
            />
          </Box>
        </Grid>

        {/* Deposit Horizon (Years) */}
        <Grid size={{ xs: 12, md: 4 }}>
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
                  2. Deposit Horizon (Years N)
                </Typography>
                <Tooltip title="Total term of the fixed deposit in years (paid semi-annually).">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`${years} Yrs (${years * 2} Payouts)`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#f3e8ff",
                  color: "#6b21a8",
                }}
              />
            </Stack>
            <Slider
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(_, val) => setYears(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `${val} Yrs`}
              sx={{ color: "#7c3aed" }}
            />
          </Box>
        </Grid>

        {/* Fixed Annual Interest Rate */}
        <Grid size={{ xs: 12, md: 4 }}>
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
                  3. Gross Fixed Annual Rate (r %)
                </Typography>
                <Tooltip title="Stated gross annual interest rate paid in half-yearly installments.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`${annualRate.toFixed(2)}% p.a.`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#dcfce7",
                  color: "#15803d",
                }}
              />
            </Stack>
            <Slider
              min={0.5}
              max={20}
              step={0.1}
              value={annualRate}
              onChange={(_, val) => setAnnualRate(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `${val}%`}
              sx={{ color: "#16a34a" }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* SECTION 1: CREATION COSTS (3 SPREADS X, Y, Z in BPS) */}
      <Box sx={{ mt: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            A. Deposit Creation Fee Spreads (x, y, z in bps)
          </Typography>
          <Chip
            label={`Total Creation Cost: ${totalCreationSpreadBps} bps (${(totalCreationSpreadBps / 100).toFixed(2)}% = -$${creationFeesDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })})`}
            size="small"
            sx={{ fontWeight: "bold", bgcolor: "#fee2e2", color: "#b91c1c" }}
          />
        </Stack>

        <Grid container spacing={2.5}>
          {/* Spread X */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Spread X: FX Conversion (bps)
                </Typography>
                <Chip
                  label={`${spreadX} bps`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#fef3c7",
                    color: "#b45309",
                  }}
                />
              </Stack>
              <Slider
                min={0}
                max={300}
                step={1}
                value={spreadX}
                onChange={(_, val) => setSpreadX(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} bps`}
                sx={{ color: "#d97706" }}
              />
            </Box>
          </Grid>

          {/* Spread Y */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Spread Y: Interbank Wire (bps)
                </Typography>
                <Chip
                  label={`${spreadY} bps`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#fef3c7",
                    color: "#b45309",
                  }}
                />
              </Stack>
              <Slider
                min={0}
                max={300}
                step={1}
                value={spreadY}
                onChange={(_, val) => setSpreadY(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} bps`}
                sx={{ color: "#d97706" }}
              />
            </Box>
          </Grid>

          {/* Spread Z */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Spread Z: Account Setup (bps)
                </Typography>
                <Chip
                  label={`${spreadZ} bps`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#fef3c7",
                    color: "#b45309",
                  }}
                />
              </Stack>
              <Slider
                min={0}
                max={300}
                step={1}
                value={spreadZ}
                onChange={(_, val) => setSpreadZ(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} bps`}
                sx={{ color: "#d97706" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* SECTION 2: INTEREST PAYOUT SERVICING COSTS (2 SPREADS A, B in BPS) */}
      <Box sx={{ mt: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            B. Half-Yearly Interest Servicing Costs (a, b in bps)
          </Typography>
          <Chip
            label={`Total Payout Servicing Spread: ${totalPayoutSpreadBps} bps (${(totalPayoutSpreadBps / 100).toFixed(2)}% deducted per payout)`}
            size="small"
            sx={{ fontWeight: "bold", bgcolor: "#ffedd5", color: "#c2410c" }}
          />
        </Stack>

        <Grid container spacing={2.5}>
          {/* Spread A */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Spread A: Custody & Servicing Fee (bps)
                </Typography>
                <Chip
                  label={`${spreadA} bps`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#ffedd5",
                    color: "#c2410c",
                  }}
                />
              </Stack>
              <Slider
                min={0}
                max={200}
                step={1}
                value={spreadA}
                onChange={(_, val) => setSpreadA(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} bps`}
                sx={{ color: "#ea580c" }}
              />
            </Box>
          </Grid>

          {/* Spread B */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Spread B: Payout Transfer & Withholding (bps)
                </Typography>
                <Chip
                  label={`${spreadB} bps`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#ffedd5",
                    color: "#c2410c",
                  }}
                />
              </Stack>
              <Slider
                min={0}
                max={200}
                step={1}
                value={spreadB}
                onChange={(_, val) => setSpreadB(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} bps`}
                sx={{ color: "#ea580c" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* SECTION 3: MATURITY REDEMPTION COSTS (2 SPREADS U, V in BPS) */}
      <Box sx={{ mt: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            C. Maturity Principal Redemption Costs (u, v in bps)
          </Typography>
          <Chip
            label={`Total Redemption Spread: ${totalRedemptionSpreadBps} bps (${(totalRedemptionSpreadBps / 100).toFixed(2)}% = -$${redemptionFeesDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })})`}
            size="small"
            sx={{ fontWeight: "bold", bgcolor: "#fee2e2", color: "#b91c1c" }}
          />
        </Stack>

        <Grid container spacing={2.5}>
          {/* Spread U */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Spread U: Redemption FX Conversion (bps)
                </Typography>
                <Chip
                  label={`${spreadU} bps`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#ffe4e6",
                    color: "#be123c",
                  }}
                />
              </Stack>
              <Slider
                min={0}
                max={300}
                step={1}
                value={spreadU}
                onChange={(_, val) => setSpreadU(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} bps`}
                sx={{ color: "#e11d48" }}
              />
            </Box>
          </Grid>

          {/* Spread V */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Spread V: Offshore Repatriation Fee (bps)
                </Typography>
                <Chip
                  label={`${spreadV} bps`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#ffe4e6",
                    color: "#be123c",
                  }}
                />
              </Stack>
              <Slider
                min={0}
                max={300}
                step={1}
                value={spreadV}
                onChange={(_, val) => setSpreadV(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} bps`}
                sx={{ color: "#e11d48" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Inputs;
