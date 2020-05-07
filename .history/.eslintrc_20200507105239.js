module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    'vue',
  ],
  rules: {
    "at-rule-no-unknown": [null, {
      ignoreAtRules: [
        /apply/, 
        /tailwind/,
        /screen/,
        /if/,
        /else/,
        /return/,
        /function/,
	      /debug/
      ]
    }],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null
  },
};
