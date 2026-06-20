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
} from "@mui/material";
import { usePortfolioShockMatrix } from "./PortfolioShockMatrixContext";

const formatCurrency = (value: number) => {
  const sign = value < 0 ? "-" : "";
  return (
    sign +
    "$" +
    Math.abs(value).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
};

const formatPercent = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return sign + value.toFixed(1) + "%";
};

const ShockTable: React.FC = () => {
  const { scenarios } = usePortfolioShockMatrix();

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        Scenario Shock Matrix Table
      </Typography>
      <TableContainer
        component={Paper}
        variant="outlined"
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Market Shock Scenario
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Shock Impact
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Total Fund Value
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Net G/L (vs Initial)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Total Return (%)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scenarios.map((row) => {
              const shockColor =
                row.shockPercent < 0
                  ? "error.main"
                  : row.shockPercent > 0
                    ? "success.main"
                    : "text.primary";

              const isNegative = row.isNegativeScenario;
              const rowBg = isNegative
                ? "rgba(211, 47, 47, 0.04)" // Light red for negative scenarios
                : "rgba(46, 125, 50, 0.04)"; // Light green for positive scenarios

              return (
                <TableRow
                  key={row.shockPercent}
                  sx={{
                    backgroundColor: rowBg,
                    "&:hover": {
                      backgroundColor: isNegative
                        ? "rgba(211, 47, 47, 0.08)"
                        : "rgba(46, 125, 50, 0.08)",
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: shockColor }}
                  >
                    {formatPercent(row.shockPercent)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: shockColor }}>
                    {formatCurrency(row.shockAmount)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: isNegative ? "error.dark" : "success.dark",
                    }}
                  >
                    {formatCurrency(row.finalValue)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color:
                        row.netProfitLoss < 0 ? "error.main" : "success.main",
                    }}
                  >
                    {formatCurrency(row.netProfitLoss)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color:
                        row.percentProfitLoss < 0
                          ? "error.main"
                          : "success.main",
                    }}
                  >
                    {formatPercent(row.percentProfitLoss)}
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

export default ShockTable;
