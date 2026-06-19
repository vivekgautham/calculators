import React from "react";
import {
  TextField,
  Stack,
  Box,
  IconButton,
  Typography,
  Divider,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { usePortfolioInMultipleCcys } from "./PortfolioInMultipleCcysContext";

const Inputs: React.FC = () => {
  const {
    currencies,
    totalYears,
    setTotalYears,
    addCurrency,
    removeCurrency,
    updateCurrency,
  } = usePortfolioInMultipleCcys();

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Global Parameters
          </Typography>
          <TextField
            label="Total Years"
            type="number"
            value={totalYears}
            onChange={(e) => setTotalYears(Number(e.target.value))}
            size="small"
            sx={{ width: 150 }}
            slotProps={{
              htmlInput: { min: 1, max: 100 },
            }}
          />
        </Box>

        <Divider />

        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Currencies
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={addCurrency}
            >
              Add Currency
            </Button>
          </Stack>

          <Stack spacing={3}>
            {currencies.map((currency) => (
              <Paper
                key={currency.key}
                variant="outlined"
                sx={{ p: 2, backgroundColor: "#fafafa" }}
              >
                <Grid container spacing={2}>
                  {/* First 3 parameters are vertically separated */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                      <TextField
                        label="Ccy Name"
                        value={currency.ccyName}
                        onChange={(e) =>
                          updateCurrency(currency.key, {
                            ccyName: e.target.value,
                          })
                        }
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Corpus Amount"
                        type="number"
                        value={currency.corpusAmount}
                        onChange={(e) =>
                          updateCurrency(currency.key, {
                            corpusAmount: Number(e.target.value),
                          })
                        }
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Growth Rate (%)"
                        type="number"
                        value={currency.growthRate}
                        onChange={(e) =>
                          updateCurrency(currency.key, {
                            growthRate: Number(e.target.value),
                          })
                        }
                        fullWidth
                        size="small"
                      />
                    </Stack>
                  </Grid>

                  {/* 4th parameter and actions on the right */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack
                      spacing={2}
                      justifyContent="space-between"
                      sx={{ height: "100%" }}
                    >
                      <TextField
                        label="Ccy Annual Inc/Dec Rate (%)"
                        type="number"
                        value={currency.annualIncDecRate}
                        onChange={(e) =>
                          updateCurrency(currency.key, {
                            annualIncDecRate: Number(e.target.value),
                          })
                        }
                        fullWidth
                        size="small"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          pt: 1,
                        }}
                      >
                        {currencies.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeCurrency(currency.key)}
                            title="Remove Currency"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Inputs;
