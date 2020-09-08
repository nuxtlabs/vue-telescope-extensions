// Docs: https://tailwindcss.com/docs/configuration
// Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true
  },
  theme: {
    fontSize: {
      base: '16px',
      one: '68px',
      two: '54px',
      three: '42px',
      four: '32px',
      five: '28px',
      six: '24px',
      seven: '20px',
      eight: '18px',
      sm: '14px',
      xs: '12px'
    },
    letterSpacing: {
      '-20': 'calc(20 * -0.0125rem)',
      '-15': 'calc(15 * -0.0125rem)',
      '-10': 'calc(10 * -0.0125rem)',
      '-5': 'calc(5 * -0.0125rem)',
      '-4': 'calc(4 * -0.0125rem)',
      '-3': 'calc(3 * -0.0125rem)',
      '-2': 'calc(2 * -0.0125rem)',
      '-1': '-0.0125rem',
      1: '0.0125rem',
      2: 'calc(2 * 0.0125rem)',
      3: 'calc(3 * 0.0125rem)',
      4: 'calc(4 * 0.0125rem)',
      5: 'calc(5 * 0.0125rem)',
      10: 'calc(10 * 0.0125rem)',
      15: 'calc(15 * 0.0125rem)',
      20: 'calc(20 * 0.0125rem)'
    },
    lineHeight: {
      base: '24px',
      one: '72px',
      two: '56px',
      three: '48px',
      four: '36px',
      five: '32px',
      six: '32px',
      seven: '28px',
      eight: '24px',
      sm: '20px',
      xs: '16px'
    },
    fontWeight: {
      'body-weight': 400,
      'bold-body-weight': 700,
      'display-weight': 700,
      'mono-weight': 400
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'white',
      orange: '#ed8936',
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
        display: ['PTRootUI', ...defaultTheme.fontFamily.sans],
        body: ['PTRootUI', ...defaultTheme.fontFamily.sans]
      },
      borderRadius: {
        '2lg': '0.625rem',
        '3lg': '0.75rem',
        xl: '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem'
      }
    }
  },
  variants: {},
  plugins: []
}
