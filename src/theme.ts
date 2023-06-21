import { extendTheme } from '@mui/joy'
import { experimental_extendTheme as materialExtendTheme } from '@mui/material/styles'

export const joyTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#e8f6f4',
          100: '#d0ecea',
          200: '#a2d9d4',
          300: '#73c6bf',
          400: '#45b3a9',
          500: '#16a094',
          600: '#128076',
          700: '#0d6059',
          800: '#09403b',
          900: '#04201e',
        },
        neutral: {
          50: '#ecf0f4',
          100: '#d9e1e9',
          200: '#b3c2d3',
          300: '#8da4be',
          400: '#6785a8',
          500: '#416792',
          600: '#345275',
          700: '#273e58',
          800: '#1a293a',
          900: '#0d151d',
        },
      },
    },
  },
  components: {
    JoySheet: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.radius.md,
        }),
      },
    },
  },
})

export const muiTheme = materialExtendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#416792',
        },
        secondary: {
          main: '#16a094',
        },
        info: {
          main: '#0097a7',
        },
      },
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: joyTheme.radius.sm,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: joyTheme.radius.md,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: joyTheme.colorSchemes.light.palette.neutral[50],
          boxShadow: 'none',
          borderBottom: `1px solid ${joyTheme.colorSchemes.light.palette.neutral[100]}`,
        },
      },
    },
  },
})
