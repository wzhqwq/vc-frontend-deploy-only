import { router } from './router/router'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/api/queryClient'

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
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
  shape: {
    borderRadius: 12,
  },
}
const theme = createTheme(themeOptions)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
