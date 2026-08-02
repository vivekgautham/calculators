import React from "react";
import {
  Box,
  Paper,
  Typography,
  Slider,
  Stack,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PublicIcon from "@mui/icons-material/Public";
import {
  usePopulationGrowth,
  PRESETS,
  ScenarioState,
  getFlagEmoji,
} from "./PopulationGrowthContext";

const Inputs: React.FC = () => {
  const {
    scenarioA,
    setScenarioA,
    scenarioB,
    setScenarioB,
    timeHorizon,
    setTimeHorizon,
  } = usePopulationGrowth();

  const handlePresetChange = (
    key: string,
    setScenario: React.Dispatch<React.SetStateAction<ScenarioState>>,
  ) => {
    const preset = PRESETS[key];
    if (preset) {
      setScenario((prev: ScenarioState) => ({
        ...prev,
        presetKey: key,
        fertility: preset.fertility,
        lifeExpectancy: preset.lifeExpectancy,
        netMigration: preset.netMigration,
        youthRatio: preset.youthRatio,
        workingRatio: preset.workingRatio,
        elderlyRatio: preset.elderlyRatio,
      }));
    }
  };

  const handleCustomChange = (
    field: string,
    val: number,
    setScenario: React.Dispatch<React.SetStateAction<ScenarioState>>,
  ) => {
    setScenario((prev: ScenarioState) => ({
      ...prev,
      [field]: val,
    }));
  };

  const renderScenarioInputs = (
    title: string,
    scenario: typeof scenarioA,
    setScenario: typeof setScenarioA,
    primaryColor: string,
  ) => {
    return (
      <Paper
        elevation={2}
        sx={{ p: 2.5, borderRadius: 2, borderTop: `4px solid ${primaryColor}` }}
      >
        <Stack spacing={2.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <PublicIcon sx={{ color: primaryColor }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#1a2035" }}
            >
              {title}
            </Typography>
          </Box>
          <Divider />

          {/* Preset Selector */}
          <FormControl size="small" fullWidth>
            <InputLabel id="preset-label">Country/Scenario Preset</InputLabel>
            <Select
              labelId="preset-label"
              value={scenario.presetKey}
              label="Country/Scenario Preset"
              onChange={(e) =>
                handlePresetChange(e.target.value as string, setScenario)
              }
              renderValue={(value) =>
                `${getFlagEmoji(value as string)} ${PRESETS[value as string]?.name || value}`
              }
            >
              {Object.keys(PRESETS).map((key) => (
                <MenuItem key={key} value={key}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">{getFlagEmoji(key)}</Typography>
                    <Typography variant="body2">{PRESETS[key].name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Initial Population */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Initial Population:{" "}
              {scenario.initialPopulation >= 1000000000
                ? `${(scenario.initialPopulation / 1000000000).toFixed(2)} Billion`
                : `${(scenario.initialPopulation / 1000000).toFixed(1)} Million`}
            </Typography>
            <Slider
              min={10000000}
              max={2000000000}
              step={10000000}
              value={scenario.initialPopulation}
              onChange={(_, val) =>
                handleCustomChange(
                  "initialPopulation",
                  val as number,
                  setScenario,
                )
              }
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) =>
                val >= 1000000000
                  ? `${(val / 1000000000).toFixed(1)}B`
                  : `${(val / 1000000).toFixed(0)}M`
              }
              sx={{ color: primaryColor }}
            />
          </Box>

          {/* Fertility Rate */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Fertility Rate: {scenario.fertility.toFixed(2)} births / woman
            </Typography>
            <Slider
              min={0.5}
              max={7.0}
              step={0.05}
              value={scenario.fertility}
              onChange={(_, val) =>
                handleCustomChange("fertility", val as number, setScenario)
              }
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `${val.toFixed(2)}`}
              sx={{ color: primaryColor }}
            />
          </Box>

          {/* Life Expectancy */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Life Expectancy: {scenario.lifeExpectancy} Years
            </Typography>
            <Slider
              min={45}
              max={95}
              step={1}
              value={scenario.lifeExpectancy}
              onChange={(_, val) =>
                handleCustomChange("lifeExpectancy", val as number, setScenario)
              }
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `${val} yrs`}
              sx={{ color: primaryColor }}
            />
          </Box>

          {/* Net Migration */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Annual Net Migration: {scenario.netMigration >= 0 ? "+" : ""}
              {scenario.netMigration.toLocaleString()} people
            </Typography>
            <Slider
              min={-1000000}
              max={2000000}
              step={25000}
              value={scenario.netMigration}
              onChange={(_, val) =>
                handleCustomChange("netMigration", val as number, setScenario)
              }
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) =>
                `${val >= 0 ? "+" : ""}${(val / 1000).toFixed(0)}k`
              }
              sx={{ color: primaryColor }}
            />
          </Box>
        </Stack>
      </Paper>
    );
  };

  return (
    <Stack spacing={3}>
      {/* Global Config Card */}
      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, bgcolor: "#f8f9fa" }}>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <SettingsIcon color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                color: "#1a2035",
                textTransform: "uppercase",
              }}
            >
              Simulation Global Parameters
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Simulation Timeframe: {timeHorizon} Years
            </Typography>
            <Slider
              min={10}
              max={500}
              step={10}
              value={timeHorizon}
              onChange={(_, val) => setTimeHorizon(val as number)}
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `${val} Years`}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Scenarios Side-by-side Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {renderScenarioInputs("Scenario A", scenarioA, setScenarioA, "#00b5ad")}
        {renderScenarioInputs("Scenario B", scenarioB, setScenarioB, "#F39C12")}
      </Box>
    </Stack>
  );
};

export default Inputs;
