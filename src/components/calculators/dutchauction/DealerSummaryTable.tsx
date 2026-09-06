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
  LinearProgress,
  Stack,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useDutchAuction } from "./DutchAuctionContext";
import { DealerSummary } from "./types";

export const DealerSummaryTable: React.FC = () => {
  const { auctionResults, formatCurrency, formatYield } = useDutchAuction();
  const { dealerSummaries } = auctionResults;

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #cbd5e1",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <AccountBalanceIcon sx={{ color: "#2563eb", fontSize: 26 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "700", color: "#1e293b" }}>
            Primary Dealer Allocation & Market Share Summary
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Aggregated statistics grouped by primary dealer firm
          </Typography>
        </Box>
      </Stack>

      <TableContainer
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          maxHeight: 420,
          overflowX: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", width: 50 }}
              >
                #
              </TableCell>
              <TableCell
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 200 }}
              >
                Primary Dealer
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", width: 80 }}
              >
                Bids
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 130 }}
              >
                Total Tendered ($M)
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 130 }}
              >
                Total Awarded ($M)
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 110 }}
              >
                Allotment Rate
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 120 }}
              >
                Avg Bid Yield
              </TableCell>
              <TableCell
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 180 }}
              >
                Auction Market Share
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dealerSummaries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ py: 4, color: "#64748b" }}
                >
                  No dealer data available.
                </TableCell>
              </TableRow>
            ) : (
              dealerSummaries.map((dealer: DealerSummary, idx: number) => {
                return (
                  <TableRow
                    key={dealer.dealerName}
                    sx={{
                      "&:hover": { bgcolor: "#f8fafc" },
                      bgcolor: idx % 2 === 0 ? "#ffffff" : "#fcfcfd",
                    }}
                  >
                    <TableCell sx={{ color: "#64748b", fontWeight: "700" }}>
                      {idx + 1}
                    </TableCell>

                    <TableCell sx={{ fontWeight: "700", color: "#1e293b" }}>
                      {dealer.dealerName}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ color: "#64748b", fontWeight: "600" }}
                    >
                      {dealer.totalBidsCount}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{ fontFamily: "monospace", color: "#475569" }}
                    >
                      {formatCurrency(dealer.totalBidAmount)}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "800",
                        color:
                          dealer.totalAwardedAmount > 0 ? "#16a34a" : "#94a3b8",
                      }}
                    >
                      {formatCurrency(dealer.totalAwardedAmount)}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "700",
                        color:
                          dealer.overallAllotmentPct > 50
                            ? "#15803d"
                            : dealer.overallAllotmentPct > 0
                              ? "#b45309"
                              : "#94a3b8",
                      }}
                    >
                      {dealer.overallAllotmentPct.toFixed(1)}%
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{ fontFamily: "monospace", color: "#475569" }}
                    >
                      {formatYield(dealer.averageBidYield)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, dealer.shareOfAuctionPct)}
                          sx={{
                            flexGrow: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "#e2e8f0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#2563eb",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: 42,
                            fontWeight: "700",
                            fontFamily: "monospace",
                            color: "#1e293b",
                          }}
                        >
                          {dealer.shareOfAuctionPct.toFixed(1)}%
                        </Typography>
                      </Stack>
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

export default DealerSummaryTable;
