import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navigation from '../components/Navigation';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#65c0ea',
      main: '#3f98d2',
      dark: '#295687',
    },
    secondary: {
      light: '#ecab58',
      main: '#d27a3f',
      dark: '#c4673b',
    },
    attr: {
      light: '#99e4db',
      main: '#3fd2c4',
      dark: '#009d84',
    },
    idx: {
      light: '#a47be1',
      main: '#7a3fd2',
      dark: '#6231c3',
    },
    rel: {
      light: '#de8ec3',
      main: '#d23f97',
      dark: '#c0177d',
    },
  },
  typography: {
    fontFamily: 'monospace',
  },
});

const BaseView = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default BaseView;