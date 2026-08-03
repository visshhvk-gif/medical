// Geist Font Sizes & Typography
export const fontSizes = {
  // Headings
  h1: "2.5rem",      // 40px
  h2: "2rem",        // 32px
  h3: "1.5rem",      // 24px
  h4: "1.25rem",     // 20px
  h5: "1.125rem",    // 18px
  h6: "1rem",        // 16px

  // Body text
  body: "1rem",      // 16px
  "body-sm": "0.875rem", // 14px
  "body-xs": "0.75rem",  // 12px

  // Display
  display: "3.5rem", // 56px
  "display-sm": "3rem", // 48px

  // Captions
  caption: "0.75rem", // 12px
  "caption-sm": "0.625rem", // 10px
} as const;

// Geist Font Weights
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Line Heights
export const lineHeights = {
  tight: "1.2",
  normal: "1.5",
  relaxed: "1.75",
  loose: "2",
} as const;

// Letter Spacing
export const letterSpacing = {
  tight: "-0.02em",
  normal: "0em",
  wide: "0.02em",
} as const;

// Typography presets
export const typography = {
  h1: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  "body-sm": {
    fontSize: fontSizes["body-sm"],
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
} as const;

export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type TypographyPreset = keyof typeof typography;
