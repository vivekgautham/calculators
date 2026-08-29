import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { usePortfolioInMultipleCcys } from "./PortfolioInMultipleCcysContext";
import {
  getCurrencySymbol,
  convertToUSD,
  getCurrentFxRate,
  formatCurrencyValue,
  formatUSDCompact,
} from "./fredFxHelper";

const formatNumber = (value: number): string => {
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absoluteValue >= 1000000000) {
    return sign + (absoluteValue / 1000000000).toFixed(1) + "B";
  } else if (absoluteValue >= 1000000) {
    return sign + (absoluteValue / 1000000).toFixed(1) + "M";
  } else if (absoluteValue >= 1000) {
    return sign + (absoluteValue / 1000).toFixed(1) + "K";
  } else {
    return sign + absoluteValue.toFixed(2);
  }
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
      const nativeData: number[] = [];
      const g = (parseFloat(currency.growthRate.toString()) || 0) / 100;
      const d = (parseFloat(currency.annualIncDecRate.toString()) || 0) / 100;
      const corpus = parseFloat(currency.corpusAmount.toString()) || 0;
      const initialUSD = convertToUSD(corpus, currency.ccyName);
      const effectiveRate = ((1 + g) * (1 + d) - 1) * 100;

      for (let year = 0; year <= years; year++) {
        // USD Value = Initial USD Corpus * (1 + growthRate)^year * (1 + annualIncDecRate)^year
        const valueUSD =
          initialUSD * Math.pow(1 + g, year) * Math.pow(1 + d, year);
        data.push(parseFloat(valueUSD.toFixed(2)));

        // Native Value = Native Corpus * (1 + growthRate)^year
        const valueNative = corpus * Math.pow(1 + g, year);
        nativeData.push(parseFloat(valueNative.toFixed(2)));
      }

      const symbol = getCurrencySymbol(currency.ccyName);
      const isUSD = (currency.ccyName || "").toUpperCase().trim() === "USD";
      const spotRate = getCurrentFxRate(currency.ccyName);

      return {
        name: isUSD
          ? `${currency.ccyName} ($)`
          : `${currency.ccyName} (${symbol}) in USD`,
        ccyCode: currency.ccyName,
        symbol: symbol,
        spotRate: spotRate,
        growthRate: g,
        annualIncDecRate: d,
        effectiveRate: effectiveRate,
        data: data,
        nativeData: nativeData,
      };
    });

    return {
      chart: {
        type: "column",
        spacingRight: 35, // Margin on right of the chart to prevent badge clipping
      },
      title: {
        text: "Currency Assets Growth Projection in USD (Side-by-Side)",
      },
      subtitle: {
        text: "Foreign currency assets converted to USD at current FRED spot rate for Year 0 and projected with 5-year FX trends",
        style: {
          color: "#64748b",
        },
      },
      xAxis: {
        categories: categories,
        title: {
          text: "Timeline",
        },
        maxPadding: 0.05, // Extra right-edge padding for final year bars
      },
      yAxis: {
        min: 0,
        maxPadding: 0.18, // Ample headroom for final amount labels
        title: {
          text: "Projected Value (USD $)",
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
        headerFormat:
          '<span style="font-size:1.1em;font-weight:bold;color:#334155;">{point.x}</span><br/><br/>',
        pointFormatter: function (this: Highcharts.Point) {
          const seriesObj = this.series as Highcharts.Series & {
            options: {
              ccyCode?: string;
              symbol?: string;
              spotRate?: number;
              growthRate?: number;
              annualIncDecRate?: number;
              effectiveRate?: number;
              nativeData?: number[];
            };
          };
          const ccy = seriesObj.options.ccyCode || "USD";
          const valUSD = this.y || 0;
          const idx = this.index;
          const nativeVal =
            seriesObj.options.nativeData &&
            seriesObj.options.nativeData[idx] !== undefined
              ? seriesObj.options.nativeData[idx]
              : valUSD;

          const spotRate = seriesObj.options.spotRate || 1;
          const g = (seriesObj.options.growthRate || 0) * 100;
          const d = (seriesObj.options.annualIncDecRate || 0) * 100;
          const effectiveRate = seriesObj.options.effectiveRate || 0;
          const isUSD = ccy.toUpperCase().trim() === "USD";

          if (isUSD) {
            return (
              `<span style="font-weight:bold;color:#1e40af;">${this.series.name}</span><br/>` +
              `• <b>USD Value:</b> <b>$${valUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> (${formatUSDCompact(valUSD)})<br/>` +
              `• <b>Yield / Growth:</b> ${g.toFixed(1)}% p.a.<br/>`
            );
          }

          // Effective projected conversion rate at year t
          const projectedFxRate =
            valUSD > 0 && nativeVal > 0 ? nativeVal / valUSD : spotRate;

          return (
            `<span style="font-weight:bold;color:#1e40af;">${this.series.name}</span><br/>` +
            `• <b>USD Value:</b> <b>$${valUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</b> (${formatUSDCompact(valUSD)})<br/>` +
            `• <b>Native Amount:</b> ${formatCurrencyValue(nativeVal, ccy)}<br/>` +
            `• <b>Effective FX Rate:</b> <b>1 USD = ${projectedFxRate.toFixed(2)} ${ccy}</b> ` +
            (idx === 0
              ? `<i>(Current Spot)</i>`
              : `<i>(Spot: ${spotRate.toFixed(2)} @ ${d >= 0 ? "+" : ""}${d.toFixed(2)}%/yr FX)</i>`) +
            `<br/>` +
            `• <b>Local Growth:</b> ${g.toFixed(1)}% p.a. • <b>Net USD CAGR:</b> ${effectiveRate >= 0 ? "+" : ""}${effectiveRate.toFixed(2)}%<br/>`
          );
        },
      },
      plotOptions: {
        column: {
          groupPadding: 0.08, // Reduces space between year bar sets
          pointPadding: 0.03, // Keeps bars within each year set cohesive
          borderWidth: 0,
          borderRadius: 3,
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: "allow",
            inside: false,
            y: -6,
            formatter: function (this: Highcharts.Point) {
              // Display final amount badge on the last year's bars
              if (this.index === this.series.data.length - 1) {
                const val = this.y || 0;
                return `<span style="font-weight:700;color:#1e293b;background-color:#ffffff;padding:2px 6px;border-radius:4px;border:1px solid #cbd5e1;box-shadow:0 1px 2px rgba(0,0,0,0.1);font-size:11px;white-space:nowrap;">${formatUSDCompact(val, 1)}</span>`;
              }
              return null;
            },
            useHTML: true,
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
