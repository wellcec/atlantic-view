import colors from './colors'

const font = ['Poppins', 'sans-serif'].join(',')

const textStyle = {
  fontFamily: font,
  fontWeight: 600,
  color: colors.primary.main
}

const typographyConfig = {
  fontFamily: ['Poppins', 'sans-serif'].join(','),
  h1: textStyle,
  h2: textStyle,
  h3: textStyle,
  h4: textStyle,
  h5: textStyle,
  h6: textStyle,
  subtitle1: {
    fontSize: 20,
    fontWeight: 600,
    fontFamily: font
  },
  subtitle2: {
    fontSize: 17,
    fontWeight: 300,
    fontFamily: font
  },
  body1: {
    fontSize: 14
  },
  body2: {
    fontSize: 13
    // fontSize: window.innerWidth < 1600 ? '.75rem' : '.85rem',
  }
}

export default typographyConfig
