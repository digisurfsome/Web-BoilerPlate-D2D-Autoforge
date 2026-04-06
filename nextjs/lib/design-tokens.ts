/**
 * Design system tokens exported as TypeScript constants.
 *
 * These mirror the CSS custom properties defined in styles/main.css and
 * Tailwind's default scale. Import these when you need programmatic access
 * to the design system (e.g. in JS-driven animations, canvas rendering,
 * or dynamic style calculations) instead of hardcoding values.
 */

/** Spacing scale matching Tailwind defaults (in rem) */
export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem'    // 48px
} as const;

/** Typography scale with font sizes and line heights */
export const TYPOGRAPHY = {
  h1: { fontSize: '2.25rem', lineHeight: '2.5rem' },    // text-4xl
  h2: { fontSize: '1.875rem', lineHeight: '2.25rem' },  // text-3xl
  h3: { fontSize: '1.5rem', lineHeight: '2rem' },       // text-2xl
  h4: { fontSize: '1.25rem', lineHeight: '1.75rem' },   // text-xl
  h5: { fontSize: '1.125rem', lineHeight: '1.75rem' },  // text-lg
  h6: { fontSize: '1rem', lineHeight: '1.5rem' },       // text-base
  body: { fontSize: '1rem', lineHeight: '1.5rem' },     // text-base
  caption: { fontSize: '0.875rem', lineHeight: '1.25rem' } // text-sm
} as const;

/** Responsive breakpoints matching Tailwind defaults (in pixels) */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

/** Animation defaults derived from styles/main.css keyframes */
export const ANIMATION = {
  duration: {
    fast: '0.2s',    // accordion transitions
    default: '0.3s', // general UI transitions
    slow: '0.6s',    // appear / appear-zoom entrances
    glacial: '4s'    // gradient-pulse ambient effect
  },
  easing: {
    default: 'ease-out',
    inOut: 'ease-in-out',
    linear: 'linear'
  }
} as const;

/**
 * Border radius tokens matching styles/main.css.
 * The base --radius is 0.625rem (10px); sm/md/lg/xl/2xl are derived from it.
 */
export const RADIUS = {
  sm: '0.375rem',   // calc(0.625rem - 4px) = 6px
  md: '0.5rem',     // calc(0.625rem - 2px) = 8px
  lg: '0.625rem',   // base radius = 10px
  xl: '0.875rem',   // calc(0.625rem + 4px) = 14px
  '2xl': '1.125rem' // calc(0.625rem + 8px) = 18px
} as const;
