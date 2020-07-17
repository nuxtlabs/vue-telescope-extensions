// Docs: https://tailwindcss.com/docs/configuration
// Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'white',
      primary: {
        50: '#E8FFF9',
        100: '#B7F8E7',
        200: '#88F1D5',
        300: '#5CEAC3',
        400: '#32E3B2',
        500: '#0BDCA0',
        600: '#09C38D',
        700: '#07A97B',
        800: '#058F68',
        900: '#047555'
      },
      grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121'
      }
    },
    extend: {
      fontFamily: {
        display: ['PTRootUI', ...defaultTheme.fontFamily.sans]
      },
      borderRadius: {
        xl: '0.875rem'
      }
    }
  },
  variants: {},
  plugins: []
}
