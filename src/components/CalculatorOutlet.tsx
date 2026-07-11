import React, { useState, useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { Stack, Box, Typography, Autocomplete, TextField } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../config";
import { PanelProps } from "../types";

function CalculatorOutlet() {
  const [value, setValue] = useState<string | undefined>(() => {
    const hash = window.location.hash.replace("#", "");
    return CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)
      ? hash
      : "basicfinancialplanner";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)) {
        setValue(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (value) {
      window.location.hash = value;
    }
  }, [value]);

  const currentOption = CALCULATORS_AND_SIMULATORS.find((item) => item.value === value) || CALCULATORS_AND_SIMULATORS[0];
  const currentPanel = currentOption.panel;
  const name = currentOption.name;

  return (
    <Stack sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Top Header Bar */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          height: "56px",
          px: 3,
          backgroundColor: "#1b1c1d", // Dark background theme
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          flexShrink: 0,
        }}
      >
        {/* Logo / Title */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ cursor: "pointer" }}
          onClick={() => setValue("basicfinancialplanner")}
        >
          <Icon name="calculator" size="large" style={{ color: "#00b5ad", margin: 0 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "0.5px" }}>
            Advanced Calculators & Simulators
          </Typography>
        </Stack>
      </Stack>

      {/* Dedicated Search Bar Row Below Title */}
      <Box
        sx={{
          py: 1.5,
          px: 3,
          backgroundColor: "#f8f9fa", // Clean off-white sub-bar
          borderBottom: "1px solid #e9ecef",
          flexShrink: 0,
        }}
      >
        <Autocomplete
          fullWidth
          options={CALCULATORS_AND_SIMULATORS}
          getOptionLabel={(option) => option.name}
          value={null}
          onChange={(_, newValue) => {
            if (newValue) {
              setValue(newValue.value);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Search or select calculator..."
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ced4da" },
                  "&:hover fieldset": { borderColor: "#00b5ad" },
                  "&.Mui-focused fieldset": { borderColor: "#00b5ad" },
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...restProps } = props as any;
            return (
              <Box
                component="li"
                key={option.value}
                {...restProps}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  p: 1.5,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#1a2035" }}>
                  {option.name}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: "wrap", gap: "2px" }}>
                  {option.tags.map((tag) => {
                    const style = getTagStyles(tag);
                    return (
                      <span
                        key={tag}
                        style={{
                          fontSize: "8px",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          backgroundColor: style.backgroundColor,
                          color: style.color,
                          border: `1px solid ${style.borderColor}`,
                          letterSpacing: "0.5px",
                          lineHeight: "1",
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </Stack>
              </Box>
            );
          }}
          sx={{ width: "100%" }}
        />
      </Box>

      {/* Main Content View */}
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 56px - 72px)", // Calculate height offset dynamically
          overflow: "hidden",
          width: "100vw",
        }}
      >
        {currentPanel &&
          React.createElement(currentPanel, { name: name } as PanelProps)}
      </Box>
    </Stack>
  );
}

export default CalculatorOutlet;
