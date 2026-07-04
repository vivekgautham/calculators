import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import { useRetirementPlanner } from "./RetirementPlannerContext";

const RetirementTable: React.FC = () => {
  const { yearlyData } = useRetirementPlanner();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <TableContainer component={Paper} elevation={3}>
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", backgroundColor: "#f5f5f5" }}
      >
        Yearly Projection Details
      </Typography>
      <Table aria-label="retirement projection table" size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
            <TableCell>
              <strong>Age</strong>
            </TableCell>
            <TableCell>
              <strong>Year</strong>
            </TableCell>
            <TableCell>
              <strong>Phase</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Annual Contribution</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Annual Withdrawal</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Investment Earnings</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Ending Balance</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {yearlyData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              const isRetirement = row.phase === "Retirement";
              const isDepleted =
                row.endingBalance === 0 && row.annualWithdrawal > 0;

              let rowBg = "inherit";
              if (isDepleted) {
                rowBg = "#ffebee"; // Soft red for depleted savings
              } else if (isRetirement) {
                rowBg = "#e8f5e9"; // Soft green for active retirement phase
              }

              return (
                <TableRow
                  key={row.year}
                  sx={{
                    backgroundColor: rowBg,
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.age}
                  </TableCell>
                  <TableCell>
                    {row.year === 0 ? "Initial" : `Year ${row.year}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: isRetirement ? "#2e7d32" : "#1976d2",
                    }}
                  >
                    {row.phase}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#2e7d32" }}>
                    {row.annualContribution > 0
                      ? formatCurrency(row.annualContribution)
                      : "-"}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#d32f2f" }}>
                    {row.annualWithdrawal > 0
                      ? formatCurrency(row.annualWithdrawal)
                      : "-"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        row.investmentEarnings >= 0 ? "inherit" : "error.main",
                    }}
                  >
                    {formatCurrency(row.investmentEarnings)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: row.endingBalance > 0 ? "#1976d2" : "error.main",
                    }}
                  >
                    {formatCurrency(row.endingBalance)}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={yearlyData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default RetirementTable;
