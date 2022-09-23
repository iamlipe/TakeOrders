import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import Header from '@components/Header';
import BigButton from '@components/BigButton';
import { StockStackParamList } from '@routes/stacks/StockStack';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { GET_ALL_PRODUCTS } from '@store/slices/productSlice';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { FlatList } from 'react-native-gesture-handler';
import Card from '@components/Card';
import AddProductBottomSheetModal from './AddProductBottomSheetModal';
import { Product as ProductModel } from '@database/models/productModel';

type NavProps = NativeStackNavigationProp<
  StockStackParamList,
  'StockRegisterProduct'
>;

export const StockHome = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const dispatch = useReduxDispatch();
  const { allProducts } = useReduxSelector(state => state.product);

  const { navigate } = useNavigation<NavProps>();

  const addProductBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleShowAddProductBottomSheet = useCallback(() => {
    addProductBottomSheetModalRef.current?.present();
  }, []);

  const getProducts = useCallback(() => {
    dispatch(GET_ALL_PRODUCTS());
  }, [dispatch]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <StyledContainer>
      <Header title="Estoque" />

      <StyledContent>
        <BigButton
          title="Cadastrar novo produto"
          icon={{ name: 'add-circle-outline', color: 'WHITE' }}
          onPress={() => navigate('StockRegisterProduct')}
        />

        <StyledTitleList>PRODUTOS EM ESTOQUE</StyledTitleList>

        <FlatList
          data={allProducts}
          renderItem={({ item }) => (
            <Card
              key={item.id}
              type="normal"
              cardSize="large"
              item={{
                title:
                  item.name[0].toUpperCase() +
                  item.name.substring(1).toLowerCase(),
                description: `quantidade: ${String(item.quantity)}`,
                link: () => {
                  setSelectedProduct(item.id);
                  handleShowAddProductBottomSheet();
                },
              }}
              onPress={() => null}
            />
          )}
          keyExtractor={item => item.id}
          style={{}}
          showsVerticalScrollIndicator={false}
        />

        <AddProductBottomSheetModal
          productId={selectedProduct}
          ref={addProductBottomSheetModalRef}
        />
      </StyledContent>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  min-height: 100%;
`;

const StyledContent = styled.View`
  padding: 32px 0;
`;

const StyledTitleList = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding: 0 32px;
  margin-top: 24px;
`;
