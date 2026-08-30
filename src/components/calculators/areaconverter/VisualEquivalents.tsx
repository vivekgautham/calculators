import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Stack,
  LinearProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAreaConverter } from "./AreaConverterContext";

export const VisualEquivalents: React.FC = () => {
  const { benchmarks, areaInSqMeters, formatValue } = useAreaConverter();

  if (areaInSqMeters <= 0) return null;

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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <VisibilityIcon sx={{ color: "#0891b2", fontSize: 26 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "700", color: "#1e293b" }}>
            Real-World Area Equivalents
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Visualize this area compared against standard physical landmarks &
            sports fields
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {benchmarks.map((item) => {
          const count = item.count;
          let displayCount = "";
          if (count >= 1000) {
            displayCount = formatValue(count);
          } else if (count >= 1) {
            displayCount = count.toFixed(2);
          } else if (count >= 0.001) {
            displayCount = count.toFixed(4);
          } else {
            displayCount = count.toExponential(3);
          }

          // Progress percentage representation (capped at 100 for visual)
          const progressPercent = Math.min(100, Math.max(2, count * 100));

          return (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography sx={{ fontSize: "1.75rem" }}>
                      {item.icon}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "700",
                        color: "#475569",
                        bgcolor: "#e2e8f0",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                      }}
                    >
                      {item.areaSqMeters >= 10000
                        ? `${(item.areaSqMeters / 10000).toFixed(1)} ha`
                        : `${item.areaSqMeters.toLocaleString()} m²`}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "700", color: "#1e293b" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", display: "block", mb: 1 }}
                  >
                    {item.description}
                  </Typography>
                </Box>

                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "800", color: "#0891b2", mb: 0.5 }}
                  >
                    ~{displayCount}{" "}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ fontWeight: "600", color: "#475569" }}
                    >
                      {item.unitLabel}
                    </Typography>
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#e2e8f0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#0891b2",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default VisualEquivalents;
