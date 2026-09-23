import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableFooter,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useBasicFinancialPlanner } from "./BasicFinancialPlannerContext";

const PlanTable: React.FC = () => {
  const {
    planData,
    withdrawalTaxRate,
    totalNetExpenses,
    totalTaxes,
    totalWithdrawn,
    yearsToGo,
  } = useBasicFinancialPlanner();

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const lastRow = planData[planData.length - 1];
  const finalBalance = lastRow ? lastRow.remainingBalance : 0;

  return (
    <TableContainer component={Paper} elevation={3}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h6">Financial Plan Projection</Typography>
        <Chip
          label={
            withdrawalTaxRate > 0
              ? `${withdrawalTaxRate}% Withdrawal Tax Applied`
              : "Tax-Free Withdrawals (0%)"
          }
          size="small"
          color={withdrawalTaxRate > 0 ? "warning" : "default"}
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: "11px" }}
        />
      </Box>
      <Table aria-label="financial plan table" size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f8fafc" }}>
            <TableCell>
              <strong>Year</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Projected Balance</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Net Living Expense</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Tax on Withdrawal</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Gross Withdrawn</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Remaining Balance</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {planData.map((row) => (
            <TableRow
              key={row.year}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor:
                  row.remainingBalance < 0 ? "#fff0f0" : "inherit",
              }}
            >
              <TableCell component="th" scope="row">
                {row.year === 0 ? "Initial" : `Year ${row.year}`}
              </TableCell>
              <TableCell align="right">
                ${formatCurrency(row.projectedBalance)}
              </TableCell>
              <TableCell align="right" sx={{ color: "#0284c7" }}>
                {row.year === 0 ? "-" : `$${formatCurrency(row.netExpense)}`}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: row.taxAmount > 0 ? "#d97706" : "text.secondary",
                  fontWeight: row.taxAmount > 0 ? 600 : "normal",
                }}
              >
                {row.year === 0 ? "-" : `$${formatCurrency(row.taxAmount)}`}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: row.year > 0 ? 600 : "normal" }}
              >
                {row.year === 0
                  ? "-"
                  : `$${formatCurrency(row.withdrawnAmount)}`}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: row.remainingBalance < 0 ? "bold" : 600,
                  color:
                    row.remainingBalance < 0 ? "error.main" : "text.primary",
                }}
              >
                ${formatCurrency(row.remainingBalance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
            <TableCell colSpan={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Total (Years 1 - {yearsToGo})
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: "#0284c7" }}
              >
                ${formatCurrency(totalNetExpenses)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: "#d97706" }}
              >
                ${formatCurrency(totalTaxes)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                ${formatCurrency(totalWithdrawn)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: finalBalance < 0 ? "error.main" : "success.main",
                }}
              >
                ${formatCurrency(finalBalance)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default PlanTable;
