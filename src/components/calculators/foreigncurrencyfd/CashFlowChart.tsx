import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box, Typography, Stack } from "@mui/material";
import { useForeignCurrencyFD } from "./ForeignCurrencyFDContext";

const formatCurrency = (val: number): string => {
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 1000000000) return `${sign}$${(abs / 1000000000).toFixed(2)}B`;
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(2)}M`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
};

export const CashFlowChart: React.FC = () => {
  const {
    cashFlowTimeline,
    creationFeesDollar,
    cumulativeInterestDollar,
    redemptionFeesDollar,
  } = useForeignCurrencyFD();

  // 1. Period Cash Flow Timeline Column Chart
  const timelineChartOptions = useMemo(() => {
    const categories = cashFlowTimeline.map((cf) => cf.periodLabel);
    const netFlowsData = cashFlowTimeline.map((cf) => ({
      y: parseFloat(cf.netAmount.toFixed(2)),
      color:
        cf.type === "Creation"
          ? "#ef4444"
          : cf.type === "Interest Payout"
            ? "#10b981"
            : "#0284c7",
    }));

    return {
      chart: {
        type: "column",
        backgroundColor: "#ffffff",
        height: 320,
      },
      title: {
        text: "Cash Flow Timeline (Period by Period)",
        style: { fontWeight: "bold", fontSize: "16px", color: "#1e293b" },
      },
      xAxis: {
        categories: categories,
        labels: {
          style: { fontSize: "11px", color: "#64748b" },
          rotation: -45,
        },
      },
      yAxis: {
        title: { text: "Net Cash Flow ($)" },
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            return formatCurrency(this.value as number);
          },
        },
      },
      tooltip: {
        formatter: function (this: any) {
          const pt = cashFlowTimeline[this.point.index];
          return `
            <b>${pt.periodLabel}</b><br/>
            Type: <b>${pt.type}</b><br/>
            Gross Amount: $${Math.abs(pt.grossAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}<br/>
            Fees Paid: -$${pt.feeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}<br/>
            <b>Net Cash Flow: $${pt.netAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</b><br/>
            Cumulative Net: $${pt.cumulativeCashFlow.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          `;
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        column: {
          borderRadius: 4,
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: "Net Cash Flow",
          data: netFlowsData,
        },
      ],
    };
  }, [cashFlowTimeline]);

  // 2. Fee Drag vs Net Return Donut Composition Chart
  const compositionChartOptions = useMemo(() => {
    const totalServicingFees = cashFlowTimeline
      .filter((cf) => cf.type === "Interest Payout")
      .reduce((sum, cf) => sum + cf.feeAmount, 0);

    const pieData = [
      {
        name: "Net Principal Returned",
        y: cashFlowTimeline[cashFlowTimeline.length - 1]?.netAmount || 0,
        color: "#0284c7",
      },
      {
        name: "Net Interest Received",
        y: cumulativeInterestDollar,
        color: "#10b981",
      },
      {
        name: "Creation Fees (x+y+z)",
        y: creationFeesDollar,
        color: "#f59e0b",
      },
      { name: "Servicing Fees (a+b)", y: totalServicingFees, color: "#ea580c" },
      {
        name: "Redemption Fees (u+v)",
        y: redemptionFeesDollar,
        color: "#ef4444",
      },
    ];

    return {
      chart: {
        type: "pie",
        backgroundColor: "#ffffff",
        height: 320,
      },
      title: {
        text: "Capital & Fee Breakdown",
        style: { fontWeight: "bold", fontSize: "16px", color: "#1e293b" },
      },
      tooltip: {
        pointFormat:
          "{series.name}: <b>${point.y:,.2f} ({point.percentage:.1f}%)</b>",
      },
      plotOptions: {
        pie: {
          innerSize: "60%",
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f}%",
            style: { fontSize: "11px" },
          },
        },
      },
      series: [
        {
          name: "Amount",
          data: pieData,
        },
      ],
      credits: { enabled: false },
    };
  }, [
    cashFlowTimeline,
    cumulativeInterestDollar,
    creationFeesDollar,
    redemptionFeesDollar,
  ]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#1e293b", mb: 2 }}
      >
        Cash Flow & Fee Drag Visualizer
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={timelineChartOptions}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={compositionChartOptions}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default CashFlowChart;
