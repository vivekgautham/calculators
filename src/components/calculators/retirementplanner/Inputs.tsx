import React from "react";
import {
  TextField,
  Grid,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useRetirementPlanner } from "./RetirementPlannerContext";

const Inputs: React.FC = () => {
  const {
    currentAge,
    setCurrentAge,
    retirementAge,
    setRetirementAge,
    lifeExpectancy,
    setLifeExpectancy,
    currentNestEgg,
    setCurrentNestEgg,
    monthlyContribution,
    setMonthlyContribution,
    contributionIncreaseRate,
    setContributionIncreaseRate,
    preRetirementReturn,
    setPreRetirementReturn,
    postRetirementReturn,
    setPostRetirementReturn,
    inflationRate,
    setInflationRate,
    monthlyExpensesRetirement,
    setMonthlyExpensesRetirement,
  } = useRetirementPlanner();

  return (
    <Grid container spacing={3}>
      {/* Personal Info */}
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}
          >
            Timeline
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Current Age"
                type="number"
                value={currentAge}
                onChange={(e) =>
                  setCurrentAge(Math.max(0, Number(e.target.value)))
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">yrs</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Retirement Age"
                type="number"
                value={retirementAge}
                onChange={(e) =>
                  setRetirementAge(Math.max(currentAge, Number(e.target.value)))
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">yrs</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Life Expectancy"
                type="number"
                value={lifeExpectancy}
                onChange={(e) =>
                  setLifeExpectancy(
                    Math.max(retirementAge, Number(e.target.value)),
                  )
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">yrs</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Savings & Contributions */}
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}
          >
            Savings & Contributions
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Current Nest Egg"
                type="number"
                value={currentNestEgg}
                onChange={(e) =>
                  setCurrentNestEgg(Math.max(0, Number(e.target.value)))
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Monthly Contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) =>
                  setMonthlyContribution(Math.max(0, Number(e.target.value)))
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Annual Contribution Growth"
                type="number"
                value={contributionIncreaseRate}
                onChange={(e) =>
                  setContributionIncreaseRate(
                    Math.max(0, Number(e.target.value)),
                  )
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Investment & Inflation Rates */}
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "#ed6c02" }}
          >
            Expected Returns & Inflation
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Pre-Retirement Return"
                type="number"
                value={preRetirementReturn}
                onChange={(e) => setPreRetirementReturn(Number(e.target.value))}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Post-Retirement Return"
                type="number"
                value={postRetirementReturn}
                onChange={(e) =>
                  setPostRetirementReturn(Number(e.target.value))
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Inflation Rate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Retirement Phase */}
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "#9c27b0" }}
          >
            Retirement Expenses
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Monthly Expenses (Today's $)"
                type="number"
                value={monthlyExpensesRetirement}
                onChange={(e) =>
                  setMonthlyExpensesRetirement(
                    Math.max(0, Number(e.target.value)),
                  )
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
                helperText="Desired monthly lifestyle cost in retirement (inflates automatically)"
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Inputs;
