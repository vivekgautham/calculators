import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { useBlendedInvestment } from "./BlendedInvestmentContext";

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
    formatted = absoluteValue.toFixed(2);
  }

  return sign + formatted;
};

const BlendedBarChart: React.FC = () => {
  const { investments, totalYears } = useBlendedInvestment();

  const chartOptions = useMemo(() => {
    const categories: string[] = [];
    for (let year = 0; year <= totalYears; year++) {
      categories.push(`Year ${year}`);
    }

    const series = investments.map((investment) => {
      const data: number[] = [];
      const r = investment.rate / 100;

      for (let year = 0; year <= totalYears; year++) {
        const value = investment.amount * Math.pow(1 + r, year);
        data.push(parseFloat(value.toFixed(2)));
      }

      return {
        name: investment.name,
        data: data,
        color: investment.color,
      };
    });

    return {
      chart: {
        type: "column",
      },
      title: {
        text: "Portfolio Growth Projection",
      },
      xAxis: {
        categories: categories,
        title: {
          text: "Timeline",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Total Value",
        },
        stackLabels: {
          enabled: true,
          formatter: function (this: any) {
            return "$" + formatNumber(this.total || 0);
          },
        },
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            const val = this.value as number;
            return "$" + formatNumber(val);
          },
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        backgroundColor: "white",
        shadow: false,
      },
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat:
          "{series.name}: ${point.y:,.2f}<br/>Total: ${point.stackTotal:,.2f}",
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: series,
      credits: {
        enabled: false,
      },
    };
  }, [investments, totalYears]);

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default BlendedBarChart;
