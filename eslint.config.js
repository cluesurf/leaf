// eslint.config.js
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    extends: [
      "prettier",
      "next/core-web-vitals"
    ],
    plugins: {
      '@stylistic/jsx': stylisticJsx,
      "prettier": eslintPluginPrettierRecommended
    },
    rules: {
      'react/jsx-indent': ['error', 2],
      '@stylistic/jsx/jsx-indent': ['error', 2],
      // ...
    }
  }
]
