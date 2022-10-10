import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MenuHome } from '@presentational/MenuScreen/MenuHome';
import { MenuHelper } from '@presentational/MenuScreen/MenuHelper';
import { MenuDoubt } from '@presentational/MenuScreen/MenuDoubt';

export type MenuStackParamList = {
  MenuHome: undefined;
  MenuHelper: undefined;
  MenuDoubt: { question: string; answer: string };
};

const Menu = createNativeStackNavigator<MenuStackParamList>();

export const MenuStack = () => {
  return (
    <Menu.Navigator
      initialRouteName="MenuHome"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Menu.Screen name="MenuHome" component={MenuHome} />
      <Menu.Screen name="MenuHelper" component={MenuHelper} />
      <Menu.Screen name="MenuDoubt" component={MenuDoubt} />
    </Menu.Navigator>
  );
};
