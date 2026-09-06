import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { DutchAuctionProvider } from "./dutchauction/DutchAuctionContext";
import AuctionMetrics from "./dutchauction/AuctionMetrics";
import AuctionControls from "./dutchauction/AuctionControls";
import DemandCurveChart from "./dutchauction/DemandCurveChart";
import BidsTable from "./dutchauction/BidsTable";
import DealerSummaryTable from "./dutchauction/DealerSummaryTable";

export const DutchAuction: React.FC<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item) => item.name === props.name || item.value === "dutchauction",
  );

  return (
    <DutchAuctionProvider>
      <Box
        sx={{
          width: "100%",
          p: { xs: 2, md: 3 },
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
            {props.name || "Treasury Dutch Auction Simulator"}
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
            "Simulate US Treasury single-price Dutch auctions, calculate the stop-out clearing yield, pro-rata cutoff allotment ratio, bid-to-cover ratio, auction tail / stop-through, and dealer-by-dealer allocation breakdowns."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 8 }}>
          {/* 1. Offering Amount & Controls & Presets */}
          <AuctionControls />

          {/* 2. Detailed Primary Dealer Bids Order Book Table */}
          <BidsTable />

          {/* 3. Cumulative Demand Curve Chart */}
          <DemandCurveChart />

          {/* 4. All Summary Results at the End */}
          {/* Auction KPI Summary Metrics Bar */}
          <AuctionMetrics />

          {/* Aggregated Dealer League Summary Table */}
          <DealerSummaryTable />
        </Stack>
      </Box>
    </DutchAuctionProvider>
  );
};

export default DutchAuction;
