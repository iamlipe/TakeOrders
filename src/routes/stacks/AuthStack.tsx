import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login } from '@presentational/LoginScreen/Login';

export type AuthStackParamList = {
  Login: undefined;
};

const Auth = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => (
  <Auth.Navigator screenOptions={{ headerShown: false }}>
    <Auth.Screen name="Login" component={Login} />
  </Auth.Navigator>
);
