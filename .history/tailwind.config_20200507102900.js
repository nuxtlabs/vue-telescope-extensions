module.exports = {
  theme: {
    fill: theme => ({
      'white': theme('colors.white'),
      'blue-dark': '#243746',
    }),
    extend: {
      screens: {
        light: { raw: "(prefers-color-scheme: light)" },
        dark: { raw: "(prefers-color-scheme: dark)" },
      },
      colors: {
        container: 'rgba(255, 255, 255, 0.21)',
        'green-light': '#41B38A',
        'green-dark': '#158876',
        'black-light': '#414042',
        'black-dark': '#292728',
        'gray': '#6D6E71',
        'blue-dark': '#243746',
        'gray-cool': '#C8D3D9'
      },
      textColor: {
        'no-vue-title-light': '#414042',
        'no-vue-title-dark': '#292728',
        'no-vue-light': '#6D6E71',
        'no-vue-dark': '#4D4D4F',
      }
    },
  },
  variants: {},
  plugins: [],
}
