import React from "react";
import { Paper, Typography, Grid, Box, Stack, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShieldIcon from "@mui/icons-material/Shield";
import PercentIcon from "@mui/icons-material/Percent";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { useForeignCurrencyFD } from "./ForeignCurrencyFDContext";

export const SummaryCards: React.FC = () => {
  const {
    effectiveGrossAmount,
    creationFeesDollar,
    netInvestedDeposit,
    halfYearlyPayoutDollar,
    totalPayoutsCount,
    cumulativeInterestDollar,
    redemptionFeesDollar,
    netPrincipalReturned,
    totalCashReturned,
    netProfitLossDollar,
    netCagrPct,
    totalFeesDollar,
    feeDragPct,
    totalCreationSpreadBps,
    totalPayoutSpreadBps,
    totalRedemptionSpreadBps,
  } = useForeignCurrencyFD();

  const isProfit = netProfitLossDollar >= 0;

  return (
    <Grid container spacing={2.5}>
      {/* 1. Net Invested Principal */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: "#e0f2fe",
                borderRadius: 1.5,
                color: "#0284c7",
              }}
            >
              <AccountBalanceIcon fontSize="small" />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#64748b" }}
            >
              Net Invested Deposit
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#0f172a" }}
          >
            $
            {netInvestedDeposit.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              label={`Creation Fee: -$${creationFeesDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })} (${totalCreationSpreadBps} bps)`}
              size="small"
              sx={{ fontWeight: "bold", bgcolor: "#fee2e2", color: "#b91c1c" }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: "#64748b", mt: 1, display: "block" }}
          >
            Gross Input: ${effectiveGrossAmount.toLocaleString()} minus{" "}
            {totalCreationSpreadBps} bps (Spreads x+y+z).
          </Typography>
        </Paper>
      </Grid>

      {/* 2. Half-Yearly Payout */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: "#dcfce7",
                borderRadius: 1.5,
                color: "#15803d",
              }}
            >
              <MonetizationOnIcon fontSize="small" />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#64748b" }}
            >
              Half-Yearly Payout
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#15803d" }}
          >
            $
            {halfYearlyPayoutDollar.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            / Payout
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              label={`${totalPayoutsCount} Total Half-Yearly Installments`}
              size="small"
              sx={{ fontWeight: "bold", bgcolor: "#f3e8ff", color: "#6b21a8" }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: "#64748b", mt: 1, display: "block" }}
          >
            Net interest rate per 6 months after deducting{" "}
            {totalPayoutSpreadBps} bps servicing spreads (a+b).
          </Typography>
        </Paper>
      </Grid>

      {/* 3. Cumulative Interest Earned */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: "#fef3c7",
                borderRadius: 1.5,
                color: "#b45309",
              }}
            >
              <PriceCheckIcon fontSize="small" />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#64748b" }}
            >
              Cumulative Net Interest
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#b45309" }}
          >
            $
            {cumulativeInterestDollar.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              label={`${((cumulativeInterestDollar / effectiveGrossAmount) * 100).toFixed(1)}% of Gross Capital`}
              size="small"
              sx={{ fontWeight: "bold", bgcolor: "#ffedd5", color: "#c2410c" }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: "#64748b", mt: 1, display: "block" }}
          >
            Total cash received across all {totalPayoutsCount} semi-annual
            interest distributions.
          </Typography>
        </Paper>
      </Grid>

      {/* 4. Net Principal Returned */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: "#ffe4e6",
                borderRadius: 1.5,
                color: "#be123c",
              }}
            >
              <ShieldIcon fontSize="small" />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#64748b" }}
            >
              Net Principal Returned
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#0f172a" }}
          >
            $
            {netPrincipalReturned.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              label={`Redemption Fee: -$${redemptionFeesDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })} (${totalRedemptionSpreadBps} bps)`}
              size="small"
              sx={{ fontWeight: "bold", bgcolor: "#fee2e2", color: "#b91c1c" }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: "#64748b", mt: 1, display: "block" }}
          >
            Net principal paid back at maturity after deducting{" "}
            {totalRedemptionSpreadBps} bps redemption fees (u+v).
          </Typography>
        </Paper>
      </Grid>

      {/* 5. Total Net Returned & Profit */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
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
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: isProfit ? "#dcfce7" : "#fee2e2",
                borderRadius: 1.5,
                color: isProfit ? "#15803d" : "#b91c1c",
              }}
            >
              <TrendingUpIcon fontSize="small" />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#64748b" }}
            >
              Total Cash Returned & Net Profit
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: isProfit ? "#15803d" : "#b91c1c" }}
          >
            $
            {totalCashReturned.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              label={`Net Profit: ${isProfit ? "+" : ""}$${netProfitLossDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: isProfit ? "#dcfce7" : "#fee2e2",
                color: isProfit ? "#15803d" : "#b91c1c",
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: "#64748b", mt: 1, display: "block" }}
          >
            Total net cash outflow received (Interest + Returned Principal) vs
            Initial Gross Deposit.
          </Typography>
        </Paper>
      </Grid>

      {/* 6. Net CAGR & Total Fee Drag */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: "#cff4fc",
                borderRadius: 1.5,
                color: "#087990",
              }}
            >
              <PercentIcon fontSize="small" />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#64748b" }}
            >
              Net CAGR % & Fee Drag
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#087990" }}
          >
            {netCagrPct.toFixed(2)}% Net p.a.
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              label={`Total Fee Drag: $${totalFeesDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })} (${feeDragPct.toFixed(2)}%)`}
              size="small"
              sx={{ fontWeight: "bold", bgcolor: "#fee2e2", color: "#b91c1c" }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: "#64748b", mt: 1, display: "block" }}
          >
            Annualized net yield realized after accounting for all creation,
            servicing, and redemption costs.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
