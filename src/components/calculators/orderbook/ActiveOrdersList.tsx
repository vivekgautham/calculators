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
  IconButton,
  Button,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useOrderBook } from "./OrderBookContext";

export const ActiveOrdersList: React.FC = () => {
  const { bids, asks, cancelOrder, cancelAllOrders } = useOrderBook();

  // Combine bids and asks open orders
  const allOpenOrders = [...bids, ...asks].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );

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
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1a2035" }}
          >
            Resting Open Orders
          </Typography>
          <Chip
            label={`${allOpenOrders.length} Resting`}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Stack>
        {allOpenOrders.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={cancelAllOrders}
            sx={{ fontWeight: "bold" }}
          >
            Cancel All
          </Button>
        )}
      </Stack>

      <TableContainer sx={{ flexGrow: 1, maxHeight: 300, overflowY: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow
              sx={{ "& th": { bgcolor: "#f8f9fa", fontWeight: "bold" } }}
            >
              <TableCell>Order ID</TableCell>
              <TableCell align="center">Side</TableCell>
              <TableCell align="right">Price ($)</TableCell>
              <TableCell align="right">Remaining / Original Qty</TableCell>
              <TableCell align="left">Trader</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allOpenOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 3, color: "#999" }}
                >
                  No active orders resting in the order book.
                </TableCell>
              </TableRow>
            ) : (
              allOpenOrders.map((order) => {
                const isBuy = order.side === "BUY";
                return (
                  <TableRow key={order.id} hover>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: "#666",
                      }}
                    >
                      {order.id}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.side}
                        size="small"
                        sx={{
                          fontSize: "10px",
                          height: 20,
                          fontWeight: "bold",
                          bgcolor: isBuy ? "#e8f5e9" : "#ffebee",
                          color: isBuy ? "#2e7d32" : "#d32f2f",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: "bold",
                        color: isBuy ? "#2e7d32" : "#d32f2f",
                      }}
                    >
                      ${order.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <b>{order.remainingQty.toLocaleString()}</b> /{" "}
                      {order.qty.toLocaleString()}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontSize: "12px", color: "#555" }}
                    >
                      {order.traderName}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Cancel this order">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => cancelOrder(order.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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

export default ActiveOrdersList;
