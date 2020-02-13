module.exports = {
  extends: 'react-app',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  settings: {
    react: {
      version: '16.8'
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {}
    }
  },
}
