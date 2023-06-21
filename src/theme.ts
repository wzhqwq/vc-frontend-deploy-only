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
          50: '#edf1f6',
          100: '#dae3ed',
          200: '#b5c7db',
          300: '#90abc9',
          400: '#6b8fb7',
          500: '#4673a5',
          600: '#385c84',
          700: '#2a4563',
          800: '#1c2e42',
          900: '#0e1721',
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
          main: joyTheme.colorSchemes.light.palette.primary.mainChannel,
        },
        secondary: {
          main: joyTheme.colorSchemes.light.palette.neutral.mainChannel,
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
