import React from "react";
import { Paper, Typography, Grid, Box, Stack, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PercentIcon from "@mui/icons-material/Percent";
import { useForeignCurrencyFD } from "./ForeignCurrencyFDContext";

export const SummaryCards: React.FC = () => {
  const {
    effectiveGrossAmount,
    totalCashReturned,
    netProfitLossDollar,
    netCagrPct,
    totalFeesDollar,
    feeDragPct,
    years,
  } = useForeignCurrencyFD();

  const isProfit = netProfitLossDollar >= 0;
  const netReturnTotalPct =
    effectiveGrossAmount > 0
      ? (netProfitLossDollar / effectiveGrossAmount) * 100
      : 0;

  return (
    <Grid container spacing={3}>
      {/* 1. Net Return Amount ($) Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: `1px solid ${isProfit ? "#86efac" : "#fca5a5"}`,
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1.5 }}
          >
            <Box
              sx={{
                p: 1.2,
                bgcolor: isProfit ? "#dcfce7" : "#fee2e2",
                borderRadius: 2,
                color: isProfit ? "#15803d" : "#b91c1c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUpIcon fontSize="medium" />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#475569" }}
            >
              Net Return Amount ($)
            </Typography>
          </Stack>

          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: isProfit ? "#15803d" : "#b91c1c",
              my: 1,
            }}
          >
            $
            {totalCashReturned.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 1.5 }}
          >
            <Chip
              label={`Net Profit / Loss: ${isProfit ? "+" : ""}$${netProfitLossDollar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              size="medium"
              sx={{
                fontWeight: "bold",
                bgcolor: isProfit ? "#dcfce7" : "#fee2e2",
                color: isProfit ? "#15803d" : "#b91c1c",
                fontSize: "0.85rem",
              }}
            />
            <Chip
              label={`Total Fees Paid: -$${totalFeesDollar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              size="medium"
              sx={{
                fontWeight: "bold",
                bgcolor: "#f1f5f9",
                color: "#475569",
                fontSize: "0.85rem",
              }}
            />
          </Stack>

          <Typography variant="body2" sx={{ color: "#64748b", mt: 2 }}>
            Total net cash received at maturity (Half-Yearly Payouts + Net
            Returned Principal) from initial gross deposit of{" "}
            <strong>${effectiveGrossAmount.toLocaleString()}</strong>.
          </Typography>
        </Paper>
      </Grid>

      {/* 2. Net Return % Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1.5 }}
          >
            <Box
              sx={{
                p: 1.2,
                bgcolor: "#e0f2fe",
                borderRadius: 2,
                color: "#0284c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PercentIcon fontSize="medium" />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#475569" }}
            >
              Net Return %
            </Typography>
          </Stack>

          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#0369a1",
              my: 1,
            }}
          >
            {netCagrPct.toFixed(2)}%{" "}
            <Typography
              component="span"
              variant="h5"
              sx={{ color: "#64748b", fontWeight: "medium" }}
            >
              Net p.a. (CAGR)
            </Typography>
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 1.5 }}
          >
            <Chip
              label={`Total Net Return: ${isProfit ? "+" : ""}${netReturnTotalPct.toFixed(2)}% over ${years} Yrs`}
              size="medium"
              sx={{
                fontWeight: "bold",
                bgcolor: "#e0f2fe",
                color: "#0369a1",
                fontSize: "0.85rem",
              }}
            />
            <Chip
              label={`Total Fee Drag: -${feeDragPct.toFixed(2)}%`}
              size="medium"
              sx={{
                fontWeight: "bold",
                bgcolor: "#fee2e2",
                color: "#b91c1c",
                fontSize: "0.85rem",
              }}
            />
          </Stack>

          <Typography variant="body2" sx={{ color: "#64748b", mt: 2 }}>
            Annualized net compound yield realized after accounting for all FX
            conversion spreads, GST, servicing spreads, and maturity redemption
            fees.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
