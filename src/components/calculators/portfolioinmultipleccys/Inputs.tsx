import React from "react";
import {
  TextField,
  Stack,
  Box,
  IconButton,
  Typography,
  Divider,
  Grid,
  Paper,
  Button,
  ButtonGroup,
  Slider,
  Tooltip,
  Chip,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PublicIcon from "@mui/icons-material/Public";
import { usePortfolioInMultipleCcys } from "./PortfolioInMultipleCcysContext";
import {
  KNOWN_FRED_5Y_RATES,
  getCurrencySymbol,
  convertToUSD,
  formatCurrencyValue,
  formatUSDCompact,
} from "./fredFxHelper";

const POPULAR_CURRENCIES = [
  "USD",
  "INR",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "SGD",
  "CNY",
  "AED",
  "BRL",
  "MXN",
  "ZAR",
];

const Inputs: React.FC = () => {
  const {
    currencies,
    totalYears,
    setTotalYears,
    addCurrency,
    removeCurrency,
    updateCurrency,
  } = usePortfolioInMultipleCcys();

  const handleCorpusStep = (key: string, delta: number) => {
    const curr = currencies.find((c) => c.key === key);
    if (!curr) return;
    const currentVal = parseFloat(curr.corpusAmount.toString()) || 0;
    const nextVal = Math.max(0, currentVal + delta);
    updateCurrency(key, { corpusAmount: nextVal });
  };

  const getCorpusSliderConfig = (ccyCode: string, amount: number) => {
    const isINR = (ccyCode || "").toUpperCase().includes("INR");

    if (isINR) {
      const max = Math.max(
        500_000_000,
        Math.ceil((amount * 1.5) / 50_000_000) * 50_000_000,
      );
      const step = amount >= 500_000_000 ? 5_000_000 : 1_000_000;
      return {
        min: 0,
        max: max,
        step: step,
      };
    }

    if (amount <= 100_000) return { min: 0, max: 500_000, step: 5_000 };
    if (amount <= 1_000_000) return { min: 0, max: 5_000_000, step: 25_000 };
    if (amount <= 10_000_000) return { min: 0, max: 50_000_000, step: 250_000 };
    if (amount <= 100_000_000)
      return { min: 0, max: 200_000_000, step: 1_000_000 };
    return {
      min: 0,
      max: Math.ceil((amount * 1.5) / 10_000_000) * 10_000_000,
      step: 1_000_000,
    };
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={3}>
        {/* Global Parameters Section */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#1e293b", mb: 1.5 }}
          >
            Global Parameters
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#f8fafc",
              borderColor: "#e2e8f0",
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#334155" }}
                >
                  Investment Horizon (Years)
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={`${totalYears} Years`}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#dbeafe",
                      color: "#1e40af",
                    }}
                  />
                  <ButtonGroup size="small" variant="outlined">
                    {[5, 10, 15, 20, 25, 30].map((yr) => (
                      <Button
                        key={yr}
                        variant={
                          Number(totalYears) === yr ? "contained" : "outlined"
                        }
                        onClick={() => setTotalYears(yr)}
                        sx={{ px: 1, minWidth: 36, fontSize: "0.75rem" }}
                      >
                        {yr}Y
                      </Button>
                    ))}
                  </ButtonGroup>
                </Stack>
              </Stack>

              <Slider
                value={Number(totalYears) || 1}
                min={1}
                max={50}
                step={1}
                onChange={(_, val) => setTotalYears(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} Yrs`}
                sx={{ color: "#2563eb", mt: 1 }}
              />
            </Stack>
          </Paper>
        </Box>

        <Divider />

        {/* Currencies Section */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#1e293b" }}
              >
                Currencies ({currencies.length})
              </Typography>
              <Tooltip title="Configure each currency holding in its native currency (e.g. USD $, INR ₹), converted to USD at current FRED spot rates for Year 0 comparison.">
                <HelpOutlineIcon
                  sx={{ color: "#94a3b8", fontSize: 18, cursor: "pointer" }}
                />
              </Tooltip>
            </Stack>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={addCurrency}
              sx={{
                bgcolor: "#2563eb",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Add Currency
            </Button>
          </Stack>

          <Stack spacing={2.5}>
            {currencies.map((currency, index) => {
              const rawCorpus =
                parseFloat(currency.corpusAmount.toString()) || 0;
              const g = (parseFloat(currency.growthRate.toString()) || 0) / 100;
              const d =
                (parseFloat(currency.annualIncDecRate.toString()) || 0) / 100;
              // Effective CAGR in Base Currency = (1+g)*(1+d) - 1
              const effectiveRate = ((1 + g) * (1 + d) - 1) * 100;
              const isPositive = effectiveRate >= 0;

              const ccyCode = (currency.ccyName || "").toUpperCase().trim();
              const isINR = ccyCode.includes("INR");
              const isUSD = ccyCode === "USD";
              const symbol = getCurrencySymbol(ccyCode);
              const fredInfo = KNOWN_FRED_5Y_RATES[ccyCode];
              const usdYear0 = convertToUSD(rawCorpus, ccyCode);

              const sliderCfg = getCorpusSliderConfig(ccyCode, rawCorpus);

              return (
                <Paper
                  key={currency.key}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    borderColor: "#e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Card Top Bar */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2, pb: 1.5, borderBottom: "1px solid #f1f5f9" }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: isINR ? "#fef3c7" : "#e0f2fe",
                          color: isINR ? "#b45309" : "#0369a1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#1e293b" }}
                      >
                        Currency Asset #{index + 1}:{" "}
                        <strong>
                          {currency.ccyName || `CCY-${currency.id}`}
                        </strong>
                        {fredInfo?.flag ? ` ${fredInfo.flag}` : ""}
                        <span
                          style={{
                            color: "#64748b",
                            fontWeight: 400,
                            marginLeft: 6,
                          }}
                        >
                          ({symbol} {ccyCode || "Currency"})
                        </span>
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Tooltip title="Net effective annual compound return in USD base currency combining local growth yield and automatic FRED 5-year currency depreciation/appreciation.">
                        <Chip
                          icon={<TrendingUpIcon />}
                          label={`Effective USD Net: ${isPositive ? "+" : ""}${effectiveRate.toFixed(2)}% / yr`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: isPositive ? "#dcfce7" : "#fee2e2",
                            color: isPositive ? "#15803d" : "#b91c1c",
                          }}
                        />
                      </Tooltip>

                      {currencies.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeCurrency(currency.key)}
                          title="Remove Currency"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  {/* Card Parameters Grid */}
                  <Grid container spacing={2.5}>
                    {/* 1. Currency Name & Automatic FRED 5Y Rate info */}
                    <Grid size={{ xs: 12, md: 3.5 }}>
                      <Stack spacing={1.5}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#334155" }}
                        >
                          Currency Name / Code
                        </Typography>
                        <Autocomplete
                          freeSolo
                          options={POPULAR_CURRENCIES}
                          value={currency.ccyName}
                          onChange={(_, newValue) => {
                            const val = (newValue as string) || "";
                            const code = val.toUpperCase().trim();
                            const meta = KNOWN_FRED_5Y_RATES[code];
                            updateCurrency(currency.key, {
                              ccyName: val,
                              annualIncDecRate:
                                meta !== undefined
                                  ? meta.annualDeprecRate
                                  : currency.annualIncDecRate,
                            });
                          }}
                          onInputChange={(_, newInputValue) => {
                            const code = (newInputValue || "")
                              .toUpperCase()
                              .trim();
                            const meta = KNOWN_FRED_5Y_RATES[code];
                            updateCurrency(currency.key, {
                              ccyName: newInputValue,
                              annualIncDecRate:
                                meta !== undefined
                                  ? meta.annualDeprecRate
                                  : currency.annualIncDecRate,
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="e.g. USD, INR, EUR"
                              size="small"
                              fullWidth
                              sx={{ bgcolor: "white" }}
                            />
                          )}
                        />

                        {/* Automatic FRED 5Y FX Depreciation / Appreciation Badge & Year 0 Spot Rate */}
                        <Box
                          sx={{
                            p: 1.5,
                            bgcolor: "#f1f5f9",
                            borderRadius: 1.5,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <PublicIcon
                              sx={{ color: "#2563eb", fontSize: 18 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700, color: "#1e293b" }}
                            >
                              FRED FX Rates & 5Y Trend
                            </Typography>
                          </Stack>

                          {fredInfo && !isUSD ? (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color:
                                    fredInfo.annualDeprecRate >= 0
                                      ? "#16a34a"
                                      : "#dc2626",
                                }}
                              >
                                {fredInfo.annualDeprecRate >= 0 ? "+" : ""}
                                {fredInfo.annualDeprecRate}% / yr FX
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#334155",
                                  fontSize: "0.75rem",
                                  display: "block",
                                  mt: 0.3,
                                  fontWeight: 600,
                                }}
                              >
                                Current Spot: 1 USD = {fredInfo.endRate}{" "}
                                {ccyCode}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#64748b",
                                  fontSize: "0.7rem",
                                  display: "block",
                                }}
                              >
                                5Y History: {fredInfo.startRate} →{" "}
                                {fredInfo.endRate}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#64748b",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              Base Currency (0.0% FX • 1:1 USD)
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>

                    {/* 2. Sliders: Corpus Amount & Local Growth Rate */}
                    <Grid size={{ xs: 12, md: 8.5 }}>
                      <Stack spacing={2}>
                        {/* Corpus Amount Slider (in Native Currency INR / USD) */}
                        <Box
                          sx={{
                            p: 1.5,
                            bgcolor: "#f8fafc",
                            borderRadius: 1.5,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            sx={{ mb: 1 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#334155" }}
                            >
                              Corpus Amount ({symbol} {currency.ccyName})
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Chip
                                label={formatCurrencyValue(rawCorpus, ccyCode)}
                                size="small"
                                sx={{
                                  fontWeight: "bold",
                                  bgcolor: isINR ? "#fef3c7" : "#e0f2fe",
                                  color: isINR ? "#92400e" : "#0369a1",
                                }}
                              />
                              {!isUSD && (
                                <Chip
                                  label={`Year 0: ≈ ${formatUSDCompact(usdYear0)} USD`}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#2563eb",
                                    borderColor: "#bfdbfe",
                                    bgcolor: "#eff6ff",
                                  }}
                                />
                              )}
                            </Stack>
                          </Stack>

                          <Slider
                            min={sliderCfg.min}
                            max={sliderCfg.max}
                            step={sliderCfg.step}
                            value={rawCorpus}
                            onChange={(_, val) =>
                              updateCurrency(currency.key, {
                                corpusAmount: val as number,
                              })
                            }
                            valueLabelDisplay="auto"
                            valueLabelFormat={(val) =>
                              formatCurrencyValue(val, ccyCode)
                            }
                            sx={{ color: isINR ? "#d97706" : "#0284c7" }}
                          />

                          {/* Quick Step Buttons for Amount */}
                          <Stack
                            direction="row"
                            spacing={0.8}
                            sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#64748b",
                                alignSelf: "center",
                                mr: 0.5,
                              }}
                            >
                              Quick Adjust ({symbol}):
                            </Typography>
                            {isINR ? (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 5_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +50L
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 10_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +1 Crore (₹1Cr)
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 50_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +5 Crore (₹5Cr)
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 100_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +10 Crore (₹10Cr)
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 500_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +50 Crore (₹50Cr)
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(
                                      currency.key,
                                      1_000_000_000,
                                    )
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +100 Crore (₹100Cr)
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 100_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +100K
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 1_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +1M
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 10_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +10M
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleCorpusStep(currency.key, 50_000_000)
                                  }
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 0.8,
                                    minWidth: "auto",
                                  }}
                                >
                                  +50M
                                </Button>
                              </>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              color="inherit"
                              onClick={() =>
                                updateCurrency(currency.key, {
                                  corpusAmount: 0,
                                })
                              }
                              sx={{
                                fontSize: "0.7rem",
                                py: 0.2,
                                px: 0.8,
                                minWidth: "auto",
                                color: "#64748b",
                              }}
                            >
                              Reset
                            </Button>
                          </Stack>
                        </Box>

                        {/* Local Nominal Growth Rate (%) Slider */}
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
                            sx={{ mb: 1 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#334155" }}
                            >
                              Local Nominal Growth Rate (%)
                            </Typography>
                            <Chip
                              label={`${currency.growthRate}% p.a.`}
                              size="small"
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#dcfce7",
                                color: "#15803d",
                              }}
                            />
                          </Stack>

                          <Slider
                            min={0}
                            max={30}
                            step={0.5}
                            value={Number(currency.growthRate) || 0}
                            onChange={(_, val) =>
                              updateCurrency(currency.key, {
                                growthRate: val as number,
                              })
                            }
                            valueLabelDisplay="auto"
                            valueLabelFormat={(val) => `${val}%`}
                            sx={{ color: "#16a34a", mt: 1 }}
                          />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Inputs;
