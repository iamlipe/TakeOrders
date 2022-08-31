module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'react',
    'prettier',
    'react-hooks',
    '@typescript-eslint',
    'react-native',
  ],
  globals: {
    __DEV__: true,
    fetch: false,
  },
  env: {
    jest: true,
    es2020: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },

    react: {
      version: 'detect',
    },
  },
  rules: {
    'jsx-quotes': 'off',
    'comma-dangle': 'off',

    'react/jsx-filename-extension': [
      1,
      {extensions: ['.js', '.jsx', '.tsx', '.ts']},
    ],
    'import/prefer-default-export': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
    'react/state-in-constructor': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 0,
    strict: 0,
    'import/no-named-as-default': 0,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
    },
  ],
};
