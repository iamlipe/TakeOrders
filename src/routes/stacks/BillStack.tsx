import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Bill as BillModel } from '@database/models/billModel';

import { BillHome } from '@presentational/BillScreen/BillHome';
import { BillDetails } from '@presentational/BillScreen/BillDetails';
import { BillAddProduct } from '@presentational/BillScreen/BillAddProducts';

export type BillStackParamList = {
  BillHome: undefined;
  BillDetails: { bill: BillModel };
  BillAddProduct: { bill: BillModel };
};

const Bill = createNativeStackNavigator<BillStackParamList>();

export const BillStack = () => {
  return (
    <Bill.Navigator
      initialRouteName="BillHome"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Bill.Screen name="BillHome" component={BillHome} />
      <Bill.Screen name="BillDetails" component={BillDetails} />
      <Bill.Screen name="BillAddProduct" component={BillAddProduct} />
    </Bill.Navigator>
  );
};
