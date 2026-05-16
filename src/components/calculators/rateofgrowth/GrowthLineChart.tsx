import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { useRateOfGrowth, GrowthFrequency } from "./RateOfGrowthContext";

const formatNumber = (value: number): string => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + "B";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
};

const GrowthLineChart: React.FC = () => {
  const { scenarios } = useRateOfGrowth();

  const chartOptions = useMemo(() => {
    const series = scenarios.map((scenario) => {
      const data: [number, number][] = [];
      const r = scenario.rate / 100;

      let periodsPerYear = 1;
      switch (scenario.frequency) {
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

      const totalPeriods = Math.floor(scenario.timeSpan * periodsPerYear);
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
        zoomType: "x",
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
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            const val = this.value as number;
            return "$" + formatNumber(val);
          },
        },
      },
      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y}</b><br/>',
        valueDecimals: 2,
      },
      series: series,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
    };
  }, [scenarios]);

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default GrowthLineChart;
