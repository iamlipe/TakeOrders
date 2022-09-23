import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StockHome } from '@presentational/StockScreen/StockHome';
import { StockRegisterProduct } from '@presentational/StockScreen/StockRegisterProduct';
import { StockDetailsProduct } from '@presentational/StockScreen/StockDetailsProduct';

export type StockStackParamList = {
  StockHome: undefined;
  StockRegisterProduct: undefined;
  StockDetailsProduct: undefined;
};

const Stock = createNativeStackNavigator<StockStackParamList>();

export const StockStack = () => {
  return (
    <Stock.Navigator
      initialRouteName="StockHome"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stock.Screen name="StockHome" component={StockHome} />
      <Stock.Screen
        name="StockRegisterProduct"
        component={StockRegisterProduct}
      />
      <Stock.Screen
        name="StockDetailsProduct"
        component={StockDetailsProduct}
      />
    </Stock.Navigator>
  );
};
