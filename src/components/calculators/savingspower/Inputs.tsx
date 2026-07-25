import React from "react";
import {
  Box,
  Paper,
  Typography,
  Slider,
  Stack,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSavingsPower } from "./SavingsPowerContext";

const Inputs: React.FC = () => {
  const {
    salary,
    setSalary,
    taxRate,
    setTaxRate,
    spendingA,
    setSpendingA,
    spendingB,
    setSpendingB,
    spendingC,
    setSpendingC,
    takeHome,
    savingsA,
    savingsB,
    savingsC,
  } = useSavingsPower();

  return (
    <Stack spacing={3}>
      {/* Global Salary & Tax Config */}
      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, bgcolor: "#f8f9fa" }}>
        <Stack spacing={2.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <SettingsIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#1a2035", textTransform: "uppercase" }}>
              Career & Income Settings
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
            {/* Salary */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                Pre-Tax Annual Salary: ${salary.toLocaleString()}
              </Typography>
              <Slider
                min={20000}
                max={5000000}
                step={25000}
                value={salary}
                onChange={(_, val) => {
                  const newSalary = val as number;
                  setSalary(newSalary);
                  // Safety clamp spending so it doesn't exceed new take home
                  const newTakeHome = newSalary * (1 - taxRate / 100);
                  if (spendingA > newTakeHome) setSpendingA(Math.round(newTakeHome * 0.5));
                  if (spendingB > newTakeHome) setSpendingB(Math.round(newTakeHome * 0.7));
                  if (spendingC > newTakeHome) setSpendingC(Math.round(newTakeHome));
                }}
                size="small"
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `$${val.toLocaleString()}`}
              />
            </Box>

            {/* Tax Rate */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                Income Tax Rate: {taxRate}%
              </Typography>
              <Slider
                min={0}
                max={60}
                step={1}
                value={taxRate}
                onChange={(_, val) => {
                  const newTax = val as number;
                  setTaxRate(newTax);
                  // Safety clamp spending
                  const newTakeHome = salary * (1 - newTax / 100);
                  if (spendingA > newTakeHome) setSpendingA(Math.round(newTakeHome * 0.5));
                  if (spendingB > newTakeHome) setSpendingB(Math.round(newTakeHome * 0.7));
                  if (spendingC > newTakeHome) setSpendingC(Math.round(newTakeHome));
                }}
                size="small"
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val}%`}
              />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Side-by-side Spending Comparisons (3-Column Layout) */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
        {/* Person A Card */}
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, borderTop: "4px solid #00b5ad" }}>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccountCircleIcon sx={{ color: "#00b5ad" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1a2035" }}>
                Person A
              </Typography>
            </Box>
            <Divider />

            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Annual Spending: ${spendingA.toLocaleString()}
            </Typography>
            <Slider
              min={0}
              max={Math.round(takeHome)}
              step={Math.max(1000, Math.round(takeHome / 200))}
              value={spendingA}
              onChange={(_, val) => setSpendingA(val as number)}
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val.toLocaleString()}`}
              sx={{ color: "#00b5ad" }}
            />

            <Box display="flex" justifyContent="space-between" sx={{ mt: 1, bgcolor: "#f0fbfc", p: 1.5, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Projected Annual Savings:</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#00807a" }}>
                ${savingsA.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Person B Card */}
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, borderTop: "4px solid #F39C12" }}>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccountCircleIcon sx={{ color: "#F39C12" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1a2035" }}>
                Person B
              </Typography>
            </Box>
            <Divider />

            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Annual Spending: ${spendingB.toLocaleString()}
            </Typography>
            <Slider
              min={0}
              max={Math.round(takeHome)}
              step={Math.max(1000, Math.round(takeHome / 200))}
              value={spendingB}
              onChange={(_, val) => setSpendingB(val as number)}
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val.toLocaleString()}`}
              sx={{ color: "#F39C12" }}
            />

            <Box display="flex" justifyContent="space-between" sx={{ mt: 1, bgcolor: "#fef9f0", p: 1.5, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Projected Annual Savings:</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#b9770e" }}>
                ${savingsB.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Person C Card */}
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, borderTop: "4px solid #7f8c8d" }}>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccountCircleIcon sx={{ color: "#7f8c8d" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1a2035" }}>
                Person C
              </Typography>
            </Box>
            <Divider />

            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Annual Spending: ${spendingC.toLocaleString()}
            </Typography>
            <Slider
              min={0}
              max={Math.round(takeHome)}
              step={Math.max(1000, Math.round(takeHome / 200))}
              value={spendingC}
              onChange={(_, val) => setSpendingC(val as number)}
              size="small"
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val.toLocaleString()}`}
              sx={{ color: "#7f8c8d" }}
            />

            <Box display="flex" justifyContent="space-between" sx={{ mt: 1, bgcolor: "#f2f4f4", p: 1.5, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Projected Annual Savings:</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#566573" }}>
                ${savingsC.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
};

export default Inputs;
