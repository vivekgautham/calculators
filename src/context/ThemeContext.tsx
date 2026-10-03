import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  tabGradient: string;
  glow: string;
}

export interface HeaderStyle {
  id: string;
  name: string;
  background: string;
  border: string;
  text: string;
  subtitle: string;
  meta: string;
  chipBg: string;
  chipBorder: string;
  isLight?: boolean;
}

export interface FaviconOption {
  id: string;
  name: string;
  path: string;
  description: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "ocean",
    name: "Ocean Tech",
    primary: "#00b5ad",
    secondary: "#2563eb",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg, #00b5ad 0%, #2563eb 100%)",
    tabGradient: "linear-gradient(90deg, #00b5ad 0%, #2563eb 100%)",
    glow: "rgba(0, 181, 173, 0.45)",
  },
  {
    id: "emerald",
    name: "Emerald Bull",
    primary: "#10b981",
    secondary: "#0d9488",
    accent: "#34d399",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    tabGradient: "linear-gradient(90deg, #10b981 0%, #0d9488 100%)",
    glow: "rgba(16, 185, 129, 0.45)",
  },
  {
    id: "indigo",
    name: "Royal Indigo",
    primary: "#8b5cf6",
    secondary: "#6366f1",
    accent: "#a78bfa",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    tabGradient: "linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)",
    glow: "rgba(139, 92, 246, 0.45)",
  },
  {
    id: "amber",
    name: "Golden Sunset",
    primary: "#f59e0b",
    secondary: "#ea580c",
    accent: "#fbbf24",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    tabGradient: "linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
  },
  {
    id: "crimson",
    name: "Crimson Alpha",
    primary: "#ef4444",
    secondary: "#e11d48",
    accent: "#f87171",
    gradient: "linear-gradient(135deg, #ef4444 0%, #e11d48 100%)",
    tabGradient: "linear-gradient(90deg, #ef4444 0%, #e11d48 100%)",
    glow: "rgba(239, 68, 68, 0.45)",
  },
  {
    id: "cyber",
    name: "Cyber Neon",
    primary: "#06b6d4",
    secondary: "#d946ef",
    accent: "#22d3ee",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #d946ef 100%)",
    tabGradient: "linear-gradient(90deg, #06b6d4 0%, #d946ef 100%)",
    glow: "rgba(6, 182, 212, 0.45)",
  },
];

export const HEADER_STYLES: HeaderStyle[] = [
  {
    id: "dark-slate",
    name: "Dark Slate",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#ffffff",
    subtitle: "#94a3b8",
    meta: "#64748b",
    chipBg: "rgba(255, 255, 255, 0.06)",
    chipBorder: "rgba(255, 255, 255, 0.1)",
    isLight: false,
  },
  {
    id: "midnight",
    name: "Midnight OLED",
    background: "linear-gradient(135deg, #030712 0%, #0b0f19 100%)",
    border: "rgba(255, 255, 255, 0.06)",
    text: "#ffffff",
    subtitle: "#64748b",
    meta: "#475569",
    chipBg: "rgba(255, 255, 255, 0.04)",
    chipBorder: "rgba(255, 255, 255, 0.08)",
    isLight: false,
  },
  {
    id: "deep-navy",
    name: "Deep Navy",
    background: "linear-gradient(135deg, #0c1a30 0%, #172554 100%)",
    border: "rgba(59, 130, 246, 0.2)",
    text: "#ffffff",
    subtitle: "#93c5fd",
    meta: "#60a5fa",
    chipBg: "rgba(59, 130, 246, 0.12)",
    chipBorder: "rgba(59, 130, 246, 0.25)",
    isLight: false,
  },
  {
    id: "studio-light",
    name: "Studio Light",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    border: "#cbd5e1",
    text: "#0f172a",
    subtitle: "#475569",
    meta: "#64748b",
    chipBg: "rgba(15, 23, 42, 0.06)",
    chipBorder: "rgba(15, 23, 42, 0.12)",
    isLight: true,
  },
];

export const FAVICON_OPTIONS: FaviconOption[] = [
  {
    id: "electric-calculator",
    name: "Electric Calculator",
    path: "/icons/favicon-electric-calculator.svg",
    description: "Cyan & Blue gradient calculator",
  },
  {
    id: "math-matrix",
    name: "Math Matrix",
    path: "/icons/favicon-math-matrix.svg",
    description: "4-Quadrant +, −, ×, = symbol grid",
  },
  {
    id: "analytics-chart",
    name: "Analytics Chart",
    path: "/icons/favicon-analytics-chart.svg",
    description: "Emerald rising trend & volume bars",
  },
  {
    id: "golden-calculator",
    name: "Golden Calculator",
    path: "/icons/favicon-golden-calculator.svg",
    description: "Warm amber & gold luminous calculator",
  },
];

const STORAGE_KEY = "calculators_theme_settings_v1";

export interface ThemeContextType {
  preset: ColorPreset;
  headerStyle: HeaderStyle;
  faviconOption: FaviconOption;
  setPreset: (presetId: string) => void;
  setHeaderStyle: (styleId: string) => void;
  setFaviconOption: (faviconId: string) => void;
  resetTheme: () => void;
  presets: ColorPreset[];
  headerStyles: HeaderStyle[];
  faviconOptions: FaviconOption[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const updateFaviconInDOM = (href: string) => {
  if (typeof document === "undefined") return;
  let link = document.querySelector(
    "link[rel~='icon']",
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = href;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [presetId, setPresetId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (COLOR_PRESETS.some((p) => p.id === parsed.presetId)) {
          return parsed.presetId;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return "ocean";
  });

  const [headerStyleId, setHeaderStyleId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (HEADER_STYLES.some((s) => s.id === parsed.headerStyleId)) {
          return parsed.headerStyleId;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return "dark-slate";
  });

  const [faviconId, setFaviconId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (FAVICON_OPTIONS.some((f) => f.id === parsed.faviconId)) {
          return parsed.faviconId;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return "electric-calculator";
  });

  const preset = useMemo(() => {
    return COLOR_PRESETS.find((p) => p.id === presetId) || COLOR_PRESETS[0];
  }, [presetId]);

  const headerStyle = useMemo(() => {
    return (
      HEADER_STYLES.find((s) => s.id === headerStyleId) || HEADER_STYLES[0]
    );
  }, [headerStyleId]);

  const faviconOption = useMemo(() => {
    return (
      FAVICON_OPTIONS.find((f) => f.id === faviconId) || FAVICON_OPTIONS[0]
    );
  }, [faviconId]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          presetId,
          headerStyleId,
          faviconId,
        }),
      );
    } catch {
      // Ignore storage write errors
    }
  }, [presetId, headerStyleId, faviconId]);

  // Update browser favicon dynamically
  useEffect(() => {
    updateFaviconInDOM(faviconOption.path);
  }, [faviconOption]);

  const setPreset = useCallback((newId: string) => {
    if (COLOR_PRESETS.some((p) => p.id === newId)) {
      setPresetId(newId);
    }
  }, []);

  const setHeaderStyle = useCallback((newId: string) => {
    if (HEADER_STYLES.some((s) => s.id === newId)) {
      setHeaderStyleId(newId);
    }
  }, []);

  const setFaviconOption = useCallback((newId: string) => {
    if (FAVICON_OPTIONS.some((f) => f.id === newId)) {
      setFaviconId(newId);
    }
  }, []);

  const resetTheme = useCallback(() => {
    setPresetId("ocean");
    setHeaderStyleId("dark-slate");
    setFaviconId("electric-calculator");
  }, []);

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      preset,
      headerStyle,
      faviconOption,
      setPreset,
      setHeaderStyle,
      setFaviconOption,
      resetTheme,
      presets: COLOR_PRESETS,
      headerStyles: HEADER_STYLES,
      faviconOptions: FAVICON_OPTIONS,
    }),
    [
      preset,
      headerStyle,
      faviconOption,
      setPreset,
      setHeaderStyle,
      setFaviconOption,
      resetTheme,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};
