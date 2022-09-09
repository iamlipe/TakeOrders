module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@presentational': './src/presentational',
          '@config': './src/config',
          '@store': './src/store',
          '@styles': './src/styles',
          '@hooks': './src/hooks',
          '@components': './src/components',
          '@routes': './src/routes',
          '@assets': './src/assets',
          '@i18n': './src/i18n',
          '@database': './src/database',
          '@__mocks__': './__mocks__',
          '@__tests__': './__tests__',
        },
      },
    ],
    ['module:react-native-dotenv'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
