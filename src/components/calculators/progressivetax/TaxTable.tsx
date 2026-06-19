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
import { useProgressiveTax } from "./ProgressiveTaxContext";

const TaxTable: React.FC = () => {
  const { taxResults } = useProgressiveTax();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Typography variant="h6" sx={{ p: 2 }}>
        Tax Breakdown by Bracket
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "action.hover" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Bracket Range</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Taxable Amount in Bracket
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Tax Paid in Bracket
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taxResults.map((result) => (
            <TableRow key={result.bracket.id}>
              <TableCell>
                ${result.bracket.min.toLocaleString()} -{" "}
                {result.bracket.max === null
                  ? "Above"
                  : `$${result.bracket.max.toLocaleString()}`}
              </TableCell>
              <TableCell>{result.bracket.rate}%</TableCell>
              <TableCell align="right">
                $
                {result.taxableAmountInBracket.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell align="right">
                $
                {result.taxPaidInBracket.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaxTable;
