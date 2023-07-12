import { router } from './router/router'
import { RouterProvider } from 'react-router-dom'
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/api/queryClient'
import { CssVarsProvider } from '@mui/joy'
import { joyTheme, muiTheme } from './theme'
import { SnackbarProvider } from 'notistack'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={joyTheme} defaultMode="light">
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: muiTheme }}>
          <SnackbarProvider maxSnack={3}>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </MaterialCssVarsProvider>
      </CssVarsProvider>
    </QueryClientProvider>
  )
}

export default App
