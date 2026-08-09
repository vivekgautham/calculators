import React from "react";
import {
  TextField,
  Stack,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Typography,
  Paper,
  Slider,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  useBlendedInvestment,
  AVAILABLE_COLORS,
  getScaleMultiplier,
  getScaleSuffix,
  AmountScale,
} from "./BlendedInvestmentContext";

const Inputs: React.FC = () => {
  const {
    investments,
    totalYears,
    setTotalYears,
    amountScale,
    setAmountScale,
    addInvestment,
    removeInvestment,
    updateInvestment,
  } = useBlendedInvestment();

  const multiplier = getScaleMultiplier(amountScale);
  const suffix = getScaleSuffix(amountScale);

  // Helper for slider step & max based on selected amount scale
  const getSliderConfig = (scale: AmountScale, currentAmount: number) => {
    const scaledVal = currentAmount / getScaleMultiplier(scale);
    switch (scale) {
      case "thousands":
        return {
          step: 1,
          min: 0,
          max: Math.max(2000, Math.ceil(scaledVal * 1.2)),
        };
      case "millions":
        return {
          step: 0.1,
          min: 0,
          max: Math.max(100, Math.ceil(scaledVal * 1.2)),
        };
      case "billions":
        return {
          step: 0.01,
          min: 0,
          max: Math.max(10, Math.ceil(scaledVal * 1.2)),
        };
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={3}>
        {/* Global Controls Panel */}
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1e293b", mb: 2 }}
          >
            Portfolio Global Settings
          </Typography>

          <Stack spacing={3}>
            {/* Amount Scale Radio Group */}
            <FormControl component="fieldset">
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
              >
                <FormLabel
                  component="legend"
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#475569",
                    textTransform: "uppercase",
                  }}
                >
                  Amount Scale Unit:
                </FormLabel>
                <RadioGroup
                  row
                  name="blended-scale-radio-group"
                  value={amountScale}
                  onChange={(e) =>
                    setAmountScale(e.target.value as AmountScale)
                  }
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

            {/* Total Years Horizon Slider */}
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
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  Investment Horizon (Years)
                </Typography>
                <Chip
                  label={`${totalYears} Years`}
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
                max={50}
                step={1}
                value={totalYears}
                onChange={(_, val) => setTotalYears(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val} Yrs`}
                sx={{ color: "#0284c7" }}
              />
            </Box>
          </Stack>
        </Paper>

        {/* Investment Assets List */}
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1e293b" }}
            >
              Investments Breakdown
            </Typography>
            <IconButton
              size="small"
              color="primary"
              onClick={addInvestment}
              sx={{ bgcolor: "#e0f2fe", "&:hover": { bgcolor: "#bae6fd" } }}
              title="Add New Investment"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            {investments.map((investment) => {
              const scaledAmount = investment.amount / multiplier;
              const sliderCfg = getSliderConfig(amountScale, investment.amount);

              return (
                <Paper
                  key={investment.key}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#f8fafc",
                    borderColor: "#e2e8f0",
                  }}
                >
                  {/* Top Bar for Item */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "4px",
                        backgroundColor: investment.color,
                        border: "1px solid rgba(0,0,0,0.2)",
                        flexShrink: 0,
                      }}
                    />
                    <TextField
                      label="Asset Name"
                      value={investment.name}
                      onChange={(e) =>
                        updateInvestment(investment.key, {
                          name: e.target.value,
                        })
                      }
                      size="small"
                      sx={{ bgcolor: "white", flexGrow: 1 }}
                    />
                    <FormControl
                      size="small"
                      sx={{ width: 140, bgcolor: "white" }}
                    >
                      <InputLabel>Color</InputLabel>
                      <Select
                        value={investment.color}
                        label="Color"
                        onChange={(e) =>
                          updateInvestment(investment.key, {
                            color: e.target.value as string,
                          })
                        }
                      >
                        {AVAILABLE_COLORS.map((color) => (
                          <MenuItem key={color} value={color}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box
                                sx={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: "2px",
                                  backgroundColor: color,
                                }}
                              />
                              <Typography variant="body2">{color}</Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {investments.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeInvestment(investment.key)}
                        title="Remove Investment"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>

                  {/* Sliders Stack */}
                  <Grid container spacing={2.5}>
                    {/* Initial Amount Slider */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "white",
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
                            Initial Amount
                          </Typography>
                          <Chip
                            label={`$${scaledAmount.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })} ${suffix}`}
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              bgcolor: "#e0f2fe",
                              color: "#0369a1",
                            }}
                          />
                        </Stack>
                        <Slider
                          min={sliderCfg.min}
                          max={sliderCfg.max}
                          step={sliderCfg.step}
                          value={scaledAmount}
                          onChange={(_, val) =>
                            updateInvestment(investment.key, {
                              amount: (val as number) * multiplier,
                            })
                          }
                          valueLabelDisplay="auto"
                          valueLabelFormat={(val) => `$${val} ${suffix}`}
                          sx={{ color: investment.color || "#0284c7" }}
                        />
                      </Box>
                    </Grid>

                    {/* Expected Rate (%) Slider */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "white",
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
                            Expected Rate of Return (%)
                          </Typography>
                          <Chip
                            label={`${investment.rate.toFixed(1)}%`}
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
                          step={0.1}
                          value={investment.rate}
                          onChange={(_, val) =>
                            updateInvestment(investment.key, {
                              rate: val as number,
                            })
                          }
                          valueLabelDisplay="auto"
                          valueLabelFormat={(val) => `${val}%`}
                          sx={{ color: "#16a34a" }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Inputs;
