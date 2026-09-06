import React, { useState } from "react";
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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Stack,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useDutchAuction } from "./DutchAuctionContext";
import { ProcessedBid } from "./types";

export const BidsTable: React.FC = () => {
  const {
    auctionResults,
    availableDealers,
    addBid,
    updateBid,
    removeBid,
    duplicateBid,
    clearAllBids,
    formatCurrency,
    formatYield,
  } = useDutchAuction();

  const { processedBids, stopOutYield } = auctionResults;
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Quick inline add states
  const [quickDealer, setQuickDealer] = useState<string>(
    availableDealers[0] || "JPMorgan Securities",
  );
  const [quickYield, setQuickYield] = useState<string>("4.280");
  const [quickAmount, setQuickAmount] = useState<string>("5000");

  // Modal Dialog State
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalDealer, setModalDealer] = useState<string>(
    availableDealers[0] || "JPMorgan Securities",
  );
  const [modalYield, setModalYield] = useState<string>("4.280");
  const [modalAmount, setModalAmount] = useState<string>("5000");

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseFloat(quickYield);
    const a = parseFloat(quickAmount);
    if (!isNaN(y) && !isNaN(a) && a > 0 && quickDealer.trim()) {
      addBid(quickDealer.trim(), y, a);
      setQuickAmount("");
    }
  };

  const handleModalAdd = () => {
    const y = parseFloat(modalYield);
    const a = parseFloat(modalAmount);
    if (!isNaN(y) && !isNaN(a) && a > 0 && modalDealer.trim()) {
      addBid(modalDealer.trim(), y, a);
      setOpenModal(false);
    }
  };

  const filteredBids = processedBids.filter((bid) =>
    bid.dealerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      {/* Table Header Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <FormatListNumberedIcon sx={{ color: "#2563eb", fontSize: 26 }} />
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "700", color: "#1e293b" }}
            >
              Primary Dealer Competitive Bids Book
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Sorted in ascending order of yield (lowest yield / highest price
              first)
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            size="small"
            placeholder="Search Dealer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "#64748b" }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 200 } }}
          />

          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              fontWeight: "700",
              bgcolor: "#2563eb",
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            Add Dealer
          </Button>

          <Tooltip title="Clear all bids">
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ClearAllIcon />}
              onClick={clearAllBids}
              sx={{ textTransform: "none", fontWeight: "700" }}
            >
              Clear
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Inline Quick Add Dealer & Bid Form */}
      <Box
        component="form"
        onSubmit={handleQuickAdd}
        sx={{
          p: 1.5,
          mb: 2,
          bgcolor: "#f8fafc",
          borderRadius: 2,
          border: "1px dashed #cbd5e1",
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: "800",
            color: "#2563eb",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            width: { xs: "100%", md: "auto" },
          }}
        >
          + Quick Add Bid:
        </Typography>

        <Autocomplete
          freeSolo
          size="small"
          options={availableDealers}
          value={quickDealer}
          onChange={(_, newVal) => {
            if (typeof newVal === "string") setQuickDealer(newVal);
          }}
          onInputChange={(_, newInputValue) => {
            setQuickDealer(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Dealer Name (type or select)"
              size="small"
            />
          )}
          sx={{ minWidth: 220, flexGrow: 1 }}
        />

        <TextField
          size="small"
          label="Yield (%)"
          type="number"
          inputProps={{ step: "0.001", min: "0" }}
          value={quickYield}
          onChange={(e) => setQuickYield(e.target.value)}
          sx={{ width: 110 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />

        <TextField
          size="small"
          label="Amount ($M)"
          type="number"
          inputProps={{ min: "1" }}
          value={quickAmount}
          onChange={(e) => setQuickAmount(e.target.value)}
          placeholder="e.g. 5000"
          sx={{ width: 130 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: <InputAdornment position="end">M</InputAdornment>,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{
            fontWeight: "700",
            textTransform: "none",
            bgcolor: "#16a34a",
            "&:hover": { bgcolor: "#15803d" },
          }}
        >
          Add to Book
        </Button>
      </Box>

      {/* Responsive Bids Table */}
      <TableContainer
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          maxHeight: 500,
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
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 120 }}
              >
                Bid Yield (%)
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 130 }}
              >
                Bid Amount ($M)
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 140 }}
              >
                Cumulative ($M)
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 150 }}
              >
                Award Status
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 130 }}
              >
                Awarded ($M)
              </TableCell>
              <TableCell
                align="right"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", minWidth: 110 }}
              >
                Clearing Yield
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#f8fafc", fontWeight: "800", width: 80 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredBids.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{ py: 4, color: "#64748b" }}
                >
                  No bids found. Click <b>&quot;Add Dealer&quot;</b> or choose a
                  preset scenario above.
                </TableCell>
              </TableRow>
            ) : (
              filteredBids.map((bid: ProcessedBid, index: number) => {
                const isStopOutRow =
                  Math.abs(bid.bidYield - stopOutYield) < 0.0001;

                let rowBgColor = "inherit";
                if (bid.status === "ACCEPTED") rowBgColor = "#f0fdf4";
                else if (bid.status === "ALLOTTED_AT_HIGH")
                  rowBgColor = "#fefce8";
                else if (bid.status === "REJECTED") rowBgColor = "#f8fafc";

                return (
                  <TableRow
                    key={bid.id}
                    sx={{
                      bgcolor: rowBgColor,
                      borderLeft: isStopOutRow ? "4px solid #d97706" : "none",
                      "&:hover": { bgcolor: "#f1f5f9" },
                    }}
                  >
                    <TableCell sx={{ color: "#64748b", fontWeight: "700" }}>
                      {index + 1}
                    </TableCell>

                    {/* Dealer Name (Editable / Selectable) */}
                    <TableCell
                      sx={{
                        fontWeight: "700",
                        color: "#1e293b",
                        minWidth: 180,
                      }}
                    >
                      <TextField
                        size="small"
                        value={bid.dealerName}
                        onChange={(e) =>
                          updateBid(bid.id, "dealerName", e.target.value)
                        }
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{
                          "& .MuiInputBase-input": {
                            fontWeight: "700",
                            color: "#1e293b",
                            p: 0.5,
                            fontSize: "0.85rem",
                            "&:focus": {
                              bgcolor: "#ffffff",
                              borderRadius: 1,
                              boxShadow: "0 0 0 1px #2563eb",
                            },
                          },
                        }}
                      />
                    </TableCell>

                    {/* Inline Editable Bid Yield */}
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ step: "0.001", min: "0" }}
                        value={bid.bidYield}
                        onChange={(e) =>
                          updateBid(bid.id, "bidYield", e.target.value)
                        }
                        sx={{
                          width: 100,
                          "& .MuiInputBase-input": {
                            py: 0.5,
                            px: 1,
                            fontSize: "0.85rem",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: "700",
                          },
                        }}
                      />
                    </TableCell>

                    {/* Inline Editable Bid Amount */}
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: "1" }}
                        value={bid.bidAmount}
                        onChange={(e) =>
                          updateBid(bid.id, "bidAmount", e.target.value)
                        }
                        sx={{
                          width: 110,
                          "& .MuiInputBase-input": {
                            py: 0.5,
                            px: 1,
                            fontSize: "0.85rem",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: "700",
                          },
                        }}
                      />
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{ fontFamily: "monospace", color: "#64748b" }}
                    >
                      {formatCurrency(bid.cumulativeAmount)}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell align="center">
                      {bid.status === "ACCEPTED" && (
                        <Chip
                          label="ACCEPTED (100%)"
                          size="small"
                          sx={{
                            fontWeight: "800",
                            fontSize: "0.68rem",
                            bgcolor: "#dcfce7",
                            color: "#15803d",
                          }}
                        />
                      )}
                      {bid.status === "ALLOTTED_AT_HIGH" && (
                        <Chip
                          label={`CUTOFF (${bid.allotmentPct.toFixed(1)}%)`}
                          size="small"
                          sx={{
                            fontWeight: "800",
                            fontSize: "0.68rem",
                            bgcolor: "#fef3c7",
                            color: "#b45309",
                          }}
                        />
                      )}
                      {bid.status === "REJECTED" && (
                        <Chip
                          label="REJECTED (0%)"
                          size="small"
                          sx={{
                            fontWeight: "700",
                            fontSize: "0.68rem",
                            bgcolor: "#fee2e2",
                            color: "#b91c1c",
                          }}
                        />
                      )}
                    </TableCell>

                    {/* Awarded Amount */}
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: "800",
                        fontFamily: "monospace",
                        color: bid.awardedAmount > 0 ? "#15803d" : "#94a3b8",
                      }}
                    >
                      {formatCurrency(bid.awardedAmount)}
                    </TableCell>

                    {/* Clearing Yield */}
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "700",
                        color: bid.awardedAmount > 0 ? "#2563eb" : "#94a3b8",
                      }}
                    >
                      {bid.awardedAmount > 0
                        ? formatYield(bid.clearingYield)
                        : "—"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <Tooltip title="Duplicate this bid">
                          <IconButton
                            size="small"
                            onClick={() => duplicateBid(bid.id)}
                            sx={{ color: "#64748b" }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete this bid">
                          <IconButton
                            size="small"
                            onClick={() => removeBid(bid.id)}
                            sx={{ color: "#ef4444" }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dealer Modal Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "800", color: "#1e293b" }}>
          Add Primary Dealer Bid
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Autocomplete
              freeSolo
              options={availableDealers}
              value={modalDealer}
              onChange={(_, newVal) => {
                if (typeof newVal === "string") setModalDealer(newVal);
              }}
              onInputChange={(_, newInputValue) => {
                setModalDealer(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Primary Dealer Firm"
                  helperText="Select an existing dealer firm or enter any new custom dealer name"
                />
              )}
            />

            <TextField
              label="Bid Yield (%)"
              type="number"
              inputProps={{ step: "0.001", min: "0" }}
              value={modalYield}
              onChange={(e) => setModalYield(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography sx={{ fontWeight: "700" }}>%</Typography>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Bid Amount ($ Millions)"
              type="number"
              inputProps={{ min: "1" }}
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontWeight: "700" }}>$</Typography>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography sx={{ fontWeight: "700" }}>M</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenModal(false)}
            sx={{ fontWeight: "700", color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleModalAdd}
            sx={{ fontWeight: "800", bgcolor: "#2563eb" }}
          >
            Add Bid to Book
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BidsTable;
