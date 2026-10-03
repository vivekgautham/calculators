import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Popover,
  IconButton,
  Tooltip,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckIcon from "@mui/icons-material/Check";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useAppTheme } from "../../context/ThemeContext";

interface ThemeSettingsButtonProps {
  buttonSx?: object;
}

export const ThemeSettingsButton: React.FC<ThemeSettingsButtonProps> = ({
  buttonSx,
}) => {
  const {
    preset,
    headerStyle,
    faviconOption,
    setPreset,
    setHeaderStyle,
    setFaviconOption,
    resetTheme,
    presets,
    headerStyles,
    faviconOptions,
  } = useAppTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-theme-popover" : undefined;

  return (
    <>
      <Tooltip title="Color Theme Settings" arrow>
        <Box
          component="button"
          aria-describedby={id}
          onClick={handleClick}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            py: 0.5,
            px: 1.2,
            borderRadius: "7px",
            background: headerStyle.isLight
              ? "rgba(15, 23, 42, 0.05)"
              : "rgba(255, 255, 255, 0.06)",
            border: "1px solid",
            borderColor: headerStyle.isLight
              ? "rgba(15, 23, 42, 0.12)"
              : "rgba(255, 255, 255, 0.12)",
            color: headerStyle.isLight ? "#334155" : "#e2e8f0",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: preset.primary,
              bgcolor: headerStyle.isLight
                ? "rgba(15, 23, 42, 0.09)"
                : "rgba(255, 255, 255, 0.12)",
              color: preset.accent,
              transform: "translateY(-1px)",
              boxShadow: `0 2px 8px ${preset.glow}`,
            },
            ...buttonSx,
          }}
        >
          {/* Active Accent Dot */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: preset.gradient,
              boxShadow: `0 0 6px ${preset.primary}`,
              flexShrink: 0,
            }}
          />
          <PaletteIcon sx={{ fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.3px",
              lineHeight: 1,
            }}
          >
            Theme
          </Typography>
        </Box>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: "85vh",
              overflowY: "auto",
              mt: 1.2,
              bgcolor: "#0f172a",
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "14px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
              p: 2.2,
              backgroundImage: "none",
              "&::-webkit-scrollbar": { width: 5 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 2,
              },
            },
          },
        }}
      >
        {/* Popover Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pb: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "7px",
                background: preset.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 8px ${preset.glow}`,
              }}
            >
              <PaletteIcon sx={{ fontSize: 16, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                Color Theme Settings
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: "11px",
                }}
              >
                Personalize workspace palette & tabs
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Reset to default theme" arrow>
              <IconButton
                size="small"
                onClick={resetTheme}
                sx={{
                  color: "#94a3b8",
                  "&:hover": {
                    color: "#f59e0b",
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <RestartAltIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                color: "#94a3b8",
                "&:hover": {
                  color: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Section 1: Accent Palette */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "#94a3b8",
              display: "block",
              mb: 1.2,
            }}
          >
            Accent Theme
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
            }}
          >
            {presets.map((p) => {
              const isSelected = p.id === preset.id;
              return (
                <Box
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isSelected
                      ? p.primary
                      : "rgba(255, 255, 255, 0.08)",
                    bgcolor: isSelected
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(255, 255, 255, 0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected
                      ? `0 0 10px ${p.glow}`
                      : "none",
                    "&:hover": {
                      borderColor: p.primary,
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: p.gradient,
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "12px",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "#ffffff" : "#cbd5e1",
                      }}
                    >
                      {p.name}
                    </Typography>
                  </Stack>
                  {isSelected && (
                    <CheckIcon
                      sx={{ fontSize: 15, color: p.primary, flexShrink: 0 }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Section 2: Header Appearance */}
        <Box sx={{ mt: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "#94a3b8",
              display: "block",
              mb: 1.2,
            }}
          >
            Header & Shell Mode
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
            }}
          >
            {headerStyles.map((style) => {
              const isSelected = style.id === headerStyle.id;
              return (
                <Box
                  key={style.id}
                  onClick={() => setHeaderStyle(style.id)}
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isSelected
                      ? preset.primary
                      : "rgba(255, 255, 255, 0.08)",
                    bgcolor: isSelected
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(255, 255, 255, 0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected
                      ? `0 0 10px ${preset.glow}`
                      : "none",
                    "&:hover": {
                      borderColor: preset.primary,
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "4px",
                        background: style.background,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "12px",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "#ffffff" : "#cbd5e1",
                      }}
                    >
                      {style.name}
                    </Typography>
                  </Stack>
                  {isSelected && (
                    <CheckIcon
                      sx={{
                        fontSize: 15,
                        color: preset.primary,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Section 3: Title Tab Icon (Favicon) */}
        <Box sx={{ mt: 2.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.2 }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "#94a3b8",
              }}
            >
              Title Tab Icon (Favicon)
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: "10px",
                color: preset.accent,
                fontWeight: 600,
              }}
            >
              Updates browser tab
            </Typography>
          </Stack>

          <Stack spacing={0.8}>
            {faviconOptions.map((opt) => {
              const isSelected = opt.id === faviconOption.id;
              return (
                <Box
                  key={opt.id}
                  onClick={() => setFaviconOption(opt.id)}
                  sx={{
                    p: 1,
                    px: 1.2,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isSelected
                      ? preset.primary
                      : "rgba(255, 255, 255, 0.08)",
                    bgcolor: isSelected
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(255, 255, 255, 0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected
                      ? `0 0 10px ${preset.glow}`
                      : "none",
                    "&:hover": {
                      borderColor: preset.primary,
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      component="img"
                      src={opt.path}
                      alt={opt.name}
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "5px",
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#ffffff" : "#e2e8f0",
                          lineHeight: 1.2,
                        }}
                      >
                        {opt.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          display: "block",
                        }}
                      >
                        {opt.description}
                      </Typography>
                    </Box>
                  </Stack>
                  {isSelected && (
                    <CheckIcon
                      sx={{
                        fontSize: 16,
                        color: preset.primary,
                        flexShrink: 0,
                        ml: 1,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Footer Note */}
        <Box
          sx={{
            mt: 2,
            pt: 1.2,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              fontSize: "10px",
              letterSpacing: "0.2px",
            }}
          >
            Preferences are saved automatically in your browser.
          </Typography>
        </Box>
      </Popover>
    </>
  );
};
