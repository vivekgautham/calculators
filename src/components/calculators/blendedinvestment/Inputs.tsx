import React from "react";
import {
  TextField,
  Stack,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  useBlendedInvestment,
  AVAILABLE_COLORS,
} from "./BlendedInvestmentContext";

const Inputs: React.FC = () => {
  const {
    investments,
    totalYears,
    setTotalYears,
    addInvestment,
    removeInvestment,
    updateInvestment,
  } = useBlendedInvestment();

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
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
            Investments
          </Typography>
          <Stack spacing={2}>
            {investments.map((investment, index) => (
              <Box key={investment.key}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "4px",
                      backgroundColor: investment.color,
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", flexGrow: 1 }}
                  >
                    {investment.name} (ID: {investment.id})
                  </Typography>

                  <Stack direction="row" spacing={0.5}>
                    {investments.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeInvestment(investment.key)}
                        title="Remove Investment"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    {index === investments.length - 1 && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={addInvestment}
                        title="Add Investment"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <TextField
                    label="Name"
                    value={investment.name}
                    onChange={(e) =>
                      updateInvestment(investment.key, { name: e.target.value })
                    }
                    fullWidth
                    size="small"
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={investment.color}
                      label="Color"
                      onChange={(e) =>
                        updateInvestment(investment.key, {
                          color: e.target.value,
                        })
                      }
                    >
                      {AVAILABLE_COLORS.map((color) => (
                        <MenuItem key={color} value={color}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: "2px",
                                backgroundColor: color,
                              }}
                            />
                            <Typography variant="body2">{color}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Initial Amount"
                    type="number"
                    value={investment.amount}
                    onChange={(e) =>
                      updateInvestment(investment.key, {
                        amount: Number(e.target.value),
                      })
                    }
                    fullWidth
                    size="small"
                  />

                  <TextField
                    label="Expected Rate (%)"
                    type="number"
                    value={investment.rate}
                    onChange={(e) =>
                      updateInvestment(investment.key, {
                        rate: Number(e.target.value),
                      })
                    }
                    fullWidth
                    size="small"
                  />
                </Stack>
                {index < investments.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Inputs;
