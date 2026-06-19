import React, { useRef } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStockAnalysis, StockDataPoint } from "./StockAnalysisContext";
import dayjs from "dayjs";

const Inputs: React.FC = () => {
  const { setData, clearData, fileName, data } = useStockAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text, file.name);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string, name: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    if (lines.length < 2) return;

    // Detect separator: comma or tab
    const firstLine = lines[0];
    const separator = firstLine.includes("\t") ? "\t" : ",";

    const headers = lines[0]
      .split(separator)
      .map((h) => h.trim().toLowerCase());

    const dateIdx = headers.findIndex((h) => h.includes("date"));
    const openIdx = headers.findIndex((h) => h.includes("open"));
    const highIdx = headers.findIndex((h) => h.includes("high"));
    const lowIdx = headers.findIndex((h) => h.includes("low"));
    // Handle "Close/Last" or "Close"
    const closeIdx = headers.findIndex(
      (h) => (h.includes("close") || h.includes("last")) && !h.includes("adj"),
    );
    const volumeIdx = headers.findIndex((h) => h.includes("volume"));

    const cleanNumber = (val: string): number => {
      if (!val) return 0;
      // Remove currency symbols, commas, etc. keep only digits, dots, and minus sign
      const cleaned = val.replace(/[^0-9.-]+/g, "");
      return parseFloat(cleaned) || 0;
    };

    const parsedData: StockDataPoint[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(separator).map((v) => v.trim());
      if (values.length < headers.length) continue;

      const dateStr = values[dateIdx];
      const timestamp = dayjs(dateStr).valueOf();

      if (isNaN(timestamp)) continue;

      parsedData.push({
        date: timestamp,
        open: cleanNumber(values[openIdx]),
        high: cleanNumber(values[highIdx]),
        low: cleanNumber(values[lowIdx]),
        close: cleanNumber(values[closeIdx]),
        volume: cleanNumber(values[volumeIdx]),
      });
    }

    if (parsedData.length > 0) {
      setData(parsedData, name);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </Button>

        {fileName ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Loaded: {fileName} ({data.length} records)
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => {
                clearData();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Clear
            </Button>
          </Stack>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Upload a CSV file (e.g., from Yahoo Finance) with Date, High, Low,
            Close columns.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Inputs;
