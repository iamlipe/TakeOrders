import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginOrRegister } from '@presentational/LoginScreen/LoginOrRegister';

export type AuthStackParamList = {
  LoginOrRegister: undefined;
};

const Auth = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="LoginOrRegister" component={LoginOrRegister} />
    </Auth.Navigator>
  );
};
