import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { useOrderBook } from "./OrderBookContext";

export const TradeLog: React.FC = () => {
  const { trades } = useOrderBook();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1a2035" }}>
          Execution Log & Trade History
        </Typography>
        <Chip
          label={`${trades.length} Executions`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Stack>

      <TableContainer sx={{ flexGrow: 1, maxHeight: 300, overflowY: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow
              sx={{ "& th": { bgcolor: "#f8f9fa", fontWeight: "bold" } }}
            >
              <TableCell>Time</TableCell>
              <TableCell align="center">Aggressor</TableCell>
              <TableCell align="right">Price ($)</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Notional ($)</TableCell>
              <TableCell align="left">Buyer / Seller</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 3, color: "#999" }}
                >
                  No trades executed yet. Place an order matching liquidity to
                  see executions.
                </TableCell>
              </TableRow>
            ) : (
              trades.map((trade) => {
                const timeStr = trade.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
                const isBuyAggressor = trade.aggressor === "BUY";
                const notional = trade.price * trade.qty;

                return (
                  <TableRow key={trade.id} hover>
                    <TableCell sx={{ fontSize: "12px", color: "#666" }}>
                      {timeStr}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={trade.aggressor}
                        size="small"
                        sx={{
                          fontSize: "10px",
                          height: 20,
                          fontWeight: "bold",
                          bgcolor: isBuyAggressor ? "#e8f5e9" : "#ffebee",
                          color: isBuyAggressor ? "#2e7d32" : "#d32f2f",
                          border: `1px solid ${isBuyAggressor ? "#a5d6a7" : "#ef9a9a"}`,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: "bold",
                        color: isBuyAggressor ? "#2e7d32" : "#d32f2f",
                      }}
                    >
                      ${trade.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "medium" }}>
                      {trade.qty.toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#555" }}>
                      $
                      {notional.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontSize: "12px", color: "#666" }}
                    >
                      <Box
                        component="span"
                        sx={{ color: "#2e7d32", fontWeight: "bold" }}
                      >
                        {trade.buyer}
                      </Box>{" "}
                      ←{" "}
                      <Box
                        component="span"
                        sx={{ color: "#d32f2f", fontWeight: "bold" }}
                      >
                        {trade.seller}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TradeLog;
