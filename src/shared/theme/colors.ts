import { DEFAULT_THEME } from '../../constants'

interface Pallete {
  mode: string,
  primary: {
    main: string
  },
  secondary: {
    main: string
    contrastText: string
    button: string
  },
  background: {
    main: string
    container: string
  },
  info: {
    light: string
    main: string
    secondary: string
    dark: string
  },
  text: {
    main: string
    light: string
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
    quintenary: string
  },
  danger: {
    main: string
  },
  error: {
    main: string
  },
  active: {
    main: string
  },
  success: {
    main: string
  }
}

const colors: Pallete = {
  mode: 'light',
  primary: {
    main: DEFAULT_THEME.primary,
  },
  secondary: {
    main: '#EFEFEF',
    contrastText: '#8B7676',
    button: '#1657d3',
  },
  background: {
    main: '#fff',
    container: '#f0f0f9',
  },
  info: {
    light: '#ECF8FF',
    main: '#A2EAF3',
    secondary: '#6EDFEE',
    dark: '#1BD4ED',
  },
  text: {
    main: '#0B2049',
    light: '#E5E5E5',
    primary: '#0E347D',
    secondary: '#B1B3C9',
    tertiary: '#808080d9',
    quaternary: '#3F4159',
    quintenary: '#4368AD',
  },
  danger: {
    main: '#FFC654',
  },
  error: {
    main: '#C3284C',
  },
  active: {
    main: '#19BDDD',
  },
  success: {
    main: '#34C575',
  },
}

export default colors
