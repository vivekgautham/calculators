import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useProgressiveTax } from "./ProgressiveTaxContext";

const TaxSummary: React.FC = () => {
  const { totalTax, effectiveRate, income } = useProgressiveTax();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="overline" display="block" gutterBottom>
              Total Tax
            </Typography>
            <Typography variant="h4" color="primary">
              ${totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="overline" display="block" gutterBottom>
              Effective Tax Rate
            </Typography>
            <Typography variant="h4" color="secondary">
              {effectiveRate.toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="overline" display="block" gutterBottom>
              Take Home Pay
            </Typography>
            <Typography variant="h4" sx={{ color: 'success.main' }}>
              ${(income - totalTax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaxSummary;
