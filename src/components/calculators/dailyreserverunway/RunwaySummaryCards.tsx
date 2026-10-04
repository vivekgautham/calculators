import React from "react";
import { Paper, Box, Typography, Stack, Chip, Divider } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useDailyReserveRunway } from "./DailyReserveRunwayContext";

export const RunwaySummaryCards: React.FC = () => {
  const {
    totalReserve,
    totalDays,
    startDateFormatted,
    endDateFormatted,
    dailyAllowanceCash,
    weeklyAllowanceCash,
    monthlyAllowanceCash,
    annualAllowanceCash,
    formatCurrency,
  } = useDailyReserveRunway();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: "16px",
        background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
        color: "#ffffff",
        boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Top Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <TodayIcon sx={{ fontSize: 22, color: "#7dd3fc" }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              fontSize: "13px",
              color: "#e0f2fe",
            }}
          >
            Estimated Daily Allowance
          </Typography>
        </Stack>

        <Chip
          icon={<CalendarMonthIcon style={{ fontSize: 14, color: "#0369a1" }} />}
          label={`${startDateFormatted} – ${endDateFormatted} (${totalDays.toLocaleString()} days)`}
          size="small"
          sx={{
            bgcolor: "#ffffff",
            color: "#0369a1",
            fontWeight: 700,
            fontSize: "12px",
            height: "26px",
          }}
        />
      </Stack>

      {/* Primary Headline: Amount for Each Day */}
      <Box sx={{ my: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "40px", sm: "52px" },
            letterSpacing: "-1px",
            lineHeight: 1.1,
          }}
        >
          {formatCurrency(dailyAllowanceCash)}
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#bae6fd",
              marginLeft: "8px",
            }}
          >
            / day
          </span>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#e0f2fe",
            fontSize: "14px",
            mt: 1,
            fontWeight: 500,
          }}
        >
          You have <b>{formatCurrency(dailyAllowanceCash)}</b> to spend every single day across your{" "}
          <b>{totalDays.toLocaleString()}</b> calendar day horizon.
        </Typography>
      </Box>

      {/* Simple Equation Pill */}
      <Box
        sx={{
          my: 2.5,
          p: 1.5,
          px: 2,
          borderRadius: "10px",
          bgcolor: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          display: "inline-flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "13px", color: "#f0f9ff" }}>
          <b>Formula:</b> Total Reserve (<b>{formatCurrency(totalReserve, 0)}</b>) ÷ Exact Duration (
          <b>{totalDays.toLocaleString()} days</b>) = <b>{formatCurrency(dailyAllowanceCash)}/day</b>
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />

      {/* Secondary Benchmark Equivalents */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 4 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: "#bae6fd", fontSize: "11px", display: "block" }}>
            Weekly Equivalent (7 Days)
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "16px", color: "#ffffff" }}>
            {formatCurrency(weeklyAllowanceCash)} <span style={{ fontSize: "12px", fontWeight: 500 }}>/ wk</span>
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "#bae6fd", fontSize: "11px", display: "block" }}>
            Monthly Equivalent (Avg 30.4 Days)
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "16px", color: "#ffffff" }}>
            {formatCurrency(monthlyAllowanceCash)} <span style={{ fontSize: "12px", fontWeight: 500 }}>/ mo</span>
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "#bae6fd", fontSize: "11px", display: "block" }}>
            Annual Equivalent (Per Year)
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "16px", color: "#ffffff" }}>
            {formatCurrency(annualAllowanceCash, 0)} <span style={{ fontSize: "12px", fontWeight: 500 }}>/ yr</span>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default RunwaySummaryCards;
