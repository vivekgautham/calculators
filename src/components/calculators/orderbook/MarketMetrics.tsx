import React from "react";
import {
  Paper,
  Box,
  Grid,
  Typography,
  LinearProgress,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useOrderBook } from "./OrderBookContext";

const MarketMetrics: React.FC = () => {
  const {
    bids,
    asks,
    lastTradedPrice,
    referencePrice,
    highPrice,
    lowPrice,
    totalVolume,
    trades,
    resetBook,
  } = useOrderBook();

  // Price calculations
  const bestBid = bids.length > 0 ? bids[0].price : null;
  const bestAsk = asks.length > 0 ? asks[0].price : null;

  const spread =
    bestBid !== null && bestAsk !== null
      ? Number((bestAsk - bestBid).toFixed(2))
      : null;
  const midPrice =
    bestBid !== null && bestAsk !== null
      ? Number(((bestBid + bestAsk) / 2).toFixed(2))
      : lastTradedPrice;

  const spreadBps =
    spread !== null && midPrice && midPrice > 0
      ? Number(((spread / midPrice) * 10000).toFixed(1))
      : null;

  const priceDiff =
    lastTradedPrice !== null ? lastTradedPrice - referencePrice : 0;
  const priceDiffPct =
    referencePrice > 0 ? (priceDiff / referencePrice) * 100 : 0;

  // Imbalance calculation (Total Bid Vol vs Total Ask Vol)
  const totalBidVol = bids.reduce((acc, b) => acc + b.remainingQty, 0);
  const totalAskVol = asks.reduce((acc, a) => acc + a.remainingQty, 0);
  const combinedVol = totalBidVol + totalAskVol;
  const bidRatio = combinedVol > 0 ? (totalBidVol / combinedVol) * 100 : 50;

  // VWAP Calculation from Trades
  const vwap =
    trades.length > 0
      ? trades.reduce((acc, t) => acc + t.price * t.qty, 0) /
        trades.reduce((acc, t) => acc + t.qty, 0)
      : lastTradedPrice;

  const isUp = priceDiff >= 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Top Controls Row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e293b" }}>
          Order Book Ticker Stats
        </Typography>

        <Tooltip title="Reset order book to default state">
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<RefreshIcon />}
            onClick={resetBook}
            sx={{ fontWeight: "bold" }}
          >
            Reset Book
          </Button>
        </Tooltip>
      </Stack>

      {/* Primary Ticker & Key Stats */}
      <Grid container spacing={2} alignItems="center">
        {/* LTP & Price Change */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
              borderLeft: `4px solid ${isUp ? "#2e7d32" : "#d32f2f"}`,
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Last Traded Price (LTP)
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: isUp ? "#2e7d32" : "#d32f2f",
                my: 0.5,
              }}
            >
              ${lastTradedPrice !== null ? lastTradedPrice.toFixed(2) : "—"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: isUp ? "#2e7d32" : "#d32f2f" }}
            >
              {isUp ? "▲" : "▼"} {Math.abs(priceDiff).toFixed(2)} (
              {isUp ? "+" : ""}
              {priceDiffPct.toFixed(2)}%)
            </Typography>
          </Box>
        </Grid>

        {/* Spread & Mid Price */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Bid-Ask Spread
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#d97706", my: 0.5 }}
            >
              ${spread !== null ? spread.toFixed(2) : "—"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Spread: <b>{spreadBps !== null ? `${spreadBps} bps` : "—"}</b> |
              Mid: <b>${midPrice ? midPrice.toFixed(2) : "—"}</b>
            </Typography>
          </Box>
        </Grid>

        {/* VWAP & Range */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              VWAP & Day Range
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#0284c7", my: 0.5 }}
            >
              ${vwap !== null ? vwap.toFixed(2) : "—"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Low: <b>${lowPrice !== null ? lowPrice.toFixed(2) : "—"}</b> |
              High: <b>${highPrice !== null ? highPrice.toFixed(2) : "—"}</b>
            </Typography>
          </Box>
        </Grid>

        {/* Volume & Order Imbalance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Order Imbalance (Bids / Asks)
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#2e7d32", fontWeight: "bold" }}
              >
                Vol: {totalVolume.toLocaleString()}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 0.5, mb: 0.5 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#2e7d32", fontWeight: "bold" }}
              >
                Bids {bidRatio.toFixed(0)}%
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#d32f2f", fontWeight: "bold" }}
              >
                Asks {(100 - bidRatio).toFixed(0)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={bidRatio}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "#fee2e2",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#2e7d32",
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MarketMetrics;
