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
  Box,
  Alert,
} from "@mui/material";
import { useGrowthTarget } from "./GrowthTargetContext";

const GrowthTable: React.FC = () => {
  const { yearlyData, requiredRate } = useGrowthTarget();

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          To reach your target, you need an annual growth rate of: <strong>{requiredRate.toFixed(2)}%</strong>
        </Typography>
      </Alert>

      <TableContainer component={Paper} elevation={3}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Yearly Growth Projection
        </Typography>
        <Table aria-label="growth projection table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Year</strong></TableCell>
              <TableCell align="right"><strong>Projected Balance</strong></TableCell>
              <TableCell align="right"><strong>Growth Amount</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {yearlyData.map((row, index) => {
              const prevBalance = index > 0 ? yearlyData[index - 1].balance : row.balance;
              const growth = row.balance - prevBalance;

              return (
                <TableRow key={row.year} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.year === 0 ? "Initial" : `Year ${row.year}`}
                  </TableCell>
                  <TableCell align="right">${row.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell align="right" sx={{ color: growth >= 0 ? "green" : "red" }}>
                    {index === 0 ? "-" : `+$${growth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GrowthTable;
