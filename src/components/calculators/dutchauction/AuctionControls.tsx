import React from "react";
import {
  Paper,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  Grid,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDutchAuction } from "./DutchAuctionContext";

export const AuctionControls: React.FC = () => {
  const {
    targetOfferingAmount,
    setTargetOfferingAmount,
    nonCompetitiveAmount,
    setNonCompetitiveAmount,
    whenIssuedYield,
    setWhenIssuedYield,
    formatCurrency,
  } = useDutchAuction();

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
      {/* Top Header Row */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <SettingsIcon sx={{ color: "#2563eb", fontSize: 26 }} />
        <Typography variant="h6" sx={{ fontWeight: "700", color: "#1e293b" }}>
          Auction Parameters & Offerings
        </Typography>
      </Stack>

      {/* Numerical Parameters Grid */}
      <Grid container spacing={2}>
        {/* Target Offering Amount */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Target Offering Amount ($ Millions)"
            variant="outlined"
            type="number"
            value={targetOfferingAmount}
            onChange={(e) =>
              setTargetOfferingAmount(
                Math.max(0, parseFloat(e.target.value) || 0),
              )
            }
            fullWidth
            helperText={`Total Offering: ${formatCurrency(targetOfferingAmount)}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontWeight: "700", color: "#2563eb" }}>
                    $
                  </Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontWeight: "700", color: "#64748b" }}>
                    M
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Non-Competitive Bids */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Non-Competitive Bids ($ Millions)"
            variant="outlined"
            type="number"
            value={nonCompetitiveAmount}
            onChange={(e) =>
              setNonCompetitiveAmount(
                Math.max(0, parseFloat(e.target.value) || 0),
              )
            }
            fullWidth
            helperText={`Net Competitive Offering: ${formatCurrency(
              Math.max(0, targetOfferingAmount - nonCompetitiveAmount),
            )}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontWeight: "700", color: "#64748b" }}>
                    $
                  </Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontWeight: "700", color: "#64748b" }}>
                    M
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* When-Issued (WI) Benchmark Yield */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="When-Issued (WI) Benchmark Yield (%)"
            variant="outlined"
            type="number"
            value={whenIssuedYield !== null ? whenIssuedYield : ""}
            onChange={(e) => {
              const val = e.target.value;
              setWhenIssuedYield(val === "" ? null : parseFloat(val) || 0);
            }}
            fullWidth
            helperText="Pre-auction 1:00 PM market yield to measure tail / stop-through"
            inputProps={{ step: "0.001" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontWeight: "700", color: "#64748b" }}>
                    %
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AuctionControls;
