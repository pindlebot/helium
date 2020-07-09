import React from 'react'
import { CssBaseline } from '@material-ui/core'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles'

const variables = {
  primaryColor: '#1563ff',
  secondaryColor: '#7c8797'
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: variables.primaryColor
    },
    secondary: {
      main: variables.secondaryColor
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*:focus': {
          outline: 'none'
        },
        body: {
          '-webkit-font-smoothing': 'antialiased',
          lineHeight: 1.2,
          backgroundColor: 'rgb(247, 250, 252)',
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
          ].join(',')
        },
        '.DraftEditor-root': {
          width: '100%',
          height: '100%'
        }
      }
    }
  }
})

export const ThemeProvider = props => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </MuiThemeProvider>
)