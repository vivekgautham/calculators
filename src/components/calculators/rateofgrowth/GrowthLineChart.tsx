import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { useRateOfGrowth, GrowthFrequency } from "./RateOfGrowthContext";

const formatNumber = (value: number): string => {
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  let formatted = absoluteValue.toString();
  if (absoluteValue >= 1000000000000) {
    formatted = (absoluteValue / 1000000000000).toFixed(2) + "T";
  } else if (absoluteValue >= 1000000000) {
    formatted = (absoluteValue / 1000000000).toFixed(2) + "B";
  } else if (absoluteValue >= 1000000) {
    formatted = (absoluteValue / 1000000).toFixed(2) + "M";
  } else if (absoluteValue >= 1000) {
    formatted = (absoluteValue / 1000).toFixed(1) + "K";
  } else {
    formatted = absoluteValue.toFixed(2);
  }

  return sign + formatted;
};

const GrowthLineChart: React.FC = () => {
  const { scenarios, timeSpan, frequency } = useRateOfGrowth();

  const chartOptions = useMemo(() => {
    const series = scenarios.map((scenario) => {
      const data: [number, number][] = [];
      const r = scenario.rate / 100;

      let periodsPerYear = 1;
      switch (frequency) {
        case GrowthFrequency.DAILY:
          periodsPerYear = 365;
          break;
        case GrowthFrequency.WEEKLY:
          periodsPerYear = 52;
          break;
        case GrowthFrequency.MONTHLY:
          periodsPerYear = 12;
          break;
        case GrowthFrequency.ANNUALLY:
        default:
          periodsPerYear = 1;
          break;
      }

      const totalPeriods = Math.floor(timeSpan * periodsPerYear);
      const ratePerPeriod = r / periodsPerYear;

      for (let i = 0; i <= totalPeriods; i++) {
        const value = scenario.initialAmount * Math.pow(1 + ratePerPeriod, i);
        const year = i / periodsPerYear;
        data.push([year, parseFloat(value.toFixed(2))]);
      }

      return {
        name: scenario.name,
        data: data,
        color: scenario.color,
        marker: {
          enabled: false,
        },
      };
    });

    return {
      chart: {
        type: "line",
        zooming: {
          type: "x",
        },
        spacingLeft: 0,
        spacingRight: 10,
      },
      title: {
        text: "Projected Growth Comparison",
      },
      xAxis: {
        title: {
          text: "Years",
        },
        crosshair: true,
      },
      yAxis: {
        title: {
          text: "Value",
        },
        plotLines: [
          {
            value: 0,
            width: 2,
            color: "#888",
            zIndex: 1,
          },
        ],
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            const val = this.value as number;
            const prefix = val < 0 ? "-$" : "$";
            return prefix + formatNumber(Math.abs(val));
          },
        },
      },
      tooltip: {
        shared: true,
        pointFormatter: function (this: Highcharts.Point) {
          const val = this.y ?? 0;
          const prefix = val < 0 ? "-$" : "$";
          return `<span style="color:${this.series.color}">\u25CF</span> ${this.series.name}: <b>${prefix}${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b><br/>`;
        },
      },
      series: series,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
    };
  }, [scenarios, timeSpan, frequency]);

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default GrowthLineChart;
