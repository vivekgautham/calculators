import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useCorporateDebtTaxSaver } from "./CorporateDebtTaxSaverContext";

const Results: React.FC = () => {
  const {
    debt,
    ebit,
    annualInterest,
    netTaxSaving,
    afterTaxCostOfDebt,
    taxWithoutDebt,
    taxWithDebt,
    effectiveTaxRateWithoutDebt,
    effectiveTaxRateWithDebt,
    netProfitWithoutDebt,
    netProfitWithDebt,
    taxRate,
    interestRate,
  } = useCorporateDebtTaxSaver();

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return val.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatAbbreviatedCurrency = (val: number) => {
    if (val >= 1e9) {
      return `$${(val / 1e9).toFixed(2)}B`;
    }
    if (val >= 1e6) {
      return `$${(val / 1e6).toFixed(2)}M`;
    }
    if (val >= 1e3) {
      return `$${(val / 1e3).toFixed(2)}K`;
    }
    return `$${val.toFixed(2)}`;
  };

  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        {/* Card 1: Tax Without Debt */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AccountBalanceIcon sx={{ color: "text.secondary" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Tax Without Debt
                </Typography>
              </Stack>
              <Box sx={{ my: 3, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  {formatAbbreviatedCurrency(taxWithoutDebt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Baseline statutory corporate tax liability
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Calculated as: {formatAbbreviatedCurrency(ebit)} (EBIT) ×{" "}
                {taxRate}% (Tax Rate)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Total Net Tax Paid */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <ReceiptLongIcon color="error" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total Net Tax Paid
                </Typography>
              </Stack>
              <Box sx={{ my: 3, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", color: "error.main" }}
                >
                  {formatAbbreviatedCurrency(taxWithDebt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Final tax bill at {formatPercent(effectiveTaxRateWithDebt)}{" "}
                  ETR
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Taxes without debt: {formatAbbreviatedCurrency(taxWithoutDebt)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Annual Net Tax Saving */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AttachMoneyIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Annual Net Tax Saving
                </Typography>
              </Stack>
              <Box sx={{ my: 3, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", color: "success.main" }}
                >
                  {formatAbbreviatedCurrency(netTaxSaving)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tax Shield generated by debt interest
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Calculated as: {formatAbbreviatedCurrency(annualInterest)}{" "}
                (Interest) × {taxRate}% (Tax Rate)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Total Interest Paid */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AccountBalanceWalletIcon color="warning" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total Interest Paid
                </Typography>
              </Stack>
              <Box sx={{ my: 3, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", color: "warning.main" }}
                >
                  {formatAbbreviatedCurrency(annualInterest)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annual interest expense on debt
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Calculated as: {formatAbbreviatedCurrency(debt)} (Debt) ×{" "}
                {interestRate}% (Interest Rate)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5: Effective Tax Rate */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <PercentIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Effective Tax Rate
                </Typography>
              </Stack>
              <Box sx={{ my: 3, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {formatPercent(effectiveTaxRateWithDebt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reduced from statutory {formatPercent(taxRate)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Without Debt ETR:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {formatPercent(effectiveTaxRateWithoutDebt)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 6: After-Tax Cost of Debt */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <PriceCheckIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  After-Tax Cost of Debt
                </Typography>
              </Stack>
              <Box sx={{ my: 3, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", color: "secondary.main" }}
                >
                  {formatPercent(afterTaxCostOfDebt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  True cost compared to stated {formatPercent(interestRate)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Formula: {formatPercent(interestRate)} × (1 - {taxRate}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Side-by-side Table Comparison */}
      <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Metric</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Without Debt (All-Equity)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                With Debt (Leveraged)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Difference
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Earnings Before Interest & Taxes (EBIT)</TableCell>
              <TableCell align="right">{formatCurrency(ebit)}</TableCell>
              <TableCell align="right" style={{ color: "#1976d2" }}>
                {formatCurrency(ebit)}
              </TableCell>
              <TableCell align="right">$0</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Interest Expense</TableCell>
              <TableCell align="right">$0</TableCell>
              <TableCell align="right" style={{ color: "#1976d2" }}>
                ({formatCurrency(annualInterest)})
              </TableCell>
              <TableCell align="right">
                -{formatCurrency(annualInterest)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxable Income (EBT)</TableCell>
              <TableCell align="right">
                {formatCurrency(Math.max(0, ebit))}
              </TableCell>
              <TableCell align="right" style={{ color: "#1976d2" }}>
                {formatCurrency(Math.max(0, ebit - annualInterest))}
              </TableCell>
              <TableCell align="right">
                -{formatCurrency(Math.min(ebit, annualInterest))}
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "rgba(76, 175, 80, 0.05)" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Income Tax Paid</TableCell>
              <TableCell align="right">
                {formatCurrency(taxWithoutDebt)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "success.main", fontWeight: "bold" }}
              >
                {formatCurrency(taxWithDebt)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "success.main", fontWeight: "bold" }}
              >
                -{formatCurrency(netTaxSaving)} (Tax Saved)
              </TableCell>
            </TableRow>
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell sx={{ fontWeight: "bold" }}>
                Net Income (EAT)
              </TableCell>
              <TableCell align="right">
                {formatCurrency(netProfitWithoutDebt)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "#1976d2", fontWeight: "bold" }}
              >
                {formatCurrency(netProfitWithDebt)}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {netProfitWithDebt >= netProfitWithoutDebt ? "+" : ""}
                {formatCurrency(netProfitWithDebt - netProfitWithoutDebt)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Warnings & Insights */}
      {ebit < annualInterest && (
        <Alert severity="warning" sx={{ mt: 3, border: "1px solid #ffe0b2" }}>
          <strong>Interest Coverage Alert:</strong> Your EBIT (
          {formatCurrency(ebit)}) is less than your Interest Expense (
          {formatCurrency(annualInterest)}). The company is operating at an
          interest coverage ratio below 1.0, resulting in a pre-tax net loss.
          While you pay $0 in taxes, the interest expense exceeds your operating
          profit, which poses substantial financial risk.
        </Alert>
      )}
    </Box>
  );
};

export default Results;
