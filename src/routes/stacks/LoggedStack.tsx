import React from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { BillStack } from './BillStack';
import { FinancialHome } from '@presentational/FinancialScreen/FinancialHome';
import { StockHome } from '@presentational/StockScreen/StockHome';

import { ButtonTab } from '@routes/BottomTab';

export type LoggedStackParamList = {
  BillStack: undefined;
  FinancialHome: undefined;
  StockHome: undefined;
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
    <Logged.Screen name="StockHome" component={StockHome} />
  </Logged.Navigator>
);
