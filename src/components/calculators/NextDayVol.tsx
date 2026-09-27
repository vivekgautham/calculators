import React from "react";
import { Header } from "semantic-ui-react";
import { Box, Stack, Chip } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../../config";
import { PanelProps } from "../../types";
import { NextDayVolProvider } from "./nextdayvol/NextDayVolContext";
import Inputs from "./nextdayvol/Inputs";
import RangeSummaryCards from "./nextdayvol/RangeSummaryCards";
import NextDayBracketChart from "./nextdayvol/NextDayBracketChart";

const NextDayVol: React.FunctionComponent<PanelProps> = (props) => {
  const calculatorMeta = CALCULATORS_AND_SIMULATORS.find(
    (item: { name: string; value: string }) =>
      item.name === props.name || item.value === "nextdayvol",
  );

  return (
    <NextDayVolProvider>
      <Box
        sx={{
          width: "100%",
          p: 3,
          height: "100vh",
          overflowY: "auto",
          textAlign: "left",
          bgcolor: "#f8fafc",
        }}
      >
        {/* Header Block with Color-coded Tags */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexWrap: "wrap", mb: 1 }}
        >
          <Header as="h2" textAlign="left" style={{ margin: 0 }}>
            {props.name || "Next-Day S&P 500 Volatility Calculator"}
          </Header>
          {calculatorMeta?.tags.map((tag: string) => {
            const styles = getTagStyles(tag);
            return (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: styles.backgroundColor,
                  color: styles.color,
                  borderColor: styles.borderColor,
                }}
              />
            );
          })}
        </Stack>

        <Header
          as="h5"
          textAlign="left"
          style={{ marginTop: 8, color: "#64748b", fontWeight: 400 }}
        >
          {calculatorMeta?.description ||
            "Predict next trading day S&P 500 implied volatility and price range from CBOE VIX, visualized on a clean High/Low expected range bracket."}
        </Header>

        {/* Content Modules */}
        <Stack spacing={3} sx={{ mt: 3, pb: 6 }}>
          <Inputs />
          <RangeSummaryCards />
          <NextDayBracketChart />
        </Stack>
      </Box>
    </NextDayVolProvider>
  );
};

export default NextDayVol;
