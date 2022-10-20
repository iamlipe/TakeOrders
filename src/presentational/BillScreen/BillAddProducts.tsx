import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import formatedCurrency from '@utils/formatedCurrency';

import {
  Product,
  Product as ProductModel,
} from '@database/models/productModel';
import { Bill as BillModel } from '@database/models/billModel';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';
import { StackActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoggedStackParamList } from '@routes/stacks/LoggedStack';

import { GET_ALL_PRODUCTS } from '@store/slices/productSlice';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Dimensions, FlatList, RefreshControl } from 'react-native';

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

type NavProps = NativeStackNavigationProp<LoggedStackParamList, 'ProductStack'>;

const { width, height } = Dimensions.get('window');

export const BillAddProduct = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(
    null,
  );
  const [showContent, setShowContent] = useState(false);
  const [dataProducts, setDatatProducts] = useState<Product[] | null>(null);

  const dispatch = useReduxDispatch();

  const { allProducts, foundProducts, isLoading } = useReduxSelector(
    state => state.product,
  );

  const { bill } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const { navigate } = useNavigation<NavProps>();
  const { goBack, dispatch: navigateDispatch } = useNavigation();

  const heightList = useMemo(() => height - 120 - 32 - 56 - 24 - 72, []);

  const { t } = useTranslation();

  const theme = useTheme();

  const pushAction = StackActions.push('ProductRegister', undefined);

  const addOrderBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const getProducts = useCallback(() => {
    dispatch(GET_ALL_PRODUCTS());
  }, [dispatch]);

  const handleShowAddOrderBottomSheet = useCallback(() => {
    addOrderBottomSheetModalRef.current?.present();
  }, []);

  const handleColseAddOrderBottomSheet = useCallback(() => {
    addOrderBottomSheetModalRef.current?.dismiss();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getProducts();

    setTimeout(() => setRefreshing(false), 1000);
  }, [getProducts]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (allProducts || foundProducts) {
      if (foundProducts?.length) return setDatatProducts(foundProducts);

      if (allProducts?.length)
        return setDatatProducts([...allProducts].reverse());

      return setDatatProducts([]);
    }
  }, [allProducts, foundProducts]);

  useLayoutEffect(() => {
    if (allProducts) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allProducts]);

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title={t('components.header.billAddProducts')} onPress={goBack} />

      {showContent && dataProducts?.length && (
        <StyledContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SearchInput
            placeholder={t('components.searchInput.product')}
            type="products"
          />

          <StyledContainerCardProducts
            style={{
              height:
                ((width - 64) / 2) * Math.round(dataProducts.length / 2) + 16,
              minHeight: heightList,
            }}
          >
            {dataProducts.map((item, index) => {
              return (
                <SquareCard
                  key={item.id}
                  item={{
                    index,
                    name: item.name,
                    image: item.image,
                    price: formatedCurrency(item.price),
                  }}
                  onPress={() => {
                    setSelectedProduct(item);
                    handleShowAddOrderBottomSheet();
                  }}
                />
              );
            })}
          </StyledContainerCardProducts>
        </StyledContent>
      )}

      {showContent && !dataProducts?.length && (
        <StyledContainerNoProductsRegistredInStock>
          <StyledTitleNoProductsRegistredInStock>
            {t('screens.billAddProducts.textNoProductsRegistredInStock')}
          </StyledTitleNoProductsRegistredInStock>
          <Button
            title={t('components.button.addProductStock')}
            onPress={() => {
              navigate('ProductStack');
              setTimeout(() => navigateDispatch(pushAction), 1000);
            }}
          />
        </StyledContainerNoProductsRegistredInStock>
      )}

      {!showContent && <Loading />}

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

const StyledContent = styled.ScrollView`
  margin-bottom: 120px;
`;

const StyledContainerNoProductsRegistredInStock = styled.View`
  align-items: center;
  justify-content: center;

  padding: 64px 32px;
`;

const StyledTitleNoProductsRegistredInStock = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-bottom: 16px;
`;

const StyledContainerCardProducts = styled.View`
  width: ${width - 64}px;

  margin: 16px 0;

  flex-direction: row;
  flex-wrap: wrap;

  justify-content: flex-start;
  align-self: center;
`;
