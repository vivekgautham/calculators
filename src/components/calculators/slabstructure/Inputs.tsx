import React from "react";
import {
  Box,
  Paper,
  Typography,
  Slider,
  Stack,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useSlabStructure, formatINR } from "./SlabStructureContext";

const PRESET_AMOUNTS = [
  { label: "₹1 Lakh", value: 100000 },
  { label: "₹2.5 Lakh", value: 250000 },
  { label: "₹5 Lakh", value: 500000 },
  { label: "₹10 Lakh", value: 1000000 },
  { label: "₹15 Lakh", value: 1500000 },
  { label: "₹20 Lakh", value: 2000000 },
];

const Inputs: React.FC = () => {
  const {
    config,
    updateConfig,
    selectedAmount,
    setSelectedAmount,
    chartMinAmount,
    setChartMinAmount,
    chartMaxAmount,
    setChartMaxAmount,
  } = useSlabStructure();

  return (
    <Stack spacing={2.5}>
      {/* Primary Transaction Amount Card */}
      <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, bgcolor: "#ffffff" }}>
        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#1a2035" }}
            >
              Selected Transaction Amount (ACE)
            </Typography>
            <Chip
              label={formatINR(selectedAmount)}
              color="primary"
              sx={{ fontWeight: "bold", fontSize: "14px", px: 1 }}
            />
          </Box>

          <Box sx={{ px: 1 }}>
            <Slider
              min={10000}
              max={5000000} // ₹50 Lakh max
              step={10000}
              value={selectedAmount}
              onChange={(_, val) => setSelectedAmount(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => formatINR(val)}
              sx={{
                color: "#00b5ad",
                height: 8,
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                },
              }}
            />
          </Box>

          {/* Quick Preset Buttons */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Typography
              variant="caption"
              sx={{ alignSelf: "center", color: "#666", mr: 1 }}
            >
              Quick Presets:
            </Typography>
            {PRESET_AMOUNTS.map((preset) => (
              <Chip
                key={preset.value}
                label={preset.label}
                onClick={() => setSelectedAmount(preset.value)}
                variant={
                  selectedAmount === preset.value ? "filled" : "outlined"
                }
                color={selectedAmount === preset.value ? "primary" : "default"}
                size="small"
                sx={{ cursor: "pointer", fontWeight: "medium" }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* Chart Range & Resolution Controls */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: "#f8f9fa" }}>
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <ShowChartIcon color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#2c3e50" }}
            >
              Chart Range Settings (1 Lakh to 20 Lakh)
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Chart Min Amount: {formatINR(chartMinAmount)}
              </Typography>
              <Slider
                min={0}
                max={500000}
                step={25000}
                value={chartMinAmount}
                onChange={(_, val) => setChartMinAmount(val as number)}
                size="small"
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => formatINR(val)}
              />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Chart Max Amount: {formatINR(chartMaxAmount)}
              </Typography>
              <Slider
                min={500000}
                max={5000000}
                step={50000}
                value={chartMaxAmount}
                onChange={(_, val) => setChartMaxAmount(val as number)}
                size="small"
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => formatINR(val)}
              />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Advanced Slab Parameters Accordion */}
      <Accordion
        elevation={1}
        sx={{ borderRadius: "8px !important", overflow: "hidden" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TuneIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Slab Tier Rate Rules Configuration
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: "#fdfdfd" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {/* Tier 1 Settings */}
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#00b5ad" }}
              >
                TIER 1 (Up to ₹1 Lakh)
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <TextField
                  label="Rate (%)"
                  type="number"
                  size="small"
                  value={config.tier1Rate}
                  onChange={(e) =>
                    updateConfig({ tier1Rate: parseFloat(e.target.value) || 0 })
                  }
                  inputProps={{ step: 0.01 }}
                />
                <TextField
                  label="Min GST (₹)"
                  type="number"
                  size="small"
                  value={config.tier1MinGst}
                  onChange={(e) =>
                    updateConfig({
                      tier1MinGst: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <TextField
                  label="Max GST (₹)"
                  type="number"
                  size="small"
                  value={config.tier1MaxGst}
                  onChange={(e) =>
                    updateConfig({
                      tier1MaxGst: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </Stack>
            </Box>

            {/* Tier 2 Settings */}
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#2E86C1" }}
              >
                TIER 2 (₹1 Lakh to ₹10 Lakh)
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <TextField
                  label="Base GST (₹)"
                  type="number"
                  size="small"
                  value={config.tier2BaseGst}
                  onChange={(e) =>
                    updateConfig({
                      tier2BaseGst: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <TextField
                  label="Marginal Rate (%)"
                  type="number"
                  size="small"
                  value={config.tier2Rate}
                  onChange={(e) =>
                    updateConfig({ tier2Rate: parseFloat(e.target.value) || 0 })
                  }
                  inputProps={{ step: 0.01 }}
                />
              </Stack>
            </Box>

            {/* Tier 3 Settings */}
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#8E44AD" }}
              >
                TIER 3 (Above ₹10 Lakh)
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <TextField
                  label="Base GST (₹)"
                  type="number"
                  size="small"
                  value={config.tier3BaseGst}
                  onChange={(e) =>
                    updateConfig({
                      tier3BaseGst: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <TextField
                  label="Marginal Rate (%)"
                  type="number"
                  size="small"
                  value={config.tier3Rate}
                  onChange={(e) =>
                    updateConfig({ tier3Rate: parseFloat(e.target.value) || 0 })
                  }
                  inputProps={{ step: 0.001 }}
                />
                <TextField
                  label="Max GST Cap (₹)"
                  type="number"
                  size="small"
                  value={config.maxGstCap}
                  onChange={(e) =>
                    updateConfig({ maxGstCap: parseFloat(e.target.value) || 0 })
                  }
                />
              </Stack>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              size="small"
              onClick={() =>
                updateConfig({
                  tier1Rate: 0.18,
                  tier1MinGst: 45,
                  tier1MaxGst: 180,
                  tier2BaseGst: 180,
                  tier2Rate: 0.09,
                  tier3BaseGst: 990,
                  tier3Rate: 0.018,
                  maxGstCap: 60000,
                })
              }
            >
              Reset Rules to Default
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default Inputs;
