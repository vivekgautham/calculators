import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box } from "@mui/material";
import { usePEValuation } from "./PEValuationContext";

export const PEChart: React.FC = () => {
  const {
    ttmPe,
    forwardPe,
    benchmarkPe,
    pegRatio,
    quarterlyMode,
    quarterlyEps,
  } = usePEValuation();

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: "column",
        spacingTop: 20,
        spacingBottom: 20,
        backgroundColor: "#ffffff",
        style: {
          fontFamily: "Inter, Roboto, sans-serif",
        },
      },
      title: {
        text: "P/E Multiple Comparison & Earnings Trajectory",
        style: {
          fontWeight: "bold",
          fontSize: "16px",
          color: "#1e293b",
        },
      },
      subtitle: {
        text: "Comparing Trailing Twelve Months (TTM) vs Forward Next Twelve Months (NTM) vs Sector Benchmark",
        style: {
          color: "#64748b",
          fontSize: "12px",
        },
      },
      xAxis: {
        categories: [
          "TTM P/E (x)",
          "Forward P/E (x)",
          "Benchmark P/E (x)",
          "PEG Ratio (x)",
        ],
        crosshair: true,
        labels: {
          style: {
            fontWeight: "600",
            color: "#334155",
          },
        },
      },
      yAxis: [
        {
          // Primary Axis for P/E Multiples
          title: {
            text: "Multiple Valuation (x)",
            style: { color: "#0284c7", fontWeight: "600" },
          },
          labels: {
            format: "{value}x",
            style: { color: "#0284c7" },
          },
          gridLineColor: "#f1f5f9",
          min: 0,
        },
        {
          // Secondary Axis for Per Share Amounts ($)
          title: {
            text: "Earnings Per Share ($)",
            style: { color: "#16a34a", fontWeight: "600" },
          },
          labels: {
            format: "${value}",
            style: { color: "#16a34a" },
          },
          opposite: true,
          gridLineWidth: 0,
          min: 0,
        },
      ],
      tooltip: {
        shared: true,
        headerFormat:
          '<span style="font-size: 11px; font-weight: bold">{point.key}</span><br/>',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          dataLabels: {
            enabled: true,
            format: "{y:.1f}x",
            style: {
              fontWeight: "bold",
              fontSize: "11px",
            },
          },
        },
      },
      series: [
        {
          name: "Valuation Multiples",
          type: "column",
          colorByPoint: true,
          colors: ["#d97706", "#16a34a", "#64748b", "#7c3aed"],
          data: [
            parseFloat(ttmPe.toFixed(2)),
            parseFloat(forwardPe.toFixed(2)),
            parseFloat(benchmarkPe.toFixed(2)),
            parseFloat(pegRatio.toFixed(2)),
          ],
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
    };
  }, [ttmPe, forwardPe, benchmarkPe, pegRatio]);

  // Quarterly Progression Line Chart Options
  const quarterlyChartOptions = useMemo(() => {
    const categories = [
      "Q1 Trailing",
      "Q2 Trailing",
      "Q3 Trailing",
      "Q4 Trailing",
      "FQ1 Forward",
      "FQ2 Forward",
      "FQ3 Forward",
      "FQ4 Forward",
    ];

    const data = [
      quarterlyEps.q1,
      quarterlyEps.q2,
      quarterlyEps.q3,
      quarterlyEps.q4,
      quarterlyEps.fq1,
      quarterlyEps.fq2,
      quarterlyEps.fq3,
      quarterlyEps.fq4,
    ];

    return {
      chart: {
        type: "areaspline",
        spacingTop: 20,
        backgroundColor: "#ffffff",
        style: { fontFamily: "Inter, Roboto, sans-serif" },
      },
      title: {
        text: "8-Quarter Sequential EPS Trajectory ($)",
        style: { fontWeight: "bold", fontSize: "15px", color: "#1e293b" },
      },
      subtitle: {
        text: "Sequential progression from Trailing Q1-Q4 Actuals to Forward FQ1-FQ4 Estimates",
        style: { color: "#64748b", fontSize: "12px" },
      },
      xAxis: {
        categories,
        crosshair: true,
        plotBands: [
          {
            from: -0.5,
            to: 3.5,
            color: "rgba(254, 243, 199, 0.3)",
            label: {
              text: "Trailing 4Q (Actuals)",
              style: { color: "#b45309", fontWeight: "bold" },
            },
          },
          {
            from: 3.5,
            to: 7.5,
            color: "rgba(220, 252, 231, 0.3)",
            label: {
              text: "Forward 4Q (Estimates)",
              style: { color: "#15803d", fontWeight: "bold" },
            },
          },
        ],
      },
      yAxis: {
        title: {
          text: "Quarterly EPS ($)",
          style: { color: "#0284c7", fontWeight: "600" },
        },
        labels: { format: "${value:.2f}" },
        gridLineColor: "#f1f5f9",
      },
      tooltip: {
        valuePrefix: "$",
        valueDecimals: 2,
      },
      plotOptions: {
        areaspline: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(2, 132, 199, 0.4)"],
              [1, "rgba(2, 132, 199, 0.0)"],
            ],
          },
          marker: { enabled: true, radius: 4 },
          lineWidth: 3,
          color: "#0284c7",
        },
      },
      series: [
        {
          name: "Quarterly EPS",
          data,
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
    };
  }, [quarterlyEps]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        my: 3,
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />

      {quarterlyMode && (
        <Box sx={{ mt: 3, pt: 3, borderTop: "1px dashed #cbd5e1" }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={quarterlyChartOptions}
          />
        </Box>
      )}
    </Paper>
  );
};

export default PEChart;
