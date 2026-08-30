import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import { useAreaConverter } from "./AreaConverterContext";
import { AREA_UNITS } from "./types";

export const ConversionMatrix: React.FC = () => {
  const { inputUnit, setInputUnit, copyToClipboard } = useAreaConverter();
  const [hoveredCell, setHoveredCell] = useState<{
    row: string;
    col: string;
  } | null>(null);

  const CORE_UNITS = AREA_UNITS.filter((u) => u.isCoreUnit);

  const formatMatrixRatio = (val: number): string => {
    if (val === 1) return "1";
    if (val >= 1000000 || (val < 0.0001 && val > 0)) {
      return val.toExponential(3);
    }
    if (val >= 100)
      return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
    if (val >= 1)
      return val.toLocaleString("en-US", { maximumFractionDigits: 4 });
    return val.toLocaleString("en-US", { maximumFractionDigits: 6 });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #cbd5e1",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <TableChartIcon sx={{ color: "#4f46e5", fontSize: 26 }} />
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "700", color: "#1e293b" }}
            >
              Quick Reference Conversion Matrix (1 Unit = X Other Units)
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Cross-multiplication factor lookup table between all 7 primary
              area units
            </Typography>
          </Box>
        </Stack>

        <Chip
          label="Row: 1 Source Unit → Columns: Target Units"
          size="small"
          sx={{ fontWeight: "700", bgcolor: "#f1f5f9", color: "#475569" }}
        />
      </Stack>

      <TableContainer
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          maxHeight: 450,
          overflowX: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "#f8fafc",
                  fontWeight: "800",
                  color: "#1e293b",
                  borderRight: "2px solid #cbd5e1",
                  minWidth: 140,
                }}
              >
                1 Unit =
              </TableCell>
              {CORE_UNITS.map((colUnit) => (
                <TableCell
                  key={colUnit.id}
                  align="right"
                  sx={{
                    bgcolor: colUnit.id === inputUnit ? "#ecfdf5" : "#f8fafc",
                    fontWeight: "800",
                    color: colUnit.id === inputUnit ? "#059669" : "#1e293b",
                    minWidth: 120,
                  }}
                >
                  {colUnit.name} ({colUnit.symbol})
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {CORE_UNITS.map((rowUnit) => {
              const isSelectedRow = rowUnit.id === inputUnit;

              return (
                <TableRow
                  key={rowUnit.id}
                  sx={{
                    bgcolor: isSelectedRow ? "#f0fdf4" : "inherit",
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                >
                  {/* Row Header */}
                  <TableCell
                    sx={{
                      fontWeight: "800",
                      color: isSelectedRow ? rowUnit.accentColor : "#1e293b",
                      borderRight: "2px solid #cbd5e1",
                      cursor: "pointer",
                    }}
                    onClick={() => setInputUnit(rowUnit.id)}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>
                        1 {rowUnit.name} ({rowUnit.symbol})
                      </span>
                      {isSelectedRow && (
                        <Chip
                          label="ACTIVE"
                          size="small"
                          sx={{
                            fontSize: "0.6rem",
                            height: 18,
                            bgcolor: rowUnit.accentColor,
                            color: "#ffffff",
                            fontWeight: "800",
                          }}
                        />
                      )}
                    </Stack>
                  </TableCell>

                  {/* Matrix Ratio Cells */}
                  {CORE_UNITS.map((colUnit) => {
                    const ratio =
                      rowUnit.sqMetersMultiplier / colUnit.sqMetersMultiplier;
                    const isDiagonal = rowUnit.id === colUnit.id;
                    const isHovered =
                      hoveredCell?.row === rowUnit.id &&
                      hoveredCell?.col === colUnit.id;

                    const formattedRatio = formatMatrixRatio(ratio);

                    return (
                      <Tooltip
                        key={colUnit.id}
                        title={`Click to copy: 1 ${rowUnit.name} = ${ratio} ${colUnit.plural}`}
                      >
                        <TableCell
                          align="right"
                          onMouseEnter={() =>
                            setHoveredCell({
                              row: rowUnit.id,
                              col: colUnit.id,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() =>
                            copyToClipboard(
                              ratio.toString(),
                              `1 ${rowUnit.name} in ${colUnit.plural}`,
                            )
                          }
                          sx={{
                            cursor: "pointer",
                            fontWeight: isDiagonal ? "800" : "600",
                            color: isDiagonal
                              ? "#16a34a"
                              : isHovered
                                ? "#2563eb"
                                : "#334155",
                            bgcolor: isDiagonal
                              ? "#dcfce7"
                              : isHovered
                                ? "#e0f2fe"
                                : "inherit",
                            transition: "background 0.15s ease",
                            fontFamily:
                              ratio >= 1000 || ratio < 0.01
                                ? "monospace"
                                : "inherit",
                            fontSize: "0.85rem",
                          }}
                        >
                          {formattedRatio}
                        </TableCell>
                      </Tooltip>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ConversionMatrix;
