import React from "react";
import { Paper, Box, Grid, Typography, Chip, Stack } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";
import { useDoublingGrowth, formatLargeNumber } from "./DoublingGrowthContext";

export const ResultsSummary: React.FC = () => {
  const {
    initialValue,
    growthFactor,
    totalDuration,
    timeUnit,
    finalValue,
    totalDoublings,
    overallMultiplier,
    milestones,
  } = useDoublingGrowth();

  const isDoubling = growthFactor === 2;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Starting Value */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              borderLeft: "4px solid #2e7d32",
              border: "1px solid #e2e8f0",
              borderLeftWidth: "4px",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: "medium" }}
            >
              Starting Number (t = 0)
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#2e7d32", my: 0.5 }}
            >
              {formatLargeNumber(initialValue)}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Initial baseline value
            </Typography>
          </Box>
        </Grid>

        {/* End Time Final Value */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              borderLeft: "4px solid #0284c7",
              border: "1px solid #e2e8f0",
              borderLeftWidth: "4px",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: "medium" }}
            >
              Final Number (t = {totalDuration} {timeUnit})
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#0284c7", my: 0.5 }}
            >
              {formatLargeNumber(finalValue)}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Accumulated final growth
            </Typography>
          </Box>
        </Grid>

        {/* Total Doublings / Cycles */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon sx={{ color: "#d97706", fontSize: 20 }} />
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontWeight: "medium" }}
              >
                Growth Cycles
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#d97706", my: 0.5 }}
            >
              {totalDoublings.toFixed(1)} {isDoubling ? "Doublings" : "Cycles"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Over {totalDuration} {timeUnit}
            </Typography>
          </Box>
        </Grid>

        {/* Overall Multiplier */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUpIcon sx={{ color: "#7c3aed", fontSize: 20 }} />
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontWeight: "medium" }}
              >
                Total Growth Factor
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#7c3aed", my: 0.5 }}
            >
              {formatLargeNumber(overallMultiplier)}x
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Factor of original start
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Milestones Reached Banner */}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid #e2e8f0" }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <FlagIcon sx={{ color: "#d97706", fontSize: 18 }} />
            <Typography
              variant="subtitle2"
              sx={{ color: "#475569", fontWeight: "bold" }}
            >
              Milestones Timeline:
            </Typography>
          </Stack>
          {milestones.map((m) => {
            const reached = m.reachedAtTime !== null;
            return (
              <Chip
                key={m.name}
                label={`${m.name}: ${reached ? `at t=${m.reachedAtTime} ${timeUnit}` : "Not reached"}`}
                size="small"
                color={reached ? "success" : "default"}
                variant={reached ? "filled" : "outlined"}
                sx={{
                  fontWeight: "bold",
                  opacity: reached ? 1 : 0.45,
                  fontSize: "11px",
                }}
              />
            );
          })}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ResultsSummary;
