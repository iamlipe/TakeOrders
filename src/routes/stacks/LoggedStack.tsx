import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '@presentational/HomeScreen/Home';

export type LoggedStackParamList = {
  Home: undefined;
};

const Logged = createNativeStackNavigator<LoggedStackParamList>();

export const LoggedStack = () => (
  <Logged.Navigator screenOptions={{ headerShown: false }}>
    <Logged.Screen name="Home" component={Home} />
  </Logged.Navigator>
);
