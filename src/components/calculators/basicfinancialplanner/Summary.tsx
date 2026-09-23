import React from "react";
import { Alert, Typography, Box, Grid, Paper, Chip } from "@mui/material";
import { useBasicFinancialPlanner } from "./BasicFinancialPlannerContext";

const formatCurrency = (val: number): string => {
  return Math.round(val).toLocaleString();
};

const Summary: React.FC = () => {
  const {
    corpusAmount,
    annualExpense,
    yearsToGo,
    multiplier,
    baseMultiplier,
    inflationRate,
    corpusGrowthRate,
    withdrawalTaxRate,
    totalNetExpenses,
    totalTaxes,
    totalWithdrawn,
    planData,
  } = useBasicFinancialPlanner();

  const requiredCorpus = annualExpense * multiplier;
  const preTaxCorpus = annualExpense * baseMultiplier;
  const taxBufferCorpus = requiredCorpus - preTaxCorpus;
  const fundedDifference = corpusAmount - requiredCorpus;
  const isFullyFunded = fundedDifference >= 0;

  const lastRow = planData[planData.length - 1];
  const finalBalance = lastRow ? lastRow.remainingBalance : 0;
  const depletionRow = planData.find(
    (d) => d.year > 0 && d.remainingBalance < 0,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Alert Banner */}
      <Alert
        severity={isFullyFunded ? "success" : "warning"}
        sx={{
          border: `1px solid ${isFullyFunded ? "#81c784" : "#ffb74d"}`,
          backgroundColor: isFullyFunded ? "#f1f8e9" : "#fff8e1",
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          When you have <strong>{yearsToGo}</strong> years to go, your corpus
          amount needs to be <strong>{multiplier.toFixed(2)}×</strong> the
          Annual Expense
          {withdrawalTaxRate > 0 ? (
            <>
              {" "}
              (accounting for a <strong>{withdrawalTaxRate}%</strong> withdrawal
              tax)
            </>
          ) : (
            ""
          )}{" "}
          with <strong>{inflationRate}%</strong> YoY Inflation and{" "}
          <strong>{corpusGrowthRate}%</strong> YoY Corpus Growth Rate for you to
          not go into debt ever.
        </Typography>

        {withdrawalTaxRate > 0 && (
          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: "text.secondary", lineHeight: 1.5 }}
          >
            Without taxes, your required corpus would be{" "}
            <strong>{baseMultiplier.toFixed(2)}×</strong> ($
            {formatCurrency(preTaxCorpus)}). The {withdrawalTaxRate}% tax rate
            adds an extra{" "}
            <strong>{(multiplier - baseMultiplier).toFixed(2)}×</strong> ($
            {formatCurrency(taxBufferCorpus)}) in required initial capital.
          </Typography>
        )}
      </Alert>

      {/* KPI Summary Cards */}
      <Grid container spacing={2}>
        {/* Required Corpus */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              REQUIRED CORPUS
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#1e293b", my: 0.5 }}
            >
              ${formatCurrency(requiredCorpus)}
            </Typography>
            <Chip
              label={
                isFullyFunded
                  ? `Funded (+$${formatCurrency(fundedDifference)})`
                  : `Shortfall (-$${formatCurrency(Math.abs(fundedDifference))})`
              }
              size="small"
              color={isFullyFunded ? "success" : "error"}
              sx={{
                fontWeight: 600,
                fontSize: "11px",
                height: 22,
                width: "fit-content",
              }}
            />
          </Paper>
        </Grid>

        {/* Total Net Expenses */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              NET LIVING EXPENSES
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#0284c7", my: 0.5 }}
            >
              ${formatCurrency(totalNetExpenses)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Over {yearsToGo} years (inflated)
            </Typography>
          </Paper>
        </Grid>

        {/* Total Taxes on Withdrawal */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              WITHDRAWAL TAXES
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: withdrawalTaxRate > 0 ? "#d97706" : "#64748b",
                my: 0.5,
              }}
            >
              ${formatCurrency(totalTaxes)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {withdrawalTaxRate > 0
                ? `${withdrawalTaxRate}% tax on withdrawals`
                : "Tax-free withdrawals (0%)"}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Gross Withdrawn */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              TOTAL GROSS WITHDRAWN
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#475569", my: 0.5 }}
            >
              ${formatCurrency(totalWithdrawn)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Living expenses + taxes
            </Typography>
          </Paper>
        </Grid>

        {/* Ending Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              FINAL BALANCE (YR {yearsToGo})
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: finalBalance >= 0 ? "#16a34a" : "#dc2626",
                my: 0.5,
              }}
            >
              ${formatCurrency(finalBalance)}
            </Typography>
            <Chip
              label={
                finalBalance >= 0
                  ? "Solvent"
                  : `Depleted in Yr ${depletionRow ? depletionRow.year : "?"}`
              }
              size="small"
              color={finalBalance >= 0 ? "success" : "error"}
              sx={{
                fontWeight: 600,
                fontSize: "11px",
                height: 22,
                width: "fit-content",
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary;
