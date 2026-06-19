import React from "react";
import {
  TextField,
  Stack,
  Box,
  IconButton,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useProgressiveTax } from "./ProgressiveTaxContext";

const Inputs: React.FC = () => {
  const {
    income,
    setIncome,
    brackets,
    addBracket,
    removeBracket,
    updateBracket,
  } = useProgressiveTax();

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Income Information
          </Typography>
          <TextField
            label="Total Annual Income"
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            fullWidth
            size="medium"
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
            <Typography variant="h6">Tax Brackets</Typography>
            <IconButton
              color="primary"
              onClick={addBracket}
              title="Add Bracket"
            >
              <AddIcon />
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            {brackets.map((bracket) => (
              <Paper key={bracket.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TextField
                    label="Min ($)"
                    type="number"
                    value={bracket.min}
                    onChange={(e) =>
                      updateBracket(bracket.id, { min: Number(e.target.value) })
                    }
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Max ($)"
                    type="number"
                    value={bracket.max === null ? "" : bracket.max}
                    placeholder="Infinity"
                    onChange={(e) =>
                      updateBracket(bracket.id, {
                        max:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Rate (%)"
                    type="number"
                    value={bracket.rate}
                    onChange={(e) =>
                      updateBracket(bracket.id, {
                        rate: Number(e.target.value),
                      })
                    }
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeBracket(bracket.id)}
                    disabled={brackets.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Inputs;
