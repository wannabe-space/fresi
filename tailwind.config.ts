import type { Config } from 'tailwindcss'
import { shadeColor } from './lib/ui'

const HORIZONTAL = 'clamp(1rem, min(5vw, 6vh), 4rem)'

export const PRIMARY_COLOR = '#16c2ad'
export const SECONDARY_COLOR = '#1675c2'

const config: Config = {
  darkMode: ['class'],
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)'],
      mono: ['var(--font-mono)'],
    },
    extend: {
      colors: {
        primary: {
          light: shadeColor(PRIMARY_COLOR, 10),
          DEFAULT: PRIMARY_COLOR,
          dark: shadeColor(PRIMARY_COLOR, -10),
        },
        secondary: {
          light: shadeColor(SECONDARY_COLOR, 10),
          DEFAULT: SECONDARY_COLOR,
          dark: shadeColor(SECONDARY_COLOR, -10),
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      padding: {
        horizontal: HORIZONTAL,
      },
      margin: {
        horizontal: HORIZONTAL,
      },
      fontSize: {
        h1: [
          'clamp(2.2rem, min(8vw, 8vh), 5rem)',
          { lineHeight: '1', fontWeight: '600' },
        ],
        h2: [
          'clamp(2rem, min(4vw, 7vh), 4rem)',
          { lineHeight: '1.1', fontWeight: '600' },
        ],
        h3: [
          'clamp(1.8rem, min(3vw, 6vh), 2.8rem)',
          { lineHeight: '1.1', fontWeight: '600' },
        ],
        subtitle: [
          'clamp(1.4rem, min(2vw, 4vh), 2.4rem)',
          { lineHeight: '1.1', fontWeight: '400' },
        ],
      },
      screens: {
        'hover-support': {
          raw: '(hover)',
        },
      },
      transitionTimingFunction: {
        cubic: 'cubic-bezier(0, 0.57, 0, 1.21)',
        smooth: 'cubic-bezier(0.38, 0.51, 0.05, 1)',
      },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {},
    },
  },
  // eslint-disable-next-line ts/no-require-imports
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}

export default config
