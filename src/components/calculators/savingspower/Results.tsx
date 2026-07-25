import React, { useState } from "react";
import { Paper, Typography, Box, Alert, Stack, Divider, Collapse, IconButton } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSavingsPower } from "./SavingsPowerContext";

const Results: React.FC = () => {
  const {
    salary,
    taxRate,
    spendingA,
    spendingB,
    spendingC,
    savingsA,
    savingsB,
    savingsC,
    takeHome,
  } = useSavingsPower();

  const [methodologyExpanded, setMethodologyExpanded] = useState<boolean>(false);

  // Pre-tax equivalence projected total income calculations
  const eqIncomeA_vs_C = salary + (taxRate > 0 ? (savingsA - savingsC) / (taxRate / 100) : 0);
  const eqIncomeA_vs_B = salary + (taxRate > 0 ? (savingsA - savingsB) / (taxRate / 100) : 0);
  const eqIncomeB_vs_C = salary + (taxRate > 0 ? (savingsB - savingsC) / (taxRate / 100) : 0);
  const eqIncomeC_vs_C = salary;

  const taxMultiplier = taxRate > 0 ? 1 / (taxRate / 100) : 1;

  return (
    <Stack spacing={3}>
      <Divider />

      {/* Row 1: Annual Savings */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, color: "#1a2035", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Projected Annual Savings
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {/* Person A Savings */}
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
                Person A Annual Savings
              </Typography>
              <AccountBalanceWalletIcon />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
              ${savingsA.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              investable take-home
            </Typography>
          </Paper>

          {/* Person B Savings */}
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
                Person B Annual Savings
              </Typography>
              <AccountBalanceWalletIcon />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
              ${savingsB.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              investable take-home
            </Typography>
          </Paper>

          {/* Person C Savings */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #7f8c8d 0%, #5d6d7e 100%)",
              color: "#ffffff",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
                Person C Annual Savings
              </Typography>
              <AccountBalanceWalletIcon />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
              ${savingsC.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              investable take-home
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Row 2: Pre-tax Equivalence Projected Total Income */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, color: "#1a2035", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Pre-Tax Equivalence Projected Total Income
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {/* Person A Equivalent Income */}
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #00b5ad 0%, #00807a 100%)",
              color: "#ffffff",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9, fontWeight: "bold" }}>
                Person A Equivalent Income
              </Typography>
              <PriceCheckIcon />
            </Box>

            {/* Vs Person C */}
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ${Math.round(eqIncomeA_vs_C).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, display: "block", mb: 1 }}>
                vs Person C
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5, borderColor: "rgba(255, 255, 255, 0.25)" }} />

            {/* Vs Person B */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ${Math.round(eqIncomeA_vs_B).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, display: "block" }}>
                vs Person B
              </Typography>
            </Box>
          </Paper>

          {/* Person B Equivalent Income */}
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #F39C12 0%, #B9770E 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9, fontWeight: "bold" }}>
                  Person B Equivalent Income
                </Typography>
                <PriceCheckIcon />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                ${Math.round(eqIncomeB_vs_C).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                vs Person C
              </Typography>
            </Box>
          </Paper>

          {/* Person C Equivalent Income */}
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #7f8c8d 0%, #5d6d7e 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9, fontWeight: "bold" }}>
                  Person C Equivalent Income
                </Typography>
                <PriceCheckIcon />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                ${Math.round(eqIncomeC_vs_C).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                baseline salary
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Analytical Breakdown Alert */}
      <Alert severity="success" icon={<EmojiEventsIcon />} sx={{ borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
          The Pre-tax Equivalent of Savings:
        </Typography>
        <Typography variant="body2">
          Because savings are made with <b>after-tax dollars</b>, Person A&apos;s extra savings of <b>${Math.abs(savingsA - savingsC).toLocaleString()}</b> over Person C can be construed as earning a pre-tax total income of <b>${Math.round(eqIncomeA_vs_C).toLocaleString()}</b>.
          To achieve the same savings rate as Person A, Person C would need a salary increase of <b>+${Math.round(eqIncomeA_vs_C - salary).toLocaleString()}</b>, boosting their pre-tax pay by <b>{((eqIncomeA_vs_C - salary) / salary * 100).toFixed(1)}%</b>!
        </Typography>
      </Alert>

      {/* Collapsible Methodology Explainer Card */}
      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, bgcolor: "#f8f9fa" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setMethodologyExpanded(!methodologyExpanded)}
          sx={{ cursor: "pointer", userSelect: "none" }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1a2035" }}>
              Calculation Methodology & Walkthrough
            </Typography>
          </Box>
          <IconButton size="small" component="div">
            {methodologyExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={methodologyExpanded}>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2} sx={{ pl: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#2E86C1" }}>
                  1. Calculate Take-home Pay
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  First, annual income tax is deducted from your pre-tax base salary.
                </Typography>
                <Box sx={{ bgcolor: "#ffffff", p: 1.5, borderRadius: 1, mt: 1, borderLeft: "4px solid #2E86C1" }}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                    Take-home = Base Salary &times; (1 - Tax Rate / 100)
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                    Live Math: ${salary.toLocaleString()} &times; (1 - {taxRate / 100}) = <b>${takeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b>
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#00b5ad" }}>
                  2. Calculate Annual Savings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Each person spends a portion of their take-home pay, and the remainder is saved.
                </Typography>
                <Box sx={{ bgcolor: "#ffffff", p: 1.5, borderRadius: 1, mt: 1, borderLeft: "4px solid #00b5ad" }}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                    Annual Savings = Take-home - Annual Spending
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                    Person A: ${takeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${spendingA.toLocaleString()} = <b>${savingsA.toLocaleString()}</b>
                    <br />
                    Person B: ${takeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${spendingB.toLocaleString()} = <b>${savingsB.toLocaleString()}</b>
                    <br />
                    Person C: ${takeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${spendingC.toLocaleString()} = <b>${savingsC.toLocaleString()}</b>
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#F39C12" }}>
                  3. Pre-tax Income Equivalence
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Since savings are funded using <b>after-tax dollars</b>, saving money is highly leveraged.
                  At a {taxRate}% tax rate, every $1 saved requires earning <b>${taxMultiplier.toFixed(2)}</b> in pre-tax salary.
                </Typography>
                <Box sx={{ bgcolor: "#ffffff", p: 1.5, borderRadius: 1, mt: 1, borderLeft: "4px solid #F39C12" }}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                    Equivalent Pre-tax Salary = Base Salary + (Savings / Tax Rate)
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                    Person A (vs Person C): ${salary.toLocaleString()} + (${savingsA.toLocaleString()} / {(taxRate / 100).toFixed(2)}) = <b>${Math.round(eqIncomeA_vs_C).toLocaleString()}</b>
                    <br />
                    Person A (vs Person B): ${salary.toLocaleString()} + ((${savingsA.toLocaleString()} - ${savingsB.toLocaleString()}) / {(taxRate / 100).toFixed(2)}) = <b>${Math.round(eqIncomeA_vs_B).toLocaleString()}</b>
                    <br />
                    Person B (vs Person C): ${salary.toLocaleString()} + (${savingsB.toLocaleString()} / {(taxRate / 100).toFixed(2)}) = <b>${Math.round(eqIncomeB_vs_C).toLocaleString()}</b>
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Collapse>
      </Paper>
    </Stack>
  );
};

export default Results;
