import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FinancialHome } from '@presentational/FinancialScreen/FinancialHome';
import { FinancialInvoicing } from '@presentational/FinancialScreen/FinancialInvoicing';
import { FinancialProfit } from '@presentational/FinancialScreen/FinancialProfit';
import { FinancialSpending } from '@presentational/FinancialScreen/FinancialSpending';

export type FinancialStackParamList = {
  FinancialHome: undefined;
  FinancialInvoicing: undefined;
  FinancialProfit: undefined;
  FinancialSpending: undefined;
};

const Financial = createNativeStackNavigator<FinancialStackParamList>();

export const FinancialStack = () => {
  return (
    <Financial.Navigator
      initialRouteName="FinancialHome"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Financial.Screen name="FinancialHome" component={FinancialHome} />
      <Financial.Screen
        name="FinancialInvoicing"
        component={FinancialInvoicing}
      />
      <Financial.Screen name="FinancialProfit" component={FinancialProfit} />
      <Financial.Screen
        name="FinancialSpending"
        component={FinancialSpending}
      />
    </Financial.Navigator>
  );
};
