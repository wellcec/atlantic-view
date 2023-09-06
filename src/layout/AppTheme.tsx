import React, { useEffect, useMemo } from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'

import { createTheme } from '~/shared/theme'

const AppTheme = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const theme = useMemo(() => createTheme(), [])

  useEffect(() => {
    const appTheme = (event: any): void => {
      const { resolve } = event.detail
      resolve(theme)
    }

    window.addEventListener('app.theme', appTheme)

    return () => {
      window.removeEventListener('app.theme', appTheme)
    }
  }, [theme])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default AppTheme
