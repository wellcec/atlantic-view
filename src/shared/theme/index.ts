import { createTheme as createMuiTheme, responsiveFontSizes } from '@mui/material/styles'
import { merge } from 'lodash'

import { DEFAULT_THEME } from '../../constants'
import MuiBaseConfig from './MuiBaseConfig'
import colors from './colors'

export const createTheme = (color = DEFAULT_THEME) => {
  const configs = {
    name: color.id,
    palette: colors,
  }

  const options = merge({}, MuiBaseConfig, configs)
  const theme = createMuiTheme(options, [{ size: 10 }])
  return responsiveFontSizes(theme)
}

export default createTheme
