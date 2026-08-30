import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAreaConverter } from "./AreaConverterContext";
import { ConvertedResult } from "./types";

export const PrimaryCards: React.FC = () => {
  const {
    allResults,
    inputUnit,
    setInputUnit,
    copyToClipboard,
    selectedUnitMeta,
    parsedInputNumber,
  } = useAreaConverter();

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: "700", color: "#1e293b" }}>
          Converted Area Units
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Showing conversion for{" "}
          <strong>
            {parsedInputNumber} {selectedUnitMeta.name}
            {parsedInputNumber !== 1 ? "s" : ""}
          </strong>
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {allResults.map((result: ConvertedResult) => {
          const isInput = inputUnit === result.unit.id;
          const { unit, formattedValue, value, scientificValue } = result;

          return (
            <Grid key={unit.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                elevation={isInput ? 5 : 2}
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: isInput ? "#f0fdf4" : "#ffffff",
                  border: isInput
                    ? `2px solid ${unit.accentColor}`
                    : "1px solid #e2e8f0",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease-in-out",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                    borderColor: unit.accentColor,
                  },
                }}
              >
                {/* Active input unit indicator top banner */}
                {isInput && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bgcolor: unit.accentColor,
                      color: "#ffffff",
                      py: 0.25,
                      textAlign: "center",
                      fontSize: "0.65rem",
                      fontWeight: "800",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Active Input Unit
                  </Box>
                )}

                <Box sx={{ mt: isInput ? 1 : 0 }}>
                  {/* Card Header: Unit Name & Symbol */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "800",
                          color: "#1e293b",
                          lineHeight: 1.2,
                        }}
                      >
                        {unit.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "700",
                          color: unit.accentColor,
                          fontSize: "0.8rem",
                        }}
                      >
                        {unit.symbol}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Chip
                        label={unit.category.toUpperCase()}
                        size="small"
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: "700",
                          height: 20,
                          bgcolor: unit.accentColor + "1a",
                          color: unit.accentColor,
                        }}
                      />
                      <Tooltip title={`Copy ${formattedValue} ${unit.symbol}`}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            copyToClipboard(
                              value.toString(),
                              `${unit.name} (${unit.symbol})`,
                            )
                          }
                          sx={{ color: "#64748b", p: 0.5 }}
                        >
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {/* Converted Numerical Output */}
                  <Box sx={{ my: 1.5 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "800",
                        color: isInput ? unit.accentColor : "#0f172a",
                        wordBreak: "break-word",
                        fontSize:
                          formattedValue.length > 12 ? "1.5rem" : "1.85rem",
                        lineHeight: 1.15,
                      }}
                    >
                      {formattedValue}
                    </Typography>

                    {/* Scientific notation preview if value is very large or very small */}
                    {(value >= 1e6 || (value < 0.001 && value > 0)) && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontFamily: "monospace",
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        Scientific: {scientificValue} {unit.symbol}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Card Footer: Relationship info & Quick Switch Button */}
                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#475569",
                      display: "block",
                      fontSize: "0.72rem",
                      mb: 1.5,
                      bgcolor: "#f8fafc",
                      p: 0.8,
                      borderRadius: 1,
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    {unit.formulaRelation}
                  </Typography>

                  {isInput ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{
                        color: "#16a34a",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      <span>Current Source Unit</span>
                    </Stack>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      endIcon={
                        <ArrowForwardIcon
                          sx={{ fontSize: "14px !important" }}
                        />
                      }
                      onClick={() => setInputUnit(unit.id)}
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        py: 0.4,
                        textTransform: "none",
                        borderColor: "#cbd5e1",
                        color: "#334155",
                        "&:hover": {
                          borderColor: unit.accentColor,
                          bgcolor: unit.accentColor + "0d",
                          color: unit.accentColor,
                        },
                      }}
                    >
                      Convert From {unit.symbol}
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PrimaryCards;
