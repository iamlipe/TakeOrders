import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { VerifyPhoneOrEmail } from '@presentational/GlobalScreens/VerifyPhoneOrEmail';
import { RememberOrChangePassword } from '@presentational/GlobalScreens/RememberOrChangePassword';

export type GlobalStackParamList = {
  VerifyPhoneOrEmail: undefined;
  RememberOrChangePassword: undefined;
};

const Global = createNativeStackNavigator<GlobalStackParamList>();

export const GlobalStack = () => {
  return (
    <Global.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Global.Screen
        name="RememberOrChangePassword"
        component={RememberOrChangePassword}
      />
      <Global.Screen name="VerifyPhoneOrEmail" component={VerifyPhoneOrEmail} />
    </Global.Navigator>
  );
};
