import React from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { BillStack } from './BillStack';
import { FinancialHome } from '@presentational/FinancialScreen/FinancialHome';
import { StockStack } from './StockStack';

import { ButtonTab } from '@routes/BottomTab';

export type LoggedStackParamList = {
  BillStack: undefined;
  FinancialHome: undefined;
  StockStack: undefined;
};

const TabBar = (props: BottomTabBarProps) => <ButtonTab state={props.state} />;

const Logged = createBottomTabNavigator<LoggedStackParamList>();

export const LoggedStack = () => (
  <Logged.Navigator
    tabBar={props => TabBar(props)}
    screenOptions={{ headerShown: false }}
  >
    <Logged.Screen name="BillStack" component={BillStack} />
    <Logged.Screen name="FinancialHome" component={FinancialHome} />
    <Logged.Screen name="StockStack" component={StockStack} />
  </Logged.Navigator>
);
