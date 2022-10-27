import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppStack } from './stacks/AppStack';
import { OverviewMonth } from '@presentational/OverviewDetailsScreen/OverviewMonth';
import { OverviewExtract } from '@presentational/OverviewDetailsScreen/OverviewExtract';

export type RoutesParamList = {
  AppStack: undefined;

  OverviewMonth: {
    data: {
      month: string;
      x: string;
      y: number;
    }[];

    type: 'invoicing' | 'spending' | 'profit';
  };

  OverviewExtract: {
    data: {
      month: string;
      x: string;
      y: number;
    };

    type: 'invoicing' | 'spending' | 'profit';
  };
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
        <MainStack.Screen name="OverviewMonth" component={OverviewMonth} />
        <MainStack.Screen name="OverviewExtract" component={OverviewExtract} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};
