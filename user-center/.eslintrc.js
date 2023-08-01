// eslint-disable-next-line import/no-commonjs
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'taro/react',
    'plugin:react/recommended',
    'standard'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    semi: ['error', 'always'],
    'semi-spacing': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error']
  }
};
