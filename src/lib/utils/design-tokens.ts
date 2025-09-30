/** keys for spacing match those from Radix */
export const spacing = {
  0: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
} as const;

// Color palette
export const colors = {
  black: "#000000",
  white: "#ffffff",
  background: {
    primary: "#ffffff",
  },

  text: {
    primary: "#0f172a",
    secondary: "#475569",
    tertiary: "#64748b",
    inverse: "#ffffff",
  },

  border: {
    light: "#E4E4E7",
  },

  chart: {
    blue: "#0072db",
    green: "#34D399",
    red: "#f97171",
  },

  overlay: {
    hover: "rgba(128, 128, 128, 0.5)",
  },
} as const;

export const radius = {
  button: 8,
  card: 8,
  barChart: 5,
  tooltip: 4,
} as const;

export const chart = {
  barPadding: 0.25,
} as const;

// Type helpers for better TypeScript support
export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
