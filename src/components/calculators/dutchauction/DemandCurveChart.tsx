import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box } from "@mui/material";
import { useDutchAuction } from "./DutchAuctionContext";

export const DemandCurveChart: React.FC = () => {
  const { auctionResults, formatCurrency, formatYield } = useDutchAuction();

  const {
    processedBids,
    competitiveOfferingAmount,
    stopOutYield,
    allotmentAtHighPct,
    amountAwardedAtHigh,
  } = auctionResults;

  const chartOptions: Highcharts.Options = useMemo(() => {
    // Generate step points for cumulative demand curve
    // Distinct yields sorted
    const sortedYields = Array.from(
      new Set(processedBids.map((b) => b.bidYield)),
    ).sort((a, b) => a - b);

    let cum = 0;
    const seriesData: [number, number][] = [];

    // Add initial anchor point before first yield
    if (sortedYields.length > 0) {
      seriesData.push([sortedYields[0] - 0.005, 0]);
    }

    sortedYields.forEach((y) => {
      const bidsAtY = processedBids
        .filter((b) => b.bidYield === y)
        .reduce((sum, b) => sum + b.bidAmount, 0);
      cum += bidsAtY;
      seriesData.push([y, cum]);
    });

    return {
      chart: {
        type: "area",
        spacingLeft: 15,
        spacingRight: 20,
        spacingTop: 20,
        spacingBottom: 15,
        backgroundColor: "#ffffff",
        height: 420,
      },
      title: {
        text: "Treasury Dutch Auction Cumulative Demand Curve",
        style: {
          fontWeight: "bold",
          fontSize: "16px",
          color: "#1e293b",
        },
      },
      subtitle: {
        text: `Stop-Out Clearing Yield: ${formatYield(stopOutYield)} | Target Competitive Offering: ${formatCurrency(
          competitiveOfferingAmount,
        )}`,
        style: {
          color: "#64748b",
          fontSize: "12px",
        },
      },
      xAxis: {
        title: {
          text: "Bid Yield (%)",
          style: { color: "#64748b", fontWeight: "bold" },
        },
        labels: {
          style: { color: "#475569" },
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            return `${Number(this.value).toFixed(3)}%`;
          },
        },
        plotLines: [
          {
            value: stopOutYield,
            color: "#dc2626",
            width: 2,
            dashStyle: "Dash",
            zIndex: 5,
            label: {
              text: `Stop-Out Yield: ${formatYield(stopOutYield)}`,
              style: { color: "#dc2626", fontWeight: "bold", fontSize: "11px" },
              align: "right",
              y: 15,
            },
          },
        ],
        crosshair: true,
      },
      yAxis: {
        title: {
          text: "Cumulative Demand ($ Millions)",
          style: { color: "#2563eb", fontWeight: "bold" },
        },
        labels: {
          style: { color: "#475569" },
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            const val = Number(this.value);
            return val >= 1000 ? `$${(val / 1000).toFixed(0)}B` : `$${val}M`;
          },
        },
        plotLines: [
          {
            value: competitiveOfferingAmount,
            color: "#2563eb",
            width: 2.5,
            dashStyle: "Solid",
            zIndex: 4,
            label: {
              text: `Target Offering: ${formatCurrency(competitiveOfferingAmount)}`,
              style: {
                color: "#1d4ed8",
                fontWeight: "bold",
                fontSize: "12px",
              },
              align: "left",
              x: 10,
              y: -8,
            },
          },
        ],
        gridLineColor: "#f1f5f9",
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        borderWidth: 1,
        formatter: function (this: Highcharts.Point) {
          const xVal = Number(this.x);
          const yVal = Number(this.y);

          const matchingBids = processedBids.filter(
            (b) => Math.abs(b.bidYield - xVal) < 0.0001,
          );
          const totalAtThisYield = matchingBids.reduce(
            (sum, b) => sum + b.bidAmount,
            0,
          );

          let statusText = "";
          let statusColor = "#16a34a";
          if (xVal < stopOutYield - 0.00001) {
            statusText = "100% Accepted in Full";
            statusColor = "#16a34a";
          } else if (Math.abs(xVal - stopOutYield) < 0.0001) {
            statusText = `Stop-Out Cutoff: ${allotmentAtHighPct.toFixed(
              1,
            )}% Allotted (${formatCurrency(amountAwardedAtHigh)} awarded)`;
            statusColor = "#d97706";
          } else {
            statusText = "0% Rejected (Above Stop-Out Yield)";
            statusColor = "#dc2626";
          }

          return `
            <div style="padding: 6px; font-family: system-ui, sans-serif;">
              <div style="font-weight: bold; font-size: 13px; color: #1e293b; margin-bottom: 4px;">
                Bid Yield: ${formatYield(xVal)}
              </div>
              <div style="font-size: 11px; color: #64748b;">
                Bids at this yield: <b>${formatCurrency(totalAtThisYield)}</b> (${matchingBids.length} bids)
              </div>
              <div style="font-size: 11px; color: #2563eb; margin: 2px 0;">
                Cumulative Tendered: <b>${formatCurrency(yVal)}</b>
              </div>
              <div style="margin-top: 4px; font-weight: bold; font-size: 11px; color: ${statusColor};">
                Status: ${statusText}
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        area: {
          step: "left",
          lineWidth: 3,
          color: "#2563eb",
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(37, 99, 235, 0.35)"],
              [1, "rgba(37, 99, 235, 0.02)"],
            ],
          },
          marker: {
            enabled: true,
            radius: 4,
            fillColor: "#2563eb",
          },
        },
      },
      series: [
        {
          name: "Cumulative Demand",
          type: "area",
          data: seriesData,
        },
      ],
      credits: { enabled: false },
    };
  }, [
    processedBids,
    competitiveOfferingAmount,
    stopOutYield,
    allotmentAtHighPct,
    amountAwardedAtHigh,
    formatCurrency,
    formatYield,
  ]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "#ffffff",
        height: "100%",
        border: "1px solid #cbd5e1",
      }}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default DemandCurveChart;
