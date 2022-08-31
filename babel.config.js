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
          '@assets': './src/assets',
          '@__mocks__': './__mocks__',
          '@__tests__': './__tests__',
        },
      },
    ],
    ['module:react-native-dotenv'],
  ],
};
