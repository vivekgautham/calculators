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

    return levels.reverse();
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

    return levels;
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
        bgcolor: "#ffffff",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e293b" }}>
          Order Book (DOM Level 2)
        </Typography>
        <Chip
          label={`Spread: ${spread !== null ? `$${spread.toFixed(2)}` : "—"}`}
          size="small"
          sx={{
            bgcolor: "#f1f5f9",
            color: "#334155",
            fontWeight: "bold",
            border: "1px solid #cbd5e1",
          }}
        />
      </Stack>

      <TableContainer sx={{ flexGrow: 1, maxHeight: 520, overflowY: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  bgcolor: "#f8fafc",
                  color: "#475569",
                  fontWeight: "bold",
                  borderBottom: "1px solid #e2e8f0",
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
                  "&:hover": { bgcolor: "#fef2f2" },
                  background: `linear-gradient(to left, rgba(239, 68, 68, 0.12) ${level.depthPct}%, transparent ${level.depthPct}%)`,
                }}
              >
                <TableCell
                  sx={{
                    color: "#dc2626",
                    fontWeight: "bold",
                    py: 0.6,
                  }}
                >
                  ${level.price.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ color: "#1e293b", py: 0.6 }}>
                  {level.qty.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: "#64748b", py: 0.6 }}>
                  {level.cumulativeQty.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: "#94a3b8", py: 0.6 }}>
                  {level.ordersCount}
                </TableCell>
              </TableRow>
            ))}

            {/* SPREAD / MID PRICE BAR */}
            <TableRow sx={{ bgcolor: "#f1f5f9" }}>
              <TableCell colSpan={4} align="center" sx={{ py: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", fontWeight: "bold" }}
                  >
                    MID: $
                    {bestBid && bestAsk
                      ? ((bestBid + bestAsk) / 2).toFixed(2)
                      : lastTradedPrice?.toFixed(2) || "—"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#0f172a", fontWeight: "bold" }}
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
                  "&:hover": { bgcolor: "#f0fdf4" },
                  background: `linear-gradient(to left, rgba(34, 197, 94, 0.12) ${level.depthPct}%, transparent ${level.depthPct}%)`,
                }}
              >
                <TableCell
                  sx={{
                    color: "#16a34a",
                    fontWeight: "bold",
                    py: 0.6,
                  }}
                >
                  ${level.price.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ color: "#1e293b", py: 0.6 }}>
                  {level.qty.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: "#64748b", py: 0.6 }}>
                  {level.cumulativeQty.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: "#94a3b8", py: 0.6 }}>
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
