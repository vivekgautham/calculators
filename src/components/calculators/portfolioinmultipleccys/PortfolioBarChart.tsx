import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { usePortfolioInMultipleCcys } from "./PortfolioInMultipleCcysContext";

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

const PortfolioBarChart: React.FC = () => {
  const { currencies, totalYears } = usePortfolioInMultipleCcys();

  const chartOptions = useMemo(() => {
    const years = parseInt(totalYears.toString()) || 0;
    const categories: string[] = [];
    for (let year = 0; year <= years; year++) {
      categories.push(`Year ${year}`);
    }

    const series = currencies.map((currency) => {
      const data: number[] = [];
      const g = (parseFloat(currency.growthRate.toString()) || 0) / 100;
      const d = (parseFloat(currency.annualIncDecRate.toString()) || 0) / 100;
      const corpus = parseFloat(currency.corpusAmount.toString()) || 0;

      for (let year = 0; year <= years; year++) {
        // Value = Corpus * (1 + growthRate)^year * (1 + annualIncDecRate)^year
        const value = corpus * Math.pow(1 + g, year) * Math.pow(1 + d, year);
        data.push(parseFloat(value.toFixed(2)));
      }

      return {
        name: currency.ccyName,
        data: data,
      };
    });

    return {
      chart: {
        type: "column",
      },
      title: {
        text: "Currency Assets Growth Projection (Side-by-Side)",
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
          text: "Value (Base Currency)",
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
        pointFormat: "{series.name}: ${point.y:,.2f}<br/>",
      },
      plotOptions: {
        column: {
          stacking: undefined, // undefined configures side-by-side columns
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
  }, [currencies, totalYears]);

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default PortfolioBarChart;
