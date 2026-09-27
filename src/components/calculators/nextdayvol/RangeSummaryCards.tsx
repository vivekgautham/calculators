import React from "react";
import { Grid, Paper, Box, Typography, Stack, Tooltip } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNextDayVol } from "./NextDayVolContext";
import { formatCurrency, formatNumber } from "./calculations";

export const RangeSummaryCards: React.FC = () => {
  const { result } = useNextDayVol();

  return (
    <Grid container spacing={2.5}>
      {/* 1. Expected 1-Day Move */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            height: "100%",
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#166534",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "12px",
                }}
              >
                Expected 1-Day Move
              </Typography>
              <Tooltip title="Daily implied volatility calculated as VIX / √252 (or Rule of 16)">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: "#16a34a" }} />
              </Tooltip>
            </Stack>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#14532d",
                letterSpacing: "-0.5px",
              }}
            >
              ±{formatNumber(result.dailyVolPercent, 2)}%
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: "#15803d",
                mt: 0.5,
              }}
            >
              ±{formatCurrency(result.expectedMoveDollars)} pts
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "#166534",
              display: "block",
              mt: 2,
              pt: 1,
              borderTop: "1px dashed #bbf7d0",
              fontSize: "11px",
            }}
          >
            VIX {formatNumber(result.vix, 2)} ÷ √252 (Rule of 16 ≈ ±
            {formatNumber(result.ruleOf16VolPercent, 2)}%)
          </Typography>
        </Paper>
      </Grid>

      {/* 2. 68% Expected Range (1-Sigma) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            height: "100%",
            bgcolor: "#eff6ff",
            border: "1px solid #bfdbfe",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#1e40af",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "12px",
                }}
              >
                68% Normal Range (1σ)
              </Typography>
              <ShieldOutlinedIcon sx={{ fontSize: 18, color: "#2563eb" }} />
            </Stack>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#1e3a8a",
                letterSpacing: "-0.3px",
              }}
            >
              {formatNumber(result.sigma1Lower, 2)} –{" "}
              {formatNumber(result.sigma1Upper, 2)}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#3b82f6",
                mt: 0.5,
              }}
            >
              Range width: {formatCurrency(result.expectedMoveDollars * 2)}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "#1e40af",
              display: "block",
              mt: 2,
              pt: 1,
              borderTop: "1px dashed #bfdbfe",
              fontSize: "11px",
            }}
          >
            ~68.3% of trading days are expected to close within this bracket
          </Typography>
        </Paper>
      </Grid>

      {/* 3. 95% Extreme Range (2-Sigma) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            height: "100%",
            bgcolor: "#faf5ff",
            border: "1px solid #e9d5ff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#6b21a8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "12px",
                }}
              >
                95% Extreme Range (2σ)
              </Typography>
              <WarningAmberIcon sx={{ fontSize: 18, color: "#9333ea" }} />
            </Stack>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#581c87",
                letterSpacing: "-0.3px",
              }}
            >
              {formatNumber(result.sigma2Lower, 2)} –{" "}
              {formatNumber(result.sigma2Upper, 2)}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#8b5cf6",
                mt: 0.5,
              }}
            >
              Range width: {formatCurrency(result.expectedMoveDollars * 4)}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "#6b21a8",
              display: "block",
              mt: 2,
              pt: 1,
              borderTop: "1px dashed #e9d5ff",
              fontSize: "11px",
            }}
          >
            Only ~4.5% of trading days breach this outer boundary (tail moves)
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RangeSummaryCards;
