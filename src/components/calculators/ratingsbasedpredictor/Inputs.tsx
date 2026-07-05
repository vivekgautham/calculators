import React from "react";
import { TextField, Stack, Paper, Typography, Slider, Box } from "@mui/material";
import { useRatingsBasedPredictor } from "./RatingsBasedPredictorContext";

const Inputs: React.FC = () => {
  const { averageRating, setAverageRating, numRatings, setNumRatings } = useRatingsBasedPredictor();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1a2035" }}>
        Rating Parameters
      </Typography>
      <Stack spacing={4} sx={{ mt: 2 }}>
        {/* Discrete Average Rating Slider */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              Average Rating (Discrete 1-5)
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              {averageRating} ★
            </Typography>
          </Stack>
          <Slider
            min={1}
            max={5}
            step={1}
            marks={[
              { value: 1, label: "1★" },
              { value: 2, label: "2★" },
              { value: 3, label: "3★" },
              { value: 4, label: "4★" },
              { value: 5, label: "5★" },
            ]}
            value={averageRating}
            onChange={(_, val) => setAverageRating(val as number)}
            valueLabelDisplay="off"
            color="primary"
          />
        </Box>

        {/* Number of Reviewers (Raters) */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              Number of Reviewers (Raters)
            </Typography>
            <TextField
              size="small"
              type="number"
              inputProps={{ min: 0, max: 10000 }}
              value={numRatings}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0 && val <= 10000) {
                  setNumRatings(val);
                }
              }}
              sx={{ width: 100 }}
            />
          </Stack>
          <Slider
            min={0}
            max={10000}
            step={1}
            value={numRatings > 10000 ? 10000 : numRatings}
            onChange={(_, val) => setNumRatings(val as number)}
            valueLabelDisplay="auto"
            color="primary"
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default Inputs;
