import React, { useState, useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { Stack, Box, Typography, Autocomplete, TextField } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../config";

function CalculatorOutlet() {
  const [activeCalculator, setActiveCalculator] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const active = params.get("active");
    if (active && CALCULATORS_AND_SIMULATORS.some((c) => c.value === active)) {
      return active;
    }
    const hash = window.location.hash.replace("#", "");
    if (CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)) {
      return hash;
    }
    return "basicfinancialplanner";
  });

  const [openCalculators, setOpenCalculators] = useState<string[]>(() => {
    const params = new URLSearchParams(window.location.search);
    const openParam = params.get("open");
    if (openParam) {
      const split = openParam.split(",").filter((val) =>
        CALCULATORS_AND_SIMULATORS.some((c) => c.value === val)
      );
      if (split.length > 0) {
        return split;
      }
    }
    const hash = window.location.hash.replace("#", "");
    const initial = CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)
      ? hash
      : "basicfinancialplanner";
    return [initial];
  });

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const active = params.get("active");
      const openParam = params.get("open");

      let newActive = activeCalculator;
      let newOpen = openCalculators;
      let changed = false;

      if (active && CALCULATORS_AND_SIMULATORS.some((c) => c.value === active) && active !== activeCalculator) {
        newActive = active;
        changed = true;
      } else {
        const hash = window.location.hash.replace("#", "");
        if (CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash) && hash !== activeCalculator) {
          newActive = hash;
          changed = true;
        }
      }

      if (openParam) {
        const split = openParam.split(",").filter((val) =>
          CALCULATORS_AND_SIMULATORS.some((c) => c.value === val)
        );
        if (split.length > 0 && JSON.stringify(split) !== JSON.stringify(openCalculators)) {
          newOpen = split;
          changed = true;
        }
      }

      if (changed) {
        setActiveCalculator(newActive);
        setOpenCalculators(newOpen);
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [activeCalculator, openCalculators]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("open", openCalculators.join(","));
    params.set("active", activeCalculator);
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}?${newSearch}${window.location.hash}`;
    window.history.replaceState({}, "", newUrl);
  }, [openCalculators, activeCalculator]);

  const handleCloseTab = (valToClose: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selecting the tab when clicking close
    if (openCalculators.length <= 1) return; // Keep at least one tab open

    const newOpen = openCalculators.filter((c) => c !== valToClose);
    setOpenCalculators(newOpen);

    if (activeCalculator === valToClose) {
      // Switch active tab to the last remaining tab
      setActiveCalculator(newOpen[newOpen.length - 1]);
    }
  };

  return (
    <Stack sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Top Header Bar */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          height: "56px",
          px: 3,
          backgroundColor: "#1b1c1d", // Match theme
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
          onClick={() => {
            setActiveCalculator("basicfinancialplanner");
            setOpenCalculators((prev) => {
              if (!prev.includes("basicfinancialplanner")) {
                return [...prev, "basicfinancialplanner"];
              }
              return prev;
            });
            setInputValue("");
          }}
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
          value={null} // Keep it empty by default so it acts as an open/add field launcher
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(_, newValue) => {
            if (newValue) {
              setOpenCalculators((prev) => {
                if (!prev.includes(newValue.value)) {
                  return [...prev, newValue.value];
                }
                return prev;
              });
              setActiveCalculator(newValue.value);
              setInputValue("");
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Search and open a calculator..."
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

      {/* Dynamic Browser-like Tab Bar */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          px: 3,
          pt: 0.8,
          backgroundColor: "#eceff1", // Light warm grey tab bar background
          borderBottom: "1px solid #cfd8dc",
          flexShrink: 0,
          overflowX: "auto",
          whiteSpace: "nowrap",
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#b0bec5", borderRadius: 2 },
        }}
      >
        {openCalculators.map((val) => {
          const calc = CALCULATORS_AND_SIMULATORS.find((c) => c.value === val);
          if (!calc) return null;
          const isActive = val === activeCalculator;

          return (
            <Stack
              key={val}
              direction="row"
              alignItems="center"
              spacing={1}
              onClick={() => setActiveCalculator(val)}
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: "6px 6px 0 0",
                backgroundColor: isActive ? "white" : "rgba(255, 255, 255, 0.45)",
                border: "1px solid",
                borderColor: isActive ? "#cfd8dc" : "transparent",
                borderBottomColor: isActive ? "white" : "#cfd8dc",
                cursor: "pointer",
                userSelect: "none",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#00b5ad" : "text.secondary",
                transition: "all 0.15s ease",
                mr: 0.5,
                boxShadow: isActive ? "0px -2px 4px rgba(0,0,0,0.03)" : "none",
                "&:hover": {
                  backgroundColor: isActive ? "white" : "rgba(255, 255, 255, 0.75)",
                  color: isActive ? "#00b5ad" : "text.primary",
                },
              }}
            >
              <Icon
                name="calculator"
                style={{
                  color: isActive ? "#00b5ad" : "rgba(0,0,0,0.4)",
                  margin: 0,
                  fontSize: "12px",
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: "inherit", fontSize: "13px" }}>
                {calc.name}
              </Typography>
              {openCalculators.length > 1 && (
                <Icon
                  name="close"
                  onClick={(e: React.MouseEvent) => handleCloseTab(val, e)}
                  style={{
                    marginLeft: 8,
                    fontSize: "10px",
                    color: "rgba(0,0,0,0.3)",
                    transition: "color 0.1s ease",
                  }}
                  onMouseEnter={(e: any) => (e.target.style.color = "#d32f2f")}
                  onMouseLeave={(e: any) => (e.target.style.color = "rgba(0,0,0,0.3)")}
                />
              )}
            </Stack>
          );
        })}
      </Stack>

      {/* Main Content View Container (Preserves states using display: none) */}
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 56px - 72px - 44px)", // Offsets for title bar, search bar, and tab bar
          overflow: "hidden",
          width: "100vw",
          position: "relative",
        }}
      >
        {CALCULATORS_AND_SIMULATORS.map((item) => {
          const isOpen = openCalculators.includes(item.value);
          if (!isOpen) return null;

          const isActive = item.value === activeCalculator;
          const PanelComponent = item.panel;

          return (
            <Box
              key={item.value}
              sx={{
                display: isActive ? "block" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <PanelComponent name={item.name} />
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}

export default CalculatorOutlet;
