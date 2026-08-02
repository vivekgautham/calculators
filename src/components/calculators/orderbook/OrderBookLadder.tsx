import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
} from "@mui/material";
import { useOrderBook } from "./OrderBookContext";

interface GroupedLevel {
  price: number;
  qty: number;
  ordersCount: number;
  cumulativeQty: number;
  depthPct: number;
}

export const OrderBookLadder: React.FC<{
  onSelectPrice?: (price: number) => void;
}> = ({ onSelectPrice }) => {
  const { bids, asks, lastTradedPrice } = useOrderBook();

  // Aggregate orders by price level
  const aggregatedAsks = useMemo(() => {
    const map = new Map<number, { qty: number; count: number }>();
    for (const ask of asks) {
      const existing = map.get(ask.price) || { qty: 0, count: 0 };
      map.set(ask.price, {
        qty: existing.qty + ask.remainingQty,
        count: existing.count + 1,
      });
    }

    const sortedPrices = Array.from(map.keys()).sort((a, b) => a - b); // ASC
    let cum = 0;
    const maxCum = sortedPrices.reduce(
      (acc, p) => acc + (map.get(p)?.qty || 0),
      0,
    );

    const levels: GroupedLevel[] = sortedPrices.map((p) => {
      const item = map.get(p)!;
      cum += item.qty;
      return {
        price: p,
        qty: item.qty,
        ordersCount: item.count,
        cumulativeQty: cum,
        depthPct: maxCum > 0 ? (cum / maxCum) * 100 : 0,
      };
    });

    // We want asks displayed descending from top (highest price at top, lowest ask near spread)
    return levels.slice(0, 12).reverse();
  }, [asks]);

  const aggregatedBids = useMemo(() => {
    const map = new Map<number, { qty: number; count: number }>();
    for (const bid of bids) {
      const existing = map.get(bid.price) || { qty: 0, count: 0 };
      map.set(bid.price, {
        qty: existing.qty + bid.remainingQty,
        count: existing.count + 1,
      });
    }

    const sortedPrices = Array.from(map.keys()).sort((a, b) => b - a); // DESC
    let cum = 0;
    const maxCum = sortedPrices.reduce(
      (acc, p) => acc + (map.get(p)?.qty || 0),
      0,
    );

    const levels: GroupedLevel[] = sortedPrices.map((p) => {
      const item = map.get(p)!;
      cum += item.qty;
      return {
        price: p,
        qty: item.qty,
        ordersCount: item.count,
        cumulativeQty: cum,
        depthPct: maxCum > 0 ? (cum / maxCum) * 100 : 0,
      };
    });

    return levels.slice(0, 12);
  }, [bids]);

  const bestBid = aggregatedBids.length > 0 ? aggregatedBids[0].price : null;
  const bestAsk =
    aggregatedAsks.length > 0
      ? aggregatedAsks[aggregatedAsks.length - 1].price
      : null;
  const spread =
    bestBid !== null && bestAsk !== null ? bestAsk - bestBid : null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0f172a",
        color: "#f8fafc",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f8fafc" }}>
          Order Book (DOM Level 2)
        </Typography>
        <Chip
          label={`Spread: ${spread !== null ? `$${spread.toFixed(2)}` : "—"}`}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.1)",
            color: "#f1f5f9",
            fontWeight: "bold",
          }}
        />
      </Stack>

      <TableContainer sx={{ flexGrow: 1, maxHeight: 520, overflowY: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  bgcolor: "#1e293b",
                  color: "#94a3b8",
                  fontWeight: "bold",
                  border: 0,
                },
              }}
            >
              <TableCell align="left">Price ($)</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Total Depth</TableCell>
              <TableCell align="right">Orders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ASKS (SELL ORDERS) - RED */}
            {aggregatedAsks.map((level) => (
              <TableRow
                key={`ask_${level.price}`}
                onClick={() => onSelectPrice && onSelectPrice(level.price)}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                  background: `linear-gradient(to left, rgba(239, 68, 68, 0.25) ${level.depthPct}%, transparent ${level.depthPct}%)`,
                }}
              >
                <TableCell
                  sx={{
                    color: "#ef4444",
                    fontWeight: "bold",
                    border: 0,
                    py: 0.6,
                  }}
                >
                  ${level.price.toFixed(2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#f8fafc", border: 0, py: 0.6 }}
                >
                  {level.qty.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#94a3b8", border: 0, py: 0.6 }}
                >
                  {level.cumulativeQty.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#64748b", border: 0, py: 0.6 }}
                >
                  {level.ordersCount}
                </TableCell>
              </TableRow>
            ))}

            {/* SPREAD / MID PRICE BAR */}
            <TableRow sx={{ bgcolor: "#1e293b" }}>
              <TableCell colSpan={4} align="center" sx={{ py: 1, border: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#94a3b8", fontWeight: "bold" }}
                  >
                    MID: $
                    {bestBid && bestAsk
                      ? ((bestBid + bestAsk) / 2).toFixed(2)
                      : lastTradedPrice?.toFixed(2) || "—"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#e2e8f0", fontWeight: "bold" }}
                  >
                    LTP: $
                    {lastTradedPrice !== null
                      ? lastTradedPrice.toFixed(2)
                      : "—"}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>

            {/* BIDS (BUY ORDERS) - GREEN */}
            {aggregatedBids.map((level) => (
              <TableRow
                key={`bid_${level.price}`}
                onClick={() => onSelectPrice && onSelectPrice(level.price)}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": { bgcolor: "rgba(34, 197, 94, 0.2)" },
                  background: `linear-gradient(to left, rgba(34, 197, 94, 0.25) ${level.depthPct}%, transparent ${level.depthPct}%)`,
                }}
              >
                <TableCell
                  sx={{
                    color: "#22c55e",
                    fontWeight: "bold",
                    border: 0,
                    py: 0.6,
                  }}
                >
                  ${level.price.toFixed(2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#f8fafc", border: 0, py: 0.6 }}
                >
                  {level.qty.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#94a3b8", border: 0, py: 0.6 }}
                >
                  {level.cumulativeQty.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#64748b", border: 0, py: 0.6 }}
                >
                  {level.ordersCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderBookLadder;
