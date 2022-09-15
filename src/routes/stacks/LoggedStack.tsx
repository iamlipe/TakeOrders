import React from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BillHome } from '@presentational/BillScreen/BillHome';
import { FinancialHome } from '@presentational/FinancialScreen/FinancialHome';
import { StockHome } from '@presentational/StockScreen/StockHome';

import { ButtonTab } from '@routes/BottomTab';

export type LoggedStackParamList = {
  BillHome: undefined;
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
    <Logged.Screen name="BillHome" component={BillHome} />
    <Logged.Screen name="FinancialHome" component={FinancialHome} />
    <Logged.Screen name="StockHome" component={StockHome} />
  </Logged.Navigator>
);
