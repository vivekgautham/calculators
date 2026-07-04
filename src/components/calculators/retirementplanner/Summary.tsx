import React from "react";
import { Grid, Paper, Typography, Box, Alert, AlertTitle } from "@mui/material";
import { useRetirementPlanner } from "./RetirementPlannerContext";

const Summary: React.FC = () => {
  const {
    retirementCorpus,
    depletionAge,
    yearlyData,
    lifeExpectancy,
    retirementAge,
  } = useRetirementPlanner();

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const { totalContributions, totalEarnings, totalWithdrawals, finalBalance } =
    React.useMemo(() => {
      let contribs = 0;
      let earnings = 0;
      let withdrawals = 0;

      yearlyData.forEach((row) => {
        contribs += row.annualContribution;
        earnings += row.investmentEarnings;
        withdrawals += row.annualWithdrawal;
      });

      const finalBal = yearlyData[yearlyData.length - 1]?.endingBalance || 0;

      return {
        totalContributions: contribs,
        totalEarnings: earnings,
        totalWithdrawals: withdrawals,
        finalBalance: finalBal,
      };
    }, [yearlyData]);

  const isSuccessful = depletionAge === null;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Alert status box */}
      <Box sx={{ mb: 3 }}>
        {isSuccessful ? (
          <Alert
            severity="success"
            sx={{ border: "1px solid #2e7d32", backgroundColor: "#e8f5e9" }}
          >
            <AlertTitle sx={{ fontWeight: "bold" }}>Plan Successful</AlertTitle>
            <Typography variant="body1">
              Your savings are projected to last through your life expectancy of{" "}
              <strong>{lifeExpectancy}</strong>. Estimated balance at age{" "}
              {lifeExpectancy} is{" "}
              <strong>{formatCurrency(finalBalance)}</strong>.
            </Typography>
          </Alert>
        ) : (
          <Alert
            severity="warning"
            sx={{ border: "1px solid #ed6c02", backgroundColor: "#fff3e0" }}
          >
            <AlertTitle sx={{ fontWeight: "bold" }}>
              Potential Shortfall
            </AlertTitle>
            <Typography variant="body1">
              Your savings are projected to run out at age{" "}
              <strong>{depletionAge}</strong> (in {depletionAge - retirementAge}{" "}
              years of retirement). To avoid this, consider increasing your
              monthly contribution, delaying retirement, or lowering expenses.
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Main metrics grid */}
      <Grid container spacing={3}>
        {/* Nest Egg at Retirement */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={2}
            sx={{ p: 2, textAlign: "center", borderLeft: "5px solid #1976d2" }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Corpus at Retirement (Age {retirementAge})
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
            >
              {formatCurrency(retirementCorpus)}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Contributions */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={2}
            sx={{ p: 2, textAlign: "center", borderLeft: "5px solid #4caf50" }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Total Contributed
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mt: 1, color: "#2e7d32" }}
            >
              {formatCurrency(totalContributions)}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Investment Growth */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={2}
            sx={{ p: 2, textAlign: "center", borderLeft: "5px solid #ed6c02" }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Total Compound Interest
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mt: 1, color: "#ed6c02" }}
            >
              {formatCurrency(totalEarnings)}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Withdrawals */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={2}
            sx={{ p: 2, textAlign: "center", borderLeft: "5px solid #9c27b0" }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Total Spending in Retirement
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mt: 1, color: "#9c27b0" }}
            >
              {formatCurrency(totalWithdrawals)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary;
