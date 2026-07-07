import { createTheme } from '@mantine/core';

export const BRAND_COLOR = '#1971c2';
export const BACKGROUND_COLOR = '#1a1b1e';

// index.html's <meta name="theme-color"> and public/manifest.json's
// theme_color/background_color are static files parsed before any JS runs,
// so they can't import these constants. Keep them in sync by hand.
export const theme = createTheme({});
