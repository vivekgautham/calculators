import React from "react";
import { Paper, Typography, Box, Stack, Divider, Alert } from "@mui/material";
import { useRatingsBasedPredictor } from "./RatingsBasedPredictorContext";

const BayesianSummary: React.FC = () => {
  const { averageRating, numRatings, trueRating } = useRatingsBasedPredictor();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1a2035" }}>
        True Rating Estimate
      </Typography>

      <Box sx={{ my: 3, textAlign: "center" }}>
        <Typography variant="h2" component="div" sx={{ fontWeight: "bold", color: "primary.main" }}>
          {trueRating.toFixed(2)} ★
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Estimated True Rating (Laplace Smoothed)
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5} sx={{ my: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Raw Average Rating:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {averageRating.toFixed(1)} ★
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Number of Reviewers:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {numRatings}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Adjustment Difference:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              color: trueRating < averageRating ? "error.main" : "success.main",
            }}
          >
            {(trueRating - averageRating).toFixed(2)}
          </Typography>
        </Stack>
      </Stack>

      <Alert severity="info" sx={{ mt: 3, border: "1px solid #b3e5fc", backgroundColor: "#e1f5fe" }}>
        <strong>Smoothing Rule:</strong> The True Rating Estimate is calculated by adding 5 virtual ratings (one of each: 1★, 2★, 3★, 4★, and 5★).
        This prevents small sample sizes from yielding extreme ratings (like a 5.0 with only 1 reviewer). As reviewer count increases, the impact of these 5 virtual ratings diminishes.
      </Alert>
    </Paper>
  );
};

export default BayesianSummary;
