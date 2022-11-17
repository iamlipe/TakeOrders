import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginOrRegister } from '@presentational/LoginScreen/LoginOrRegister';
import { Login } from '@presentational/LoginScreen/Login';

export type AuthStackParamList = {
  LoginOrRegister: undefined;
  Login: undefined;
};

const Auth = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="LoginOrRegister" component={LoginOrRegister} />
      <Auth.Screen name="Login" component={Login} />
    </Auth.Navigator>
  );
};
