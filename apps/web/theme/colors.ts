// Tailwind CSS Colors - Shadcn/ui Theme
export const colors = {
  // Primary colors
  primary: "hsl(var(--primary))",
  "primary-foreground": "hsl(var(--primary-foreground))",

  // Secondary colors
  secondary: "hsl(var(--secondary))",
  "secondary-foreground": "hsl(var(--secondary-foreground))",

  // Accent colors
  accent: "hsl(var(--accent))",
  "accent-foreground": "hsl(var(--accent-foreground))",

  // Destructive colors
  destructive: "hsl(var(--destructive))",
  "destructive-foreground": "hsl(var(--destructive-foreground))",

  // Muted colors
  muted: "hsl(var(--muted))",
  "muted-foreground": "hsl(var(--muted-foreground))",

  // Background colors
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",

  // Card colors
  card: "hsl(var(--card))",
  "card-foreground": "hsl(var(--card-foreground))",

  // Popover colors
  popover: "hsl(var(--popover))",
  "popover-foreground": "hsl(var(--popover-foreground))",

  // Border & input
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
} as const;

// Export type for TypeScript
export type Colors = typeof colors;

// Utility function to get color value
export const getColor = (colorName: keyof typeof colors): string => {
  return colors[colorName];
};
