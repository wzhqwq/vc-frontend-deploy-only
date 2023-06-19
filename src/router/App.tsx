import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './App.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';

const theme = createTheme()
theme.shape.borderRadius = 8
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
