import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ChosePlan } from '@presentational/PlanScreen/ChosePlan';
import { Payment } from '@presentational/PlanScreen/Payment';
import { CheckoutPayment } from '@presentational/PlanScreen/CheckoutPayment';

export type PlanStackParamList = {
  ChosePlan: undefined;
  Payment: undefined;
  CheckoutPayment: undefined;
};

const Plan = createNativeStackNavigator<PlanStackParamList>();

export const PlanStack = () => {
  return (
    <Plan.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Plan.Screen name="CheckoutPayment" component={CheckoutPayment} />
      <Plan.Screen name="ChosePlan" component={ChosePlan} />
      <Plan.Screen name="Payment" component={Payment} />
    </Plan.Navigator>
  );
};
