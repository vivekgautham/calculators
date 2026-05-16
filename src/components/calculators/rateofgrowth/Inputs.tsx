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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRateOfGrowth, GrowthFrequency, AVAILABLE_COLORS } from "./RateOfGrowthContext";

const Inputs: React.FC = () => {
  const { scenarios, addScenario, removeScenario, updateScenario } = useRateOfGrowth();

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={2}>
        {scenarios.map((scenario, index) => (
          <Box key={scenario.key}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "4px",
                  backgroundColor: scenario.color,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                {scenario.name} (ID: {scenario.id})
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
                label="Scenario ID"
                value={scenario.id}
                onChange={(e) => updateScenario(scenario.key, { id: e.target.value })}
                fullWidth
                size="small"
              />
              <TextField
                label="Scenario Name"
                value={scenario.name}
                onChange={(e) => updateScenario(scenario.key, { name: e.target.value })}
                fullWidth
                size="small"
              />

              <FormControl fullWidth size="small">
                <InputLabel>Color</InputLabel>
                <Select
                  value={scenario.color}
                  label="Color"
                  onChange={(e) => updateScenario(scenario.key, { color: e.target.value })}
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

              <TextField
                label="Initial Amount"
                type="number"
                value={scenario.initialAmount}
                onChange={(e) =>
                  updateScenario(scenario.key, { initialAmount: Number(e.target.value) })
                }
                fullWidth
                size="small"
              />

              <FormControl fullWidth size="small">
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={scenario.frequency}
                  label="Frequency"
                  onChange={(e) =>
                    updateScenario(scenario.key, {
                      frequency: e.target.value as GrowthFrequency,
                    })
                  }
                >
                  {Object.values(GrowthFrequency).map((freq) => (
                    <MenuItem key={freq} value={freq}>
                      {freq}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Rate (%)"
                type="number"
                value={scenario.rate}
                onChange={(e) =>
                  updateScenario(scenario.key, { rate: Number(e.target.value) })
                }
                fullWidth
                size="small"
              />
              <TextField
                label="Time (Y)"
                type="number"
                value={scenario.timeSpan}
                onChange={(e) =>
                  updateScenario(scenario.key, { timeSpan: Number(e.target.value) })
                }
                fullWidth
                size="small"
              />
            </Stack>
            {index < scenarios.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Inputs;
