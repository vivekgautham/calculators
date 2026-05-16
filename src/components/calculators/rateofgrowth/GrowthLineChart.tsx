import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { useRateOfGrowth, GrowthFrequency } from "./RateOfGrowthContext";

const GrowthLineChart: React.FC = () => {
  const { initialAmount, frequency, rate, timeSpan } = useRateOfGrowth();

  const chartOptions = useMemo(() => {
    const data: [number, number][] = [];
    const r = rate / 100;

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
      const value = initialAmount * Math.pow(1 + ratePerPeriod, i);
      const year = i / periodsPerYear;
      data.push([year, parseFloat(value.toFixed(2))]);
    }

    return {
      chart: {
        type: 'line',
        zoomType: 'x',
        spacingLeft: 0,
        spacingRight: 0,
      },
      title: {
        text: "Projected Growth Over Time",
      },
      xAxis: {
        title: {
          text: "Years",
        },
        crosshair: true
      },
      yAxis: {
        title: {
          text: "Value",
        },
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            return "$" + Highcharts.numberFormat(this.value as number, 0, ".", ",");
          },
        },
      },
      tooltip: {
        shared: true,
        pointFormat: "Value: <b>${point.y}</b>",
        valueDecimals: 2,
      },
      series: [
        {
          name: "Growth",
          data: data,
          color: "#36741e",
          marker: {
            enabled: false
          }
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [initialAmount, frequency, rate, timeSpan]);

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default GrowthLineChart;
