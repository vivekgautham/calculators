import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useBasicFinancialPlanner } from "./BasicFinancialPlannerContext";

const PlanTable: React.FC = () => {
  const { planData } = useBasicFinancialPlanner();

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <TableContainer component={Paper} elevation={3}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Financial Plan Projection
      </Typography>
      <Table aria-label="financial plan table" size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell><strong>Year</strong></TableCell>
            <TableCell align="right"><strong>Projected Balance</strong></TableCell>
            <TableCell align="right"><strong>Withdrawn Amount</strong></TableCell>
            <TableCell align="right"><strong>Remaining Balance</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {planData.map((row) => (
            <TableRow
              key={row.year}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: row.remainingBalance < 0 ? "#fff0f0" : "inherit"
              }}
            >
              <TableCell component="th" scope="row">
                {row.year === 0 ? "Initial" : `Year ${row.year}`}
              </TableCell>
              <TableCell align="right">${formatCurrency(row.projectedBalance)}</TableCell>
              <TableCell align="right">${formatCurrency(row.withdrawnAmount)}</TableCell>
              <TableCell align="right" sx={{
                fontWeight: row.remainingBalance < 0 ? "bold" : "normal",
                color: row.remainingBalance < 0 ? "error.main" : "inherit"
              }}>
                ${formatCurrency(row.remainingBalance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlanTable;
