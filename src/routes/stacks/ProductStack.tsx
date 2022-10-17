import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProductHome } from '@presentational/ProductScreen/ProductHome';
import { ProductRegister } from '@presentational/ProductScreen/ProductRegister';
import { ProductDetails } from '@presentational/ProductScreen/ProductDetails';

export type ProductStackParamList = {
  ProductHome: undefined;
  ProductRegister: undefined;
  ProductDetails: { productId: string };
};

const Product = createNativeStackNavigator<ProductStackParamList>();

export const ProductStack = () => {
  return (
    <Product.Navigator
      initialRouteName="ProductHome"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Product.Screen name="ProductHome" component={ProductHome} />
      <Product.Screen name="ProductRegister" component={ProductRegister} />
      <Product.Screen name="ProductDetails" component={ProductDetails} />
    </Product.Navigator>
  );
};
