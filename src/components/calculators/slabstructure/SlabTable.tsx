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
  Box,
} from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import { useSlabStructure, formatINR } from "./SlabStructureContext";

const BENCHMARK_AMOUNTS = [
  100000,   // ₹1 Lakh
  200000,   // ₹2 Lakh
  300000,   // ₹3 Lakh
  500000,   // ₹5 Lakh
  750000,   // ₹7.5 Lakh
  1000000,  // ₹10 Lakh
  1250000,  // ₹12.5 Lakh
  1500000,  // ₹15 Lakh
  1750000,  // ₹17.5 Lakh
  2000000,  // ₹20 Lakh
];

const SlabTable: React.FC = () => {
  const { calculateForAmount, selectedAmount, setSelectedAmount } = useSlabStructure();

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <TableChartIcon color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1a2035" }}>
          Benchmark GST Schedule (₹1 Lakh to ₹20 Lakh)
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 380, overflowY: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}>Transaction Amount (ACE)</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}>Applicable Slab Tier</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}>GST Payable (₹)</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}>Effective GST Rate (%)</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}>Marginal Rate (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {BENCHMARK_AMOUNTS.map((amt) => {
              const res = calculateForAmount(amt);
              const isSelected = selectedAmount === amt;

              return (
                <TableRow
                  key={amt}
                  hover
                  onClick={() => setSelectedAmount(amt)}
                  selected={isSelected}
                  sx={{
                    cursor: "pointer",
                    bgcolor: isSelected ? "rgba(0, 181, 173, 0.08) !important" : "inherit",
                    "&:hover": { bgcolor: "rgba(0, 181, 173, 0.04)" },
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {formatINR(amt)}
                    {isSelected && (
                      <Chip label="Selected" size="small" color="primary" sx={{ ml: 1, height: 20, fontSize: "10px" }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: "#555" }}>
                      {res.tierName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", color: "#00807a" }}>
                    ₹{res.gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", color: "#2E86C1" }}>
                    {res.effectiveRate.toFixed(4)}%
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#666" }}>
                    {res.marginalRate}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SlabTable;
