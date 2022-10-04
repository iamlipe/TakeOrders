import React from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { BillStack } from './BillStack';
import { FinancialStack } from './FinancialStack';
import { StockStack } from './StockStack';

import { BottonTab } from '@routes/BottomTab';

export type LoggedStackParamList = {
  BillStack: undefined;
  FinancialStack: undefined;
  StockStack: undefined;
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
    <Logged.Screen name="StockStack" component={StockStack} />
  </Logged.Navigator>
);
