import React from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useForeignCurrencyFD } from "./ForeignCurrencyFDContext";

const formatCurrency = (val: number) => {
  const sign = val < 0 ? "-" : "";
  return (
    sign +
    "$" +
    Math.abs(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

export const ScheduleTable: React.FC = () => {
  const { cashFlowTimeline } = useForeignCurrencyFD();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#1e293b", mb: 2 }}
      >
        Half-Yearly Cash Flow & Fee Schedule Table
      </Typography>

      <TableContainer
        component={Box}
        sx={{ maxHeight: 400, overflowY: "auto" }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Period & Timeline
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Cash Flow Phase
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Gross Amount ($)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Spreads & Fees Paid ($)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Net Cash Flow ($)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Cumulative Net Position ($)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cashFlowTimeline.map((row) => {
              const isCreation = row.type === "Creation";
              const isRedemption = row.type === "Maturity Redemption";

              const typeBgColor = isCreation
                ? "#fee2e2"
                : isRedemption
                  ? "#e0f2fe"
                  : "#dcfce7";

              const typeTextColor = isCreation
                ? "#b91c1c"
                : isRedemption
                  ? "#0369a1"
                  : "#15803d";

              return (
                <TableRow key={row.periodLabel} hover>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#1e293b" }}
                  >
                    {row.periodLabel}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={row.type}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: typeBgColor,
                        color: typeTextColor,
                      }}
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: row.grossAmount < 0 ? "#b91c1c" : "#1e293b",
                    }}
                  >
                    {formatCurrency(row.grossAmount)}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ color: "#dc2626", fontWeight: "bold" }}
                  >
                    -{formatCurrency(row.feeAmount)}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: row.netAmount < 0 ? "#dc2626" : "#16a34a",
                    }}
                  >
                    {formatCurrency(row.netAmount)}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: row.cumulativeCashFlow < 0 ? "#dc2626" : "#16a34a",
                    }}
                  >
                    {formatCurrency(row.cumulativeCashFlow)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ScheduleTable;
