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
} from "@mui/material";
import { useFXRatesData } from "./hooks/useFXRatesData";

const FXRatesTable: React.FC = () => {

  const results = useFXRatesData();


  const tableRows = results.map((data) => {
    const observations = data.data?.observations ?? [];
    if (observations.length < 1) return null;

    const startRate = observations[0].value;
    const endRate = observations[observations.length - 1].value;
    const percentChange = ((endRate - startRate) / startRate) * 100;

    // Extract Base and Quote from name (e.g., "USD/INR")
    const [base, quote] = data.data ? data.data.series.name.split("/") : [];

    return {
      id: data.data?.series.id,
      name: data.data?.series.name,
      base: base,
      quote: quote,
      startRate: startRate.toFixed(4),
      endRate: endRate.toFixed(4),
      percentChange: percentChange.toFixed(2),
      isPositive: percentChange >= 0,
      rawPercentChange: percentChange,
      verdict: percentChange >= 0 ? "USD Strengthened" : `${quote} Strengthened`,
    };
  })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => b.rawPercentChange - a.rawPercentChange);

  return (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Summary Comparison
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="fx rates summary table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell><strong>Series</strong></TableCell>
            <TableCell><strong>Base Ccy</strong></TableCell>
            <TableCell><strong>Quote Ccy</strong></TableCell>
            <TableCell align="right"><strong>Start Rate</strong></TableCell>
            <TableCell align="right"><strong>End Rate</strong></TableCell>
            <TableCell align="right"><strong>% Change</strong></TableCell>
            <TableCell><strong>Verdict</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.base}</TableCell>
              <TableCell>{row.quote}</TableCell>
              <TableCell align="right">{row.startRate}</TableCell>
              <TableCell align="right">{row.endRate}</TableCell>
              <TableCell
                align="right"
                sx={{
                  color: row.isPositive ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {row.isPositive ? "+" : ""}{row.percentChange}%
              </TableCell>
              <TableCell
                sx={{
                  color: row.isPositive ? "green" : "#1976d2",
                  fontWeight: "bold",
                }}
              >
                {row.verdict}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FXRatesTable;
