import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MenuHome } from '@presentational/MenuScreen/MenuHome';
import { MenuHelper } from '@presentational/MenuScreen/MenuHelper';

export type MenuStackParamList = {
  MenuHome: undefined;
  MenuHelper: undefined;
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
    </Menu.Navigator>
  );
};
