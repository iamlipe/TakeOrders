import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import formatedCurrency from '@utils/formatedCurrency';

import { Product } from '@database/models/productModel';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';
import { Bill as BillModel } from '@database/models/billModel';

import { CREATE_PRODUCT, GET_ALL_PRODUCTS } from '@store/slices/productSlice';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Dimensions, FlatList, StatusBar } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import AddOrderBottomSheetModal from './AddOrderBottomSheetModal';
import SquareCard from '@components/SquareCard';
import Header from '@components/Header';
import Button from '@components/Button';
import SearchInput from '@components/SearchInput';
import Loading from '@components/Loading';

type StackParamsList = {
  Info: {
    bill: BillModel;
  };
};

const { height } = Dimensions.get('window');

export const BillAddProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [showContent, setShowContent] = useState(false);

  const dispatch = useReduxDispatch();
  const { stockId } = useReduxSelector(state => state.stock);
  const { allProducts, foundProducts, isLoading } = useReduxSelector(
    state => state.product,
  );

  const { bill } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;
  const { goBack } = useNavigation();

  const heigthList = height - (120 + 32 + 56 + 24 + 72);

  const { t } = useTranslation();

  const theme = useTheme();

  const addOrderBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleShowAddOrderBottomSheet = useCallback(() => {
    addOrderBottomSheetModalRef.current?.present();
  }, []);

  const handleColseAddOrderBottomSheet = useCallback(() => {
    addOrderBottomSheetModalRef.current?.dismiss();
  }, []);

  const getProducts = useCallback(() => {
    dispatch(GET_ALL_PRODUCTS());
  }, [dispatch]);

  const addOnePrduct = useCallback(() => {
    if (stockId) {
      dispatch(
        CREATE_PRODUCT({
          name: 'Skoll 600ml',
          type: 'Bebidas',
          price: 10,
          image: undefined,
          stockId,
          quantity: 200,
        }),
      );

      setTimeout(() => {
        getProducts();
      }, 1000);
    }
  }, [dispatch, getProducts, stockId]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (allProducts && !isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [allProducts, isLoading]);

  const renderContent = () => {
    return (
      <>
        {showContent ? (
          <>
            {allProducts?.length ? (
              <StyledContainerProducts>
                <SearchInput
                  placeholder={t('components.searchInput.product')}
                  type="products"
                />

                <FlatList
                  data={
                    foundProducts && foundProducts.length
                      ? foundProducts
                      : allProducts
                  }
                  numColumns={2}
                  renderItem={({ item }) => (
                    <SquareCard
                      key={item.id}
                      item={{
                        name: item.name,
                        price: formatedCurrency(item.price),
                      }}
                      onPress={() => {
                        setSelectedProduct(item);
                        handleShowAddOrderBottomSheet();
                      }}
                    />
                  )}
                  keyExtractor={item => item.id}
                  style={{
                    height: StatusBar.currentHeight
                      ? heigthList - StatusBar.currentHeight
                      : heigthList,
                    marginTop: 16,
                    marginHorizontal: 32,
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </StyledContainerProducts>
            ) : (
              <StyledContainerNoProductsInStock>
                <StyledTitleNoProductsInStock>
                  {t('screens.billAddProducts.listProductsStockEmpty')}
                </StyledTitleNoProductsInStock>
                <Button
                  title={t('components.button.addProductStock')}
                  onPress={addOnePrduct}
                />
              </StyledContainerNoProductsInStock>
            )}
          </>
        ) : (
          <Loading />
        )}
      </>
    );
  };

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title={t('components.header.billAddProducts')} onPress={goBack} />

      {useMemo(renderContent, [
        addOnePrduct,
        allProducts,
        foundProducts,
        handleShowAddOrderBottomSheet,
        heigthList,
        showContent,
        t,
      ])}

      <AddOrderBottomSheetModal
        product={selectedProduct}
        billId={bill.id}
        closeBottomSheet={handleColseAddOrderBottomSheet}
        ref={addOrderBottomSheetModalRef}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContainerProducts = styled.View`
  padding: 32px 0;
`;

const StyledContainerNoProductsInStock = styled.View`
  align-items: center;
  justify-content: center;

  padding: 64px 32px;
`;

const StyledTitleNoProductsInStock = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  text-align: center;

  margin-bottom: 16px;
`;
