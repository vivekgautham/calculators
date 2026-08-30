import React from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  Alert,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StraightenIcon from "@mui/icons-material/Straighten";
import { useAreaConverter } from "./AreaConverterContext";
import { AREA_UNITS } from "./types";

export const Inputs: React.FC = () => {
  const {
    inputValue,
    setInputValue,
    inputUnit,
    setInputUnit,
    selectedUnitMeta,
    resetToDefault,
    copyNotification,
  } = useAreaConverter();

  const CORE_UNITS = AREA_UNITS.filter((u) => u.isCoreUnit);

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #cbd5e1",
      }}
    >
      {copyNotification && (
        <Alert
          severity="success"
          sx={{ mb: 2, py: 0.5, alignItems: "center" }}
          variant="filled"
        >
          {copyNotification}
        </Alert>
      )}

      {/* Main Input Controls Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <StraightenIcon sx={{ color: "#2563eb", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: "700", color: "#1e293b" }}>
            Select Source Unit & Enter Value
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Reset to default (1 Acre)">
            <IconButton
              size="small"
              onClick={resetToDefault}
              sx={{ color: "#64748b" }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Quick Core Unit Selector Pills at the top */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "700",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            display: "block",
            mb: 1.2,
          }}
        >
          Quick Switch Primary Unit (Click to Select Input):
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {CORE_UNITS.map((unit) => {
            const isSelected = inputUnit === unit.id;
            return (
              <Chip
                key={unit.id}
                label={`${unit.name} (${unit.symbol})`}
                onClick={() => setInputUnit(unit.id)}
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  fontWeight: isSelected ? "800" : "600",
                  fontSize: "0.9rem",
                  py: 2.2,
                  px: 1,
                  cursor: "pointer",
                  bgcolor: isSelected ? unit.accentColor : "#f8fafc",
                  color: isSelected ? "#ffffff" : "#334155",
                  borderColor: isSelected ? unit.accentColor : "#cbd5e1",
                  "&:hover": {
                    bgcolor: isSelected ? unit.accentColor : "#e2e8f0",
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Area Value Text Field */}
      <Box>
        <TextField
          label={`Enter Value in ${selectedUnitMeta.name} (${selectedUnitMeta.symbol})`}
          variant="outlined"
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. 1, 2.5, 100"
          inputProps={{ min: "0", step: "any" }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  sx={{
                    fontWeight: "800",
                    color: selectedUnitMeta.accentColor,
                    fontSize: "1.2rem",
                    mr: 0.5,
                  }}
                >
                  {selectedUnitMeta.symbol}
                </Typography>
              </InputAdornment>
            ),
            endAdornment: inputValue ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setInputValue("")}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "1.35rem",
              fontWeight: "700",
              bgcolor: "#f8fafc",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default Inputs;
