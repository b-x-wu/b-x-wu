module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:react/jsx-runtime',
    'plugin:tailwindcss/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: [
    'react'
  ],
  ignorePatterns: [
    '.eslintrc.js',
    '*.config.js',
    'next-env.d.ts'
  ],
  rules: {
    "react/jsx-curly-brace-presence": [2, "never"]
  }
}
