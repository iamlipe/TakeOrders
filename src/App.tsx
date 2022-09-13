import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import { theme } from '@styles/index';
import { store } from '@store/index';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Routes } from '@routes/index';
import i18n from '@i18n/index';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <StatusBar
              barStyle="dark-content"
              animated={false}
              backgroundColor="#F2CB05"
            />
            <Routes />
          </I18nextProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
