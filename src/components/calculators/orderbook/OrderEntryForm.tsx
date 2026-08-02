import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Grid,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useOrderBook } from "./OrderBookContext";

export const OrderEntryForm: React.FC = () => {
  const { bids, asks, lastTradedPrice, placeOrder } = useOrderBook();

  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"LIMIT" | "MARKET">("LIMIT");
  const [price, setPrice] = useState<string>("99.50");
  const [qty, setQty] = useState<string>("100");
  const [timeInForce, setTimeInForce] = useState<"GTC" | "IOC" | "FOK">("GTC");
  const [traderName, setTraderName] = useState<string>("User_Trader");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "warning";
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const parsedPrice = parseFloat(price);
    const parsedQty = parseFloat(qty);

    if (orderType === "LIMIT" && (isNaN(parsedPrice) || parsedPrice <= 0)) {
      setNotification({
        type: "warning",
        message: "Please enter a valid price > 0",
      });
      return;
    }

    if (isNaN(parsedQty) || parsedQty <= 0) {
      setNotification({
        type: "warning",
        message: "Please enter a valid quantity > 0",
      });
      return;
    }

    const result = placeOrder({
      side,
      type: orderType,
      price: orderType === "LIMIT" ? parsedPrice : 0,
      qty: parsedQty,
      traderName,
      timeInForce,
    });

    if (result.matched) {
      if (result.remainingQty === 0) {
        setNotification({
          type: "success",
          message: `FULL MATCH! ${side} ${result.filledQty} @ avg $${result.avgPrice.toFixed(2)}`,
        });
      } else {
        setNotification({
          type: "info",
          message: `PARTIAL MATCH! ${side} ${result.filledQty} @ avg $${result.avgPrice.toFixed(
            2,
          )}. ${result.remainingQty} placed in order book.`,
        });
      }
    } else {
      if (orderType === "MARKET") {
        setNotification({
          type: "warning",
          message: `MARKET ORDER UNFILLED: No opposing liquidity available in order book.`,
        });
      } else {
        setNotification({
          type: "info",
          message: `ORDER PLACED: ${side} LIMIT ${parsedQty} @ $${parsedPrice.toFixed(2)} resting in order book.`,
        });
      }
    }
  };

  // Quick Action Price Fillers
  const bestBid = bids.length > 0 ? bids[0].price : null;
  const bestAsk = asks.length > 0 ? asks[0].price : null;

  const setBestBid = () => bestBid && setPrice(bestBid.toFixed(2));
  const setBestAsk = () => bestAsk && setPrice(bestAsk.toFixed(2));
  const setCrossSpread = () => {
    if (side === "BUY" && bestAsk) setPrice(bestAsk.toFixed(2));
    if (side === "SELL" && bestBid) setPrice(bestBid.toFixed(2));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 2, color: "#1a2035" }}
      >
        Order Entry Desk
      </Typography>

      {/* Side Selector Buttons (BUY / SELL) */}
      <ToggleButtonGroup
        value={side}
        exclusive
        onChange={(_, newSide) => {
          if (newSide) {
            setSide(newSide);
            if (newSide === "BUY" && bestBid) setPrice(bestBid.toFixed(2));
            if (newSide === "SELL" && bestAsk) setPrice(bestAsk.toFixed(2));
          }
        }}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton
          value="BUY"
          sx={{
            py: 1.2,
            fontWeight: "bold",
            fontSize: "15px",
            color: side === "BUY" ? "white !important" : "#2e7d32",
            backgroundColor: side === "BUY" ? "#2e7d32 !important" : "#e8f5e9",
            borderColor: "#2e7d32 !important",
            "&:hover": {
              backgroundColor:
                side === "BUY" ? "#1b5e20 !important" : "#c8e6c9",
            },
          }}
        >
          <ArrowUpwardIcon sx={{ mr: 0.5 }} /> BUY (BID)
        </ToggleButton>
        <ToggleButton
          value="SELL"
          sx={{
            py: 1.2,
            fontWeight: "bold",
            fontSize: "15px",
            color: side === "SELL" ? "white !important" : "#d32f2f",
            backgroundColor: side === "SELL" ? "#d32f2f !important" : "#ffebee",
            borderColor: "#d32f2f !important",
            "&:hover": {
              backgroundColor:
                side === "SELL" ? "#c62828 !important" : "#ffcdd2",
            },
          }}
        >
          <ArrowDownwardIcon sx={{ mr: 0.5 }} /> SELL (ASK)
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Order Type Toggle */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip
          label="LIMIT ORDER"
          onClick={() => setOrderType("LIMIT")}
          color={orderType === "LIMIT" ? "primary" : "default"}
          variant={orderType === "LIMIT" ? "filled" : "outlined"}
          sx={{ fontWeight: "bold", flexGrow: 1, py: 2 }}
        />
        <Chip
          label="MARKET ORDER"
          onClick={() => setOrderType("MARKET")}
          color={orderType === "MARKET" ? "primary" : "default"}
          variant={orderType === "MARKET" ? "filled" : "outlined"}
          sx={{ fontWeight: "bold", flexGrow: 1, py: 2 }}
        />
      </Stack>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 16,
        }}
      >
        {/* Price Input (if LIMIT) */}
        {orderType === "LIMIT" && (
          <Box>
            <TextField
              label="Limit Price ($)"
              type="number"
              fullWidth
              size="small"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputProps={{ step: "0.01", min: "0" }}
              required
            />
            {/* Quick Price Buttons */}
            <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
              <Chip
                label={`Best Bid ${bestBid ? `$${bestBid.toFixed(2)}` : ""}`}
                size="small"
                onClick={setBestBid}
                disabled={!bestBid}
                sx={{ fontSize: "11px", cursor: "pointer" }}
              />
              <Chip
                label={`Best Ask ${bestAsk ? `$${bestAsk.toFixed(2)}` : ""}`}
                size="small"
                onClick={setBestAsk}
                disabled={!bestAsk}
                sx={{ fontSize: "11px", cursor: "pointer" }}
              />
              <Chip
                label="Cross Spread"
                size="small"
                color="secondary"
                onClick={setCrossSpread}
                sx={{ fontSize: "11px", cursor: "pointer" }}
              />
            </Stack>
          </Box>
        )}

        {/* Quantity Input */}
        <Box>
          <TextField
            label="Quantity (Units)"
            type="number"
            fullWidth
            size="small"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            inputProps={{ step: "1", min: "1" }}
            required
          />
          {/* Preset Quantities */}
          <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
            {[10, 50, 100, 500, 1000].map((q) => (
              <Chip
                key={q}
                label={`${q}`}
                size="small"
                variant="outlined"
                onClick={() => setQty(q.toString())}
                sx={{ fontSize: "11px", cursor: "pointer" }}
              />
            ))}
          </Stack>
        </Box>

        {/* Advanced Settings Row (Time in Force & Trader Name) */}
        <Grid container spacing={1}>
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Time in Force</InputLabel>
              <Select
                value={timeInForce}
                label="Time in Force"
                onChange={(e) =>
                  setTimeInForce(e.target.value as "GTC" | "IOC" | "FOK")
                }
              >
                <MenuItem value="GTC">GTC (Good &apos;Til Canceled)</MenuItem>
                <MenuItem value="IOC">IOC (Immediate Or Cancel)</MenuItem>
                <MenuItem value="FOK">FOK (Fill Or Kill)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              label="Trader ID"
              size="small"
              fullWidth
              value={traderName}
              onChange={(e) => setTraderName(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Total Notional Order Value Preview */}
        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "#f8f9fa" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" sx={{ color: "#666" }}>
              Est. Total Notional Value:
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#1a2035" }}
            >
              $
              {orderType === "LIMIT" &&
              !isNaN(parseFloat(price)) &&
              !isNaN(parseFloat(qty))
                ? (parseFloat(price) * parseFloat(qty)).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : orderType === "MARKET" &&
                    lastTradedPrice &&
                    !isNaN(parseFloat(qty))
                  ? (lastTradedPrice * parseFloat(qty)).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )
                  : "0.00"}
            </Typography>
          </Stack>
        </Paper>

        {/* Submit Order Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: "bold",
            fontSize: "16px",
            bgcolor: side === "BUY" ? "#2e7d32" : "#d32f2f",
            "&:hover": {
              bgcolor: side === "BUY" ? "#1b5e20" : "#c62828",
            },
          }}
        >
          {side === "BUY" ? "SUBMIT BUY ORDER" : "SUBMIT SELL ORDER"}
        </Button>

        {notification && (
          <Alert
            severity={notification.type}
            onClose={() => setNotification(null)}
            sx={{ mt: 1 }}
          >
            {notification.message}
          </Alert>
        )}
      </form>
    </Paper>
  );
};

export default OrderEntryForm;
