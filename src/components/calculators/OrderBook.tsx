import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip, Grid } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { OrderBookProvider } from "./orderbook/OrderBookContext";
import MarketMetrics from "./orderbook/MarketMetrics";
import OrderEntryForm from "./orderbook/OrderEntryForm";
import OrderBookLadder from "./orderbook/OrderBookLadder";
import PriceHistoryChart from "./orderbook/PriceHistoryChart";
import TradeLog from "./orderbook/TradeLog";
import ActiveOrdersList from "./orderbook/ActiveOrdersList";

const OrderBook: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item: { name: string; value: string }) =>
      item.name === props.name || item.value === "orderbook",
  );

  return (
    <OrderBookProvider>
      <Box
        sx={{
          width: "100%",
          p: 3,
          height: "100vh",
          overflowY: "auto",
          textAlign: "left",
          bgcolor: "#f4f6f8",
        }}
      >
        {/* Header Block with Color-coded Tags */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexWrap: "wrap", mb: 1 }}
        >
          <Header as="h2" textAlign="left" style={{ margin: 0 }}>
            {props.name || "Limit Order Book & Matching Simulator"}
          </Header>
          {calculatorMeta?.tags.map((tag: string) => {
            const styles = getTagStyles(tag);
            return (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: styles.backgroundColor,
                  color: styles.color,
                  borderColor: styles.borderColor,
                }}
              />
            );
          })}
        </Stack>
        <Header
          as="h5"
          textAlign="left"
          style={{ marginTop: 8, color: "#666" }}
        >
          {calculatorMeta?.description ||
            "Simulate a limit order book (LOB) with price-time priority matching engine, market orders, and live price history execution charts."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 4 }}>
          {/* Top Ticker & Metrics Bar */}
          <MarketMetrics />

          {/* Main 3-Column Workspace */}
          <Grid container spacing={2.5}>
            {/* Left: Order Entry Desk */}
            <Grid size={{ xs: 12, md: 4 }}>
              <OrderEntryForm />
            </Grid>

            {/* Center: DOM Level 2 Depth Ladder */}
            <Grid size={{ xs: 12, md: 4 }}>
              <OrderBookLadder />
            </Grid>

            {/* Right: Price Execution Chart */}
            <Grid size={{ xs: 12, md: 4 }}>
              <PriceHistoryChart />
            </Grid>
          </Grid>

          {/* Bottom Grid: Trade Executions & Open Orders */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TradeLog />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActiveOrdersList />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </OrderBookProvider>
  );
};

export default OrderBook;
