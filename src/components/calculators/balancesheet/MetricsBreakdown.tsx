import React from "react";
import { Paper, Box, Grid, Typography, Chip, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import { useBalanceSheet, MetricEvaluation } from "./BalanceSheetContext";

const getStatusColor = (status: "Healthy" | "Moderate" | "Risk") => {
  switch (status) {
    case "Healthy":
      return {
        bg: "#e8f5e9",
        color: "#2e7d32",
        border: "#a5d6a7",
        icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
      };
    case "Moderate":
      return {
        bg: "#fff8e1",
        color: "#b45309",
        border: "#fde68a",
        icon: <WarningIcon sx={{ fontSize: 18 }} />,
      };
    case "Risk":
      return {
        bg: "#fef2f2",
        color: "#dc2626",
        border: "#fca5a5",
        icon: <ErrorIcon sx={{ fontSize: 18 }} />,
      };
  }
};

export const MetricsBreakdown: React.FC = () => {
  const { metrics } = useBalanceSheet();

  return (
    <Stack spacing={2.5}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e293b" }}>
        Deep-Dive Analysis of 5 Critical Balance Sheet Pillars
      </Typography>

      <Grid container spacing={2.5}>
        {metrics.map((m: MetricEvaluation) => {
          const style = getStatusColor(m.status);

          return (
            <Grid key={m.id} size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                }}
              >
                <Box>
                  {/* Metric Card Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#0f172a" }}
                    >
                      {m.title}
                    </Typography>
                    <Chip
                      icon={style.icon}
                      label={m.status}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: style.bg,
                        color: style.color,
                        border: `1px solid ${style.border}`,
                      }}
                    />
                  </Stack>

                  {/* Calculated Value Display */}
                  <Box
                    sx={{
                      p: 1.5,
                      my: 1.5,
                      bgcolor: "#f8fafc",
                      borderRadius: 1.5,
                      border: "1px solid #e2e8f0",
                      borderLeft: `4px solid ${style.color}`,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: style.color }}
                    >
                      {m.valueDisplay}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {m.subLabel}
                    </Typography>
                  </Box>

                  {/* Why It Matters */}
                  <Box sx={{ mb: 1.5 }}>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{ mb: 0.3 }}
                    >
                      <InfoOutlinedIcon
                        sx={{ color: "#0284c7", fontSize: 16 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "bold",
                          color: "#0284c7",
                          textTransform: "uppercase",
                        }}
                      >
                        Why It Matters
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#334155",
                        fontSize: "13px",
                        lineHeight: 1.45,
                      }}
                    >
                      {m.whyItMatters}
                    </Typography>
                  </Box>
                </Box>

                {/* Rule of Thumb Target */}
                <Box sx={{ pt: 1.5, borderTop: "1px solid #f1f5f9", mt: 1 }}>
                  <Stack
                    direction="row"
                    spacing={0.8}
                    alignItems="center"
                    sx={{ mb: 0.3 }}
                  >
                    <GavelIcon sx={{ color: "#d97706", fontSize: 16 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "bold",
                        color: "#d97706",
                        textTransform: "uppercase",
                      }}
                    >
                      Rule of Thumb Benchmark
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#475569",
                      fontSize: "12px",
                      fontWeight: "medium",
                    }}
                  >
                    {m.ruleOfThumb}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default MetricsBreakdown;
