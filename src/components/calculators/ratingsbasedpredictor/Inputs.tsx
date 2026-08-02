import React from "react";
import {
  TextField,
  Stack,
  Paper,
  Typography,
  Slider,
  Box,
} from "@mui/material";
import { useRatingsBasedPredictor } from "./RatingsBasedPredictorContext";

const Inputs: React.FC = () => {
  const { averageRating, setAverageRating, numRatings, setNumRatings } =
    useRatingsBasedPredictor();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1a2035" }}
      >
        Rating Parameters
      </Typography>
      <Stack spacing={4} sx={{ mt: 2 }}>
        {/* Granular Average Rating Slider */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              Average Rating (1.0 - 5.0)
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {averageRating.toFixed(1)} ★
            </Typography>
          </Stack>
          <Slider
            min={1.0}
            max={5.0}
            step={0.1}
            marks={[
              { value: 1.0, label: "1.0★" },
              { value: 2.0, label: "2.0★" },
              { value: 3.0, label: "3.0★" },
              { value: 4.0, label: "4.0★" },
              { value: 5.0, label: "5.0★" },
            ]}
            value={averageRating}
            onChange={(_, val) => setAverageRating(val as number)}
            valueLabelDisplay="off"
            color="primary"
          />
        </Box>

        {/* Number of Reviewers (Raters) */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
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
