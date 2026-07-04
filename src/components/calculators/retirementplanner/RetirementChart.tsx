import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { useRetirementPlanner } from "./RetirementPlannerContext";

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

const RetirementChart: React.FC = () => {
  const { yearlyData, retirementAge, currentAge } = useRetirementPlanner();

  const chartOptions = useMemo(() => {
    const categories = yearlyData.map((d) => `Age ${d.age}`);

    // Index of the retirement age in yearlyData
    const retirementIndex = Math.max(0, retirementAge - currentAge);

    return {
      chart: {
        zoomType: "x",
        spacingLeft: 10,
        spacingRight: 10,
      },
      title: {
        text: "Retirement Savings & Cash Flow Projection",
        style: {
          fontWeight: "bold",
          color: "#333",
        },
      },
      xAxis: {
        categories: categories,
        title: {
          text: "Age",
        },
        crosshair: true,
        plotLines: [
          {
            value: retirementIndex,
            color: "#ed6c02",
            width: 2,
            dashStyle: "Dash",
            zIndex: 5,
            label: {
              text: "Retirement",
              align: "center",
              style: {
                color: "#ed6c02",
                fontWeight: "bold",
              },
            },
          },
        ],
      },
      yAxis: [
        {
          // Primary yAxis (Balance)
          title: {
            text: "Savings Balance",
            style: {
              color: "#1976d2",
            },
          },
          labels: {
            formatter: function (
              this: Highcharts.AxisLabelsFormatterContextObject,
            ) {
              const val = this.value as number;
              return "$" + formatNumber(val);
            },
            style: {
              color: "#1976d2",
            },
          },
          min: 0,
        },
        {
          // Secondary yAxis (Contributions/Withdrawals)
          title: {
            text: "Annual Cash Flow",
            style: {
              color: "#2e7d32",
            },
          },
          labels: {
            formatter: function (
              this: Highcharts.AxisLabelsFormatterContextObject,
            ) {
              const val = this.value as number;
              return "$" + formatNumber(val);
            },
            style: {
              color: "#2e7d32",
            },
          },
          opposite: true,
          min: 0,
        },
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat:
          '<span style="font-size:12px;font-weight:bold">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0;padding-left:10px;text-align:right"><b>${point.y:,.0f}</b></td></tr>',
        footerFormat: "</table>",
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          threshold: null,
        },
        column: {
          borderWidth: 0,
          pointPadding: 0.1,
          groupPadding: 0.1,
        },
      },
      series: [
        {
          type: "area",
          name: "Savings Balance",
          data: yearlyData.map((d) => d.endingBalance),
          yAxis: 0,
          fillOpacity: 0.15,
          lineWidth: 3,
          zoneAxis: "x",
          zones: [
            {
              value: retirementIndex,
              color: "#1976d2", // Blue during accumulation
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "rgba(25, 118, 210, 0.4)"],
                  [1, "rgba(25, 118, 210, 0.0)"],
                ],
              },
            },
            {
              color: "#2e7d32", // Green during retirement
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "rgba(46, 125, 50, 0.4)"],
                  [1, "rgba(46, 125, 50, 0.0)"],
                ],
              },
            },
          ],
        },
        {
          type: "column",
          name: "Annual Contribution",
          data: yearlyData.map((d) => d.annualContribution),
          yAxis: 1,
          color: "#4caf50",
          opacity: 0.8,
        },
        {
          type: "column",
          name: "Annual Withdrawal",
          data: yearlyData.map((d) => d.annualWithdrawal),
          yAxis: 1,
          color: "#f44336",
          opacity: 0.8,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [yearlyData, retirementAge, currentAge]);

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default RetirementChart;
