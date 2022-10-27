import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import { theme } from '@styles/index';
import { store } from '@store/index';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, LogBox } from 'react-native';
import { Routes } from '@routes/index';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import i18n from '@i18n/index';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <StatusBar
                  barStyle="dark-content"
                  animated={false}
                  backgroundColor="#F2CB05"
                />
                <Routes />
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
