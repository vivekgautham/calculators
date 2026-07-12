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
  Divider,
  Slider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  useRateOfGrowth,
  GrowthFrequency,
  AVAILABLE_COLORS,
} from "./RateOfGrowthContext";

const formatLargeAmount = (value: number): string => {
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absoluteValue >= 1e12) {
    return `${sign}${(absoluteValue / 1e12).toFixed(2)}T`;
  }
  if (absoluteValue >= 1e9) {
    return `${sign}${(absoluteValue / 1e9).toFixed(2)}B`;
  }
  if (absoluteValue >= 1e6) {
    return `${sign}${(absoluteValue / 1e6).toFixed(2)}M`;
  }
  if (absoluteValue >= 1e3) {
    return `${sign}${(absoluteValue / 1e3).toFixed(2)}K`;
  }
  return `${sign}${absoluteValue.toLocaleString()}`;
};

const Inputs: React.FC = () => {
  const {
    scenarios,
    addScenario,
    removeScenario,
    updateScenario,
    timeSpan,
    setTimeSpan,
    frequency,
    setFrequency,
  } = useRateOfGrowth();

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={3}>
        {/* Global Controls Panel */}
        <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f8f9fa" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 2, color: "#1a2035", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Global Calculation Settings
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
            {/* Time (Y) Slider */}
            <Box sx={{ flexGrow: 1, width: "100%", px: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
                Time Span: {timeSpan} {timeSpan === 1 ? "Year" : "Years"}
              </Typography>
              <Slider
                min={1}
                max={500}
                step={1}
                value={timeSpan}
                onChange={(_, val) => setTimeSpan(val as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val}Y`}
              />
            </Box>

            {/* Compounding Frequency Selection */}
            <FormControl sx={{ minWidth: 220, width: { xs: "100%", md: "auto" } }} size="small">
              <InputLabel>Compounding Frequency</InputLabel>
              <Select
                value={frequency}
                label="Compounding Frequency"
                onChange={(e) => setFrequency(e.target.value as GrowthFrequency)}
              >
                {Object.values(GrowthFrequency).map((freq) => (
                  <MenuItem key={freq} value={freq}>
                    {freq}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        <Divider />

        {/* Scenarios Parameters List */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 2, color: "#1a2035", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Scenario Parameters
          </Typography>
          <Stack spacing={3}>
            {scenarios.map((scenario, index) => (
              <Box key={scenario.key}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "4px",
                      backgroundColor: scenario.color,
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", flexGrow: 1 }}
                  >
                    {scenario.name}
                  </Typography>

                  <Stack direction="row" spacing={0.5}>
                    {scenarios.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeScenario(scenario.key)}
                        title="Remove Scenario"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    {index === scenarios.length - 1 && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={addScenario}
                        title="Add Scenario"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <TextField
                    label="Scenario Name"
                    value={scenario.name}
                    onChange={(e) =>
                      updateScenario(scenario.key, { name: e.target.value })
                    }
                    fullWidth
                    size="small"
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={scenario.color}
                      label="Color"
                      onChange={(e) =>
                        updateScenario(scenario.key, { color: e.target.value })
                      }
                    >
                      {AVAILABLE_COLORS.map((color) => (
                        <MenuItem key={color} value={color}>
                          <Stack direction="row" alignItems="center" spacing={1}>
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

                  {/* Initial Amount Slider */}
                  <Box sx={{ width: "100%", px: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: -0.5 }}>
                      Initial Amount: {formatLargeAmount(scenario.initialAmount)}
                    </Typography>
                    <Slider
                      min={0}
                      max={50000000000000} // 50T
                      step={1000000} // 1M
                      value={scenario.initialAmount}
                      onChange={(_, val) =>
                        updateScenario(scenario.key, { initialAmount: val as number })
                      }
                      size="small"
                      valueLabelDisplay="auto"
                      valueLabelFormat={formatLargeAmount}
                    />
                  </Box>

                  {/* Rate (%) Slider */}
                  <Box sx={{ width: "100%", px: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: -0.5 }}>
                      Rate: {scenario.rate.toFixed(1)}%
                    </Typography>
                    <Slider
                      min={0}
                      max={30}
                      step={0.1}
                      value={scenario.rate}
                      onChange={(_, val) =>
                        updateScenario(scenario.key, { rate: val as number })
                      }
                      size="small"
                      valueLabelDisplay="auto"
                      valueLabelFormat={(val) => `${val.toFixed(1)}%`}
                    />
                  </Box>
                </Stack>
                {index < scenarios.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Inputs;
