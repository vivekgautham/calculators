import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box } from "@mui/material";
import { useSlabStructure, formatINR } from "./SlabStructureContext";

const SlabChart: React.FC = () => {
  const { chartData, config, selectedAmount } = useSlabStructure();

  const chartOptions = useMemo(() => {
    const gstSeriesData = chartData.map((d) => [d.amount, d.gst]);
    const rateSeriesData = chartData.map((d) => [d.amount, d.effectiveRate]);

    return {
      chart: {
        type: "line",
        spacingLeft: 10,
        spacingRight: 15,
        spacingTop: 20,
        spacingBottom: 15,
      },
      title: {
        text: "GST Payable vs Transaction Amount (ACE)",
        style: {
          fontWeight: "bold",
          fontSize: "16px",
          color: "#1a2035",
        },
      },
      subtitle: {
        text: `Showing slab structure curve from ${formatINR(chartData[0]?.amount || 100000)} to ${formatINR(chartData[chartData.length - 1]?.amount || 2000000)}`,
        style: {
          color: "#666",
        },
      },
      xAxis: {
        title: {
          text: "Transaction Amount (ACE)",
          style: { fontWeight: "bold" },
        },
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            return formatINR(this.value as number);
          },
        },
        plotLines: [
          {
            value: config.tier1Max,
            color: "#00b5ad",
            width: 2,
            dashStyle: "Dash",
            zIndex: 4,
            label: {
              text: "Tier 1 Limit (₹1L)",
              style: { color: "#00b5ad", fontWeight: "bold" },
            },
          },
          {
            value: config.tier2Max,
            color: "#8E44AD",
            width: 2,
            dashStyle: "Dash",
            zIndex: 4,
            label: {
              text: "Tier 2 Limit (₹10L)",
              style: { color: "#8E44AD", fontWeight: "bold" },
            },
          },
          {
            value: selectedAmount,
            color: "#e74c3c",
            width: 2,
            zIndex: 5,
            label: {
              text: `Selected (${formatINR(selectedAmount)})`,
              style: { color: "#e74c3c", fontWeight: "bold" },
            },
          },
        ],
      },
      yAxis: [
        {
          // Primary Y axis: GST Payable
          title: {
            text: "GST Payable (₹)",
            style: { color: "#00b5ad", fontWeight: "bold" },
          },
          labels: {
            formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
              return "₹" + (this.value as number).toLocaleString("en-IN");
            },
            style: { color: "#00b5ad" },
          },
          min: 0,
        },
        {
          // Secondary Y axis: Effective GST %
          title: {
            text: "Effective GST Rate (%)",
            style: { color: "#F39C12", fontWeight: "bold" },
          },
          labels: {
            format: "{value:.3f}%",
            style: { color: "#F39C12" },
          },
          opposite: true,
          min: 0,
        },
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          const self = this as unknown as {
            x?: number;
            points?: Array<{
              y?: number;
              series: { name: string; color: string };
            }>;
          };
          const points = self.points || [];
          const xVal = self.x || 0;
          let html = `<div style="padding: 4px;"><b>Amount: ${formatINR(xVal)}</b><br/>`;
          points.forEach((p) => {
            const val = p.y || 0;
            if (p.series.name === "GST Payable (₹)") {
              html += `<span style="color:${p.series.color}">\u25CF</span> ${p.series.name}: <b>₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</b><br/>`;
            } else {
              html += `<span style="color:${p.series.color}">\u25CF</span> ${p.series.name}: <b>${val.toFixed(4)}%</b><br/>`;
            }
          });
          html += `</div>`;
          return html;
        },
      },
      series: [
        {
          name: "GST Payable (₹)",
          type: "area",
          data: gstSeriesData,
          color: "#00b5ad",
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(0, 181, 173, 0.4)"],
              [1, "rgba(0, 181, 173, 0.02)"],
            ],
          },
          yAxis: 0,
          lineWidth: 3,
          marker: { enabled: false },
        },
        {
          name: "Effective Rate (%)",
          type: "line",
          data: rateSeriesData,
          color: "#F39C12",
          yAxis: 1,
          dashStyle: "ShortDot",
          lineWidth: 2,
          marker: { enabled: false },
        },
      ],
      credits: { enabled: false },
      legend: { enabled: true },
    };
  }, [chartData, config, selectedAmount]);

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ width: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default SlabChart;
