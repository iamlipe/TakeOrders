import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppStack } from './stacks/AppStack';

export type RoutesParamList = {
  AppStack: undefined;
};

const MainStack = createNativeStackNavigator<RoutesParamList>();

export const Routes = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <MainStack.Screen name="AppStack" component={AppStack} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};
