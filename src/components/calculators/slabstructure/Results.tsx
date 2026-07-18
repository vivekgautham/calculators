import React from "react";
import { Paper, Typography, Box, Alert, Stack } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PercentIcon from "@mui/icons-material/Percent";
import LayersIcon from "@mui/icons-material/Layers";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSlabStructure, formatINR } from "./SlabStructureContext";

const Results: React.FC = () => {
  const { selectedAmount, calculateForAmount } = useSlabStructure();
  const result = calculateForAmount(selectedAmount);

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
        {/* Total GST Payable */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #00b5ad 0%, #00807a 100%)",
            color: "#ffffff",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
              Total GST Payable
            </Typography>
            <ReceiptIcon />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
            ₹{result.gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            on transaction of {formatINR(selectedAmount)}
          </Typography>
        </Paper>

        {/* Effective Rate % */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #2E86C1 0%, #1B4F72 100%)",
            color: "#ffffff",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
              Effective GST Rate
            </Typography>
            <PercentIcon />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
            {result.effectiveRate.toFixed(4)}%
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            GST as % of Total Amount
          </Typography>
        </Paper>

        {/* Applicable Tier */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #8E44AD 0%, #512E5F 100%)",
            color: "#ffffff",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
              Applicable Slab Tier
            </Typography>
            <LayersIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", my: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {result.tierName.split(":")[0]}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {result.tierName.split(":")[1] || ""}
          </Typography>
        </Paper>

        {/* Marginal Rate */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #F39C12 0%, #B9770E 100%)",
            color: "#ffffff",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
              Marginal Tax Rate
            </Typography>
            <InfoOutlinedIcon />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
            {result.marginalRate}%
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            Rate on next excess rupee
          </Typography>
        </Paper>
      </Box>

      {/* Formula Breakdown Alert */}
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Calculation Breakdown ({result.tierName}):
        </Typography>
        <Typography variant="body2">{result.breakdown}</Typography>
      </Alert>
    </Stack>
  );
};

export default Results;
