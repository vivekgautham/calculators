import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";
import { usePortfolioShockMatrix } from "./PortfolioShockMatrixContext";

const formatNumber = (value: number): string => {
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  let formatted = absoluteValue.toString();
  if (absoluteValue >= 1000000000) {
    formatted = (absoluteValue / 1000000000).toFixed(1) + "B";
  } else if (absoluteValue >= 1000000) {
    formatted = (absoluteValue / 1000000).toFixed(1) + "M";
  } else if (absoluteValue >= 1000) {
    formatted = (absoluteValue / 1000).toFixed(1) + "K";
  } else {
    formatted = absoluteValue.toFixed(0);
  }

  return sign + formatted;
};

const ShockChart: React.FC = () => {
  const { scenarios, initialCorpus, currentCorpus } = usePortfolioShockMatrix();

  const chartOptions = useMemo(() => {
    const categories = scenarios.map(
      (s) => `${s.shockPercent > 0 ? "+" : ""}${s.shockPercent}%`,
    );
    const initVal = parseFloat(initialCorpus.toString()) || 0;
    const currentVal = parseFloat(currentCorpus.toString()) || 0;

    // Series 1: Corpus remaining (Base)
    const baseCorpusData = scenarios.map((s) => ({
      y: s.isNegativeScenario ? s.finalValue : s.initialCorpus,
      color: s.isNegativeScenario ? "#e53935" : "#a5d6a7", // Bright Red if below corpus, Light Green if above
      name: s.isNegativeScenario ? "Fund Value (Loss)" : "Base Corpus",
    }));

    // Series 2: Net Gain
    const gainData = scenarios.map((s) => ({
      y: s.isNegativeScenario ? 0 : s.netProfitLoss,
      color: "#2e7d32", // Rich Dark Green for gain
      name: "Portfolio Gain",
    }));

    return {
      chart: {
        type: "column",
      },
      title: {
        text: "Portfolio Shock Scenarios Impact",
      },
      xAxis: {
        categories: categories,
        title: {
          text: "Market Shock Scenario",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Total Fund Value ($)",
        },
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            return "$" + formatNumber(this.value as number);
          },
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color: "#333",
            textOutline: "none",
          },
          formatter: function (this: any) {
            return "$" + formatNumber(this.total);
          },
        },
        plotLines: [
          {
            value: initVal,
            color: "#d32f2f", // Red
            dashStyle: "Dash",
            width: 2,
            zIndex: 5,
            label: {
              text: `Initial Corpus: $${formatNumber(initVal)}`,
              align: "left",
              verticalAlign: "top",
              y: -5,
              x: 10,
              style: {
                color: "#d32f2f",
                fontWeight: "bold",
              },
            },
          },
          {
            value: currentVal,
            color: "#1976d2", // Blue
            dashStyle: "Dash",
            width: 2,
            zIndex: 5,
            label: {
              text: `Current Corpus: $${formatNumber(currentVal)}`,
              align: "right",
              verticalAlign: "top",
              y: -5,
              x: -10,
              style: {
                color: "#1976d2",
                fontWeight: "bold",
              },
            },
          },
        ],
      },
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
      },
      tooltip: {
        formatter: function (this: any) {
          const pointIndex = this.point.index;
          const s = scenarios[pointIndex];

          let tooltipHtml = `<b>Market Shock: ${s.shockPercent > 0 ? "+" : ""}${s.shockPercent}%</b><br/>`;
          tooltipHtml += `Initial Corpus: $${s.initialCorpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}<br/>`;
          tooltipHtml += `Current Corpus: $${s.currentCorpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}<br/>`;
          tooltipHtml += `Market Shock Impact: $${s.shockAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}<br/>`;
          tooltipHtml += `<b>Total Fund Value: $${s.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b><br/>`;
          tooltipHtml += `Net Return: <span style="color: ${s.netProfitLoss < 0 ? "red" : "green"}"><b>$${s.netProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${s.percentProfitLoss > 0 ? "+" : ""}${s.percentProfitLoss.toFixed(1)}%)</b></span>`;

          return tooltipHtml;
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: "Base Corpus",
          data: baseCorpusData,
          showInLegend: true,
          color: "#a5d6a7",
        },
        {
          name: "Portfolio Gain",
          data: gainData,
          showInLegend: true,
          color: "#2e7d32",
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [scenarios, initialCorpus, currentCorpus]);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        Scenario Analysis Visualizer
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default ShockChart;
