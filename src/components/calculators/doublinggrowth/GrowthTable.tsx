import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from "@mui/material";
import { useDoublingGrowth, formatLargeNumber } from "./DoublingGrowthContext";

export const GrowthTable: React.FC = () => {
  const { visibleTimeSeries, fullTimeSeries, timeUnit } = useDoublingGrowth();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1a2035" }}>
          Step-by-Step Exponential Breakdown
        </Typography>
        <Chip
          label={`${visibleTimeSeries.length} / ${fullTimeSeries.length} Steps`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Stack>

      <TableContainer sx={{ flexGrow: 1, maxHeight: 440, overflowY: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow
              sx={{ "& th": { bgcolor: "#f8fafc", fontWeight: "bold" } }}
            >
              <TableCell align="center">Step #</TableCell>
              <TableCell align="left">Time ({timeUnit})</TableCell>
              <TableCell align="right">Value (Exact)</TableCell>
              <TableCell align="left">Formatted / Abbreviated</TableCell>
              <TableCell align="right">Multiple from Start</TableCell>
              <TableCell align="right">Added in Cycle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleTimeSeries.map((row) => {
              const isDoubleStep = row.step > 0;
              return (
                <TableRow
                  key={row.step}
                  hover
                  sx={{ "&:nth-of-type(even)": { bgcolor: "#fafafa" } }}
                >
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#666" }}
                  >
                    {row.step}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "medium" }}>
                    {row.timeLabel}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontFamily: "monospace", fontSize: "12px" }}
                  >
                    {row.value < 1e12
                      ? row.value.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })
                      : row.value.toExponential(4)}
                  </TableCell>
                  <TableCell align="left">
                    <Chip
                      label={row.formattedValue}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        color: "#2e7d32",
                        fontSize: "11px",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {formatLargeNumber(row.growthFactorFromStart)}x
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: isDoubleStep ? "#2e7d32" : "#999" }}
                  >
                    {isDoubleStep
                      ? `+${formatLargeNumber(row.incrementalChange)}`
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GrowthTable;
