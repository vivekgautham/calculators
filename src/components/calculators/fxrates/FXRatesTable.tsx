import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { useFXRatesData } from "./hooks/useFXRatesData";

const FXRatesTable: React.FC = () => {
  const { data, isLoading } = useFXRatesData();

  if (isLoading || !data || !data.seriesList || data.seriesList.length === 0) {
    return null;
  }

  const tableRows = data.seriesList
    .map((item) => {
      const observations = item.observations ?? [];
      if (observations.length < 1) return null;

      const startRate = observations[0].value;
      const endRate = observations[observations.length - 1].value;
      const percentChange = ((endRate - startRate) / startRate) * 100;

      let minRate = observations[0].value;
      let maxRate = observations[0].value;
      for (const obs of observations) {
        if (obs.value < minRate) minRate = obs.value;
        if (obs.value > maxRate) maxRate = obs.value;
      }

      const quote = item.series.code.replace("USD/", "");

      return {
        id: item.series.id,
        code: item.series.code,
        name: item.series.name,
        currencyName: item.series.currencyName,
        category: item.series.category,
        startRate: startRate.toFixed(4),
        endRate: endRate.toFixed(4),
        minRate: minRate.toFixed(4),
        maxRate: maxRate.toFixed(4),
        percentChange: percentChange.toFixed(2),
        isPositive: percentChange >= 0,
        rawPercentChange: percentChange,
        verdict:
          percentChange > 0
            ? "USD Appreciated"
            : percentChange < 0
              ? `${quote} Appreciated`
              : "Unchanged",
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => b.rawPercentChange - a.rawPercentChange);

  if (tableRows.length === 0) return null;

  return (
    <TableContainer component={Paper} elevation={3}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="div">
          Exchange Rates Summary & Performance
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Quotes expressed as amount of Foreign Currency per 1 USD
        </Typography>
      </Box>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="fx rates summary table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "action.hover" }}>
            <TableCell>
              <strong>Currency Pair</strong>
            </TableCell>
            <TableCell>
              <strong>Currency Name</strong>
            </TableCell>
            <TableCell>
              <strong>Category</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Start Rate</strong>
            </TableCell>
            <TableCell align="right">
              <strong>End Rate</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Period Low / High</strong>
            </TableCell>
            <TableCell align="right">
              <strong>% Change (USD)</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Verdict</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((row) => (
            <TableRow
              key={row.id}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <strong>{row.code}</strong>
              </TableCell>
              <TableCell>{row.currencyName}</TableCell>
              <TableCell>
                <Chip
                  label={row.category === "Major Currencies" ? "Major" : "EM"}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">{row.startRate}</TableCell>
              <TableCell align="right">
                <strong>{row.endRate}</strong>
              </TableCell>
              <TableCell align="right" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                {row.minRate} - {row.maxRate}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: row.rawPercentChange >= 0 ? "success.main" : "error.main",
                  fontWeight: "bold",
                }}
              >
                {row.rawPercentChange >= 0 ? "+" : ""}
                {row.percentChange}%
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.verdict}
                  size="small"
                  color={row.rawPercentChange >= 0 ? "success" : "info"}
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FXRatesTable;
