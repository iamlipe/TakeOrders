import React from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { BillStack } from './BillStack';
import { FinancialStack } from './FinancialStack';
import { ProductStack } from './ProductStack';
import { MenuStack } from './MenuStack';

import { BottonTab } from '@routes/BottomTab';

export type LoggedStackParamList = {
  BillStack: undefined;
  FinancialStack: undefined;
  ProductStack: undefined;
  MenuStack: undefined;
};

const TabBar = (props: BottomTabBarProps) => <BottonTab state={props.state} />;

const Logged = createBottomTabNavigator<LoggedStackParamList>();

export const LoggedStack = () => (
  <Logged.Navigator
    tabBar={props => TabBar(props)}
    screenOptions={{
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarStyle: { position: 'absolute' },
    }}
  >
    <Logged.Screen name="BillStack" component={BillStack} />
    <Logged.Screen name="FinancialStack" component={FinancialStack} />
    <Logged.Screen name="ProductStack" component={ProductStack} />
    <Logged.Screen name="MenuStack" component={MenuStack} />
  </Logged.Navigator>
);
