import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { usePercentChange } from "./PercentChangeContext";

export const ReturnToBaselineCard: React.FC = () => {
  const { initialValue, finalValue, formatNumber } = usePercentChange();

  const pointsDiff = useMemo(
    () => initialValue - finalValue,
    [initialValue, finalValue],
  );

  const percentChangeNeeded = useMemo(() => {
    if (finalValue <= 0) return 0;
    return (pointsDiff / finalValue) * 100;
  }, [pointsDiff, finalValue]);

  const isIncrease = percentChangeNeeded > 0.001;
  const isDecrease = percentChangeNeeded < -0.001;
  const isNeutral = !isIncrease && !isDecrease;

  // Theme styling based on status
  const cardBorderColor = isIncrease
    ? "#86efac"
    : isDecrease
      ? "#fca5a5"
      : "#cbd5e1";
  const accentColor = isIncrease
    ? "#16a34a"
    : isDecrease
      ? "#dc2626"
      : "#0284c7";
  const bannerBg = isIncrease ? "#f0fdf4" : isDecrease ? "#fef2f2" : "#f8fafc";

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: `1px solid ${cardBorderColor}`,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Stack spacing={2.5}>
          {/* Header Row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
          >
            <Stack direction="row" spacing={1.2} alignItems="center">
              {isIncrease ? (
                <TrendingUpIcon sx={{ color: "#16a34a", fontSize: 26 }} />
              ) : isDecrease ? (
                <TrendingDownIcon sx={{ color: "#dc2626", fontSize: 26 }} />
              ) : (
                <CheckCircleIcon sx={{ color: "#0284c7", fontSize: 26 }} />
              )}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1e293b" }}
              >
                Adjustment to Return to Baseline
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`Baseline: ${formatNumber(initialValue)}`}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderColor: "#94a3b8",
                  color: "#475569",
                }}
              />
              <Chip
                label={`Current: ${formatNumber(finalValue)}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: bannerBg,
                  color: accentColor,
                  border: `1px solid ${cardBorderColor}`,
                }}
              />
            </Stack>
          </Stack>

          {/* Central Callout Banner */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: bannerBg,
              border: `1px solid ${cardBorderColor}`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              component="div"
              sx={{ fontWeight: 800, color: accentColor, mb: 0.5 }}
            >
              {isIncrease
                ? `+${percentChangeNeeded.toFixed(2)}% Increase`
                : isDecrease
                  ? `${percentChangeNeeded.toFixed(2)}% Decrease`
                  : "0.00% (At Baseline)"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#334155" }}
            >
              {isIncrease &&
                `+${formatNumber(Math.abs(pointsDiff))} index points needed to recover back to baseline`}
              {isDecrease &&
                `-${formatNumber(Math.abs(pointsDiff))} index points needed to pull back down to baseline`}
              {isNeutral &&
                `The index is currently at baseline (${formatNumber(initialValue)})`}
            </Typography>
          </Box>

          {/* Detailed Metric Columns */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-around"
            sx={{
              pt: 1,
              px: 2,
              bgcolor: "#f8fafc",
              py: 2,
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Baseline Index
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                {formatNumber(initialValue)}
              </Typography>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", sm: "block" } }}
            />

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Current Index
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                {formatNumber(finalValue)}
              </Typography>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", sm: "block" } }}
            />

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Point Gap
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color:
                    pointsDiff > 0
                      ? "#16a34a"
                      : pointsDiff < 0
                        ? "#dc2626"
                        : "#475569",
                }}
              >
                {pointsDiff > 0
                  ? `+${formatNumber(pointsDiff)}`
                  : pointsDiff < 0
                    ? `-${formatNumber(Math.abs(pointsDiff))}`
                    : "0.00"}
              </Typography>
            </Box>
          </Stack>

          {/* Explanation Footer */}
          <Typography
            variant="body2"
            sx={{ color: "#64748b", fontStyle: "italic", textAlign: "center" }}
          >
            {isIncrease &&
              "Compounding Asymmetry: After a decline, a mathematically higher percentage gain is always required to break even because the subsequent gain applies to a lower base."}
            {isDecrease &&
              "After an advance, a smaller percentage drop is required to return to the original base because the subsequent decline applies to a higher base."}
            {isNeutral &&
              "The current index has had no net deviation from the initial baseline."}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReturnToBaselineCard;
