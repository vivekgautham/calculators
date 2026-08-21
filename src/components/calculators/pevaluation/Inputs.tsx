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
  Switch,
  TextField,
  InputAdornment,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { usePEValuation, ValuationMode } from "./PEValuationContext";

const formatCompactCurrency = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const Inputs: React.FC = () => {
  const {
    mode,
    setMode,
    sharePrice,
    setSharePrice,
    ttmEps,
    setTtmEps,
    forwardEps,
    setForwardEps,
    quarterlyMode,
    setQuarterlyMode,
    quarterlyEps,
    setQuarterlyEps,
    growthRate,
    setGrowthRate,
    benchmarkPe,
    setBenchmarkPe,
    marketCap,
    setMarketCap,
    sharesOutstanding,
    setSharesOutstanding,
    ttmNetIncome,
    setTtmNetIncome,
    forwardNetIncome,
    setForwardNetIncome,
    effectiveTtmEps,
    effectiveForwardEps,
  } = usePEValuation();

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
      {/* Mode Selector & Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            Valuation Inputs & Valuation Drivers
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Adjust stock price, trailing earnings, and forward projections to
            evaluate P/E multiples.
          </Typography>
        </Box>

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
              Calculation Mode:
            </FormLabel>
            <RadioGroup
              row
              name="pe-valuation-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as ValuationMode)}
            >
              <FormControlLabel
                value="perShare"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Per-Share Basis
                  </Typography>
                }
              />
              <FormControlLabel
                value="corporate"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Corporate Financials
                  </Typography>
                }
              />
            </RadioGroup>
          </Stack>
        </FormControl>
      </Stack>

      {/* PER SHARE MODE CONTROLS */}
      {mode === "perShare" ? (
        <>
          <Grid container spacing={3}>
            {/* Share Price */}
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
                      1. Current Share Price ($)
                    </Typography>
                    <Tooltip title="Current market price per share of common stock.">
                      <HelpOutlineIcon
                        fontSize="small"
                        sx={{
                          color: "#64748b",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                      />
                    </Tooltip>
                  </Stack>
                  <Chip
                    label={`$${sharePrice.toFixed(2)}`}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#e0f2fe",
                      color: "#0369a1",
                    }}
                  />
                </Stack>
                <Slider
                  min={1}
                  max={1000}
                  step={0.5}
                  value={sharePrice}
                  onChange={(_, val) => setSharePrice(val as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(val) => `$${val}`}
                  sx={{ color: "#0284c7" }}
                />
              </Box>
            </Grid>

            {/* TTM EPS */}
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
                      2. Trailing 12M EPS ($)
                    </Typography>
                    <Tooltip title="Actual reported cumulative net earnings per share over the past 4 quarters (TTM).">
                      <HelpOutlineIcon
                        fontSize="small"
                        sx={{
                          color: "#64748b",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                      />
                    </Tooltip>
                  </Stack>
                  <Chip
                    label={`$${effectiveTtmEps.toFixed(2)}`}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#fef3c7",
                      color: "#b45309",
                    }}
                  />
                </Stack>
                {!quarterlyMode ? (
                  <Slider
                    min={0.1}
                    max={50}
                    step={0.1}
                    value={ttmEps}
                    onChange={(_, val) => setTtmEps(val as number)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(val) => `$${val}`}
                    sx={{ color: "#d97706" }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{ color: "#0369a1", fontStyle: "italic" }}
                  >
                    Calculated from 4 Quarterly EPS inputs below
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Forward EPS */}
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
                      3. Forward 12M EPS ($)
                    </Typography>
                    <Tooltip title="Consensus projected earnings per share over the next 12 months (NTM).">
                      <HelpOutlineIcon
                        fontSize="small"
                        sx={{
                          color: "#64748b",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                      />
                    </Tooltip>
                  </Stack>
                  <Chip
                    label={`$${effectiveForwardEps.toFixed(2)}`}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#dcfce7",
                      color: "#15803d",
                    }}
                  />
                </Stack>
                {!quarterlyMode ? (
                  <Slider
                    min={0.1}
                    max={50}
                    step={0.1}
                    value={forwardEps}
                    onChange={(_, val) => setForwardEps(val as number)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(val) => `$${val}`}
                    sx={{ color: "#16a34a" }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{ color: "#15803d", fontStyle: "italic" }}
                  >
                    Calculated from 4 Projected Quarterly EPS inputs below
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Quarterly Breakdown Toggle Switch */}
          <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed #cbd5e1" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "#334155" }}
                >
                  Detailed Quarterly EPS Breakdown Input
                </Typography>
                <Switch
                  checked={quarterlyMode}
                  onChange={(e) => setQuarterlyMode(e.target.checked)}
                  color="primary"
                  size="small"
                />
              </Stack>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {quarterlyMode
                  ? "Custom 8-Quarter Entry Active"
                  : "Direct Annual Sum Active"}
              </Typography>
            </Stack>

            {quarterlyMode && (
              <Grid container spacing={2}>
                {/* Trailing Quarters */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fffbf0" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "bold",
                        color: "#b45309",
                        display: "block",
                        mb: 1.5,
                      }}
                    >
                      Trailing 4 Quarters EPS (Actuals)
                    </Typography>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="Q1 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.q1}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              q1: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="Q2 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.q2}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              q2: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="Q3 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.q3}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              q3: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="Q4 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.q4}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              q4: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Forward Quarters */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f0fdf4" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "bold",
                        color: "#15803d",
                        display: "block",
                        mb: 1.5,
                      }}
                    >
                      Forward 4 Quarters EPS (Estimates)
                    </Typography>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="FQ1 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.fq1}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              fq1: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="FQ2 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.fq2}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              fq2: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="FQ3 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.fq3}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              fq3: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="FQ4 EPS"
                          size="small"
                          type="number"
                          value={quarterlyEps.fq4}
                          onChange={(e) =>
                            setQuarterlyEps({
                              ...quarterlyEps,
                              fq4: parseFloat(e.target.value) || 0,
                            })
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        </>
      ) : (
        /* CORPORATE MODE CONTROLS */
        <Grid container spacing={3}>
          {/* Market Cap */}
          <Grid size={{ xs: 12, md: 3 }}>
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Market Cap ($)
                </Typography>
                <Chip
                  label={formatCompactCurrency(marketCap)}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#e0f2fe",
                    color: "#0369a1",
                  }}
                />
              </Stack>
              <Slider
                min={100000000}
                max={500000000000}
                step={500000000}
                value={marketCap}
                onChange={(_, val) => setMarketCap(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => formatCompactCurrency(val)}
                sx={{ color: "#0284c7" }}
              />
            </Box>
          </Grid>

          {/* Shares Outstanding */}
          <Grid size={{ xs: 12, md: 3 }}>
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Shares Outstanding
                </Typography>
                <Chip
                  label={`${(sharesOutstanding / 1e6).toFixed(1)}M`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#f3e8ff",
                    color: "#6b21a8",
                  }}
                />
              </Stack>
              <Slider
                min={1000000}
                max={10000000000}
                step={5000000}
                value={sharesOutstanding}
                onChange={(_, val) => setSharesOutstanding(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${(val / 1e6).toFixed(1)}M`}
                sx={{ color: "#7c3aed" }}
              />
            </Box>
          </Grid>

          {/* Trailing TTM Net Income */}
          <Grid size={{ xs: 12, md: 3 }}>
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  TTM Net Income ($)
                </Typography>
                <Chip
                  label={formatCompactCurrency(ttmNetIncome)}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#fef3c7",
                    color: "#b45309",
                  }}
                />
              </Stack>
              <Slider
                min={10000000}
                max={50000000000}
                step={50000000}
                value={ttmNetIncome}
                onChange={(_, val) => setTtmNetIncome(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => formatCompactCurrency(val)}
                sx={{ color: "#d97706" }}
              />
            </Box>
          </Grid>

          {/* Forward 12M Net Income */}
          <Grid size={{ xs: 12, md: 3 }}>
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Forward Net Income ($)
                </Typography>
                <Chip
                  label={formatCompactCurrency(forwardNetIncome)}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#dcfce7",
                    color: "#15803d",
                  }}
                />
              </Stack>
              <Slider
                min={10000000}
                max={50000000000}
                step={50000000}
                value={forwardNetIncome}
                onChange={(_, val) => setForwardNetIncome(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => formatCompactCurrency(val)}
                sx={{ color: "#16a34a" }}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ADDITIONAL VALUATION DRIVERS (Growth Rate & Industry Benchmark) */}
      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0" }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", color: "#334155", mb: 2 }}
        >
          Comparative Benchmarks & Valuation Modifiers
        </Typography>

        <Grid container spacing={3}>
          {/* Long Term Growth Rate % */}
          <Grid size={{ xs: 12, md: 6 }}>
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
                    Expected EPS Growth Rate (g %)
                  </Typography>
                  <Tooltip title="Long-term expected annual growth rate used to calculate the PEG ratio (Price/Earnings to Growth).">
                    <HelpOutlineIcon
                      fontSize="small"
                      sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                    />
                  </Tooltip>
                </Stack>
                <Chip
                  label={`${growthRate.toFixed(1)}% p.a.`}
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
                max={50}
                step={0.5}
                value={growthRate}
                onChange={(_, val) => setGrowthRate(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val}%`}
                sx={{ color: "#7c3aed" }}
              />
            </Box>
          </Grid>

          {/* Benchmark / Industry P/E Multiple */}
          <Grid size={{ xs: 12, md: 6 }}>
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
                    Benchmark / Sector P/E (x)
                  </Typography>
                  <Tooltip title="Industry average or benchmark index (e.g. S&P 500 P/E ~20x) for relative valuation comparison.">
                    <HelpOutlineIcon
                      fontSize="small"
                      sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                    />
                  </Tooltip>
                </Stack>
                <Chip
                  label={`${benchmarkPe.toFixed(1)}x`}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
              </Stack>
              <Slider
                min={5}
                max={60}
                step={0.5}
                value={benchmarkPe}
                onChange={(_, val) => setBenchmarkPe(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val}x`}
                sx={{ color: "#475569" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Inputs;
