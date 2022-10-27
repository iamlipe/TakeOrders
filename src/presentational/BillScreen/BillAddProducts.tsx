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
import { RFValue } from 'react-native-responsive-fontsize';

import { Bill as BillModel } from '@database/models/billModel';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';
import { StackActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoggedStackParamList } from '@routes/stacks/LoggedStack';

import {
  GET_ALL_PRODUCTS,
  ProductResponse,
  UPDATE_PRODUCT,
} from '@store/slices/productSlice';
import { CREATE_ORDER } from '@store/slices/orderSlice';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Dimensions, RefreshControl } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddOrderBottomSheetModal from './AddOrderBottomSheetModal';
import SquareCard from '@components/SquareCard';
import Header from '@components/Header';
import Button from '@components/Button';
import SearchInput from '@components/SearchInput';
import Loading from '@components/Loading';
import Background from '@components/Background';

export interface ProductBag {
  product: ProductResponse;
  quantity: number;
}

type StackParamsList = {
  Info: {
    bill: BillModel;
  };
};

type NavProps = NativeStackNavigationProp<LoggedStackParamList, 'ProductStack'>;

const { width, height } = Dimensions.get('window');

export const BillAddProduct = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductBag[] | null>(
    null,
  );
  const [showContent, setShowContent] = useState(false);
  const [dataProducts, setDatatProducts] = useState<ProductResponse[] | null>(
    null,
  );

  const dispatch = useReduxDispatch();

  const { allProducts, foundProducts } = useReduxSelector(
    state => state.product,
  );

  const { bill } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const { navigate } = useNavigation<NavProps>();
  const { goBack, dispatch: navigateDispatch } = useNavigation();

  const heightEmptyContent = useMemo(
    () => height - 120 - 32 - 56 - 16 - 16 - 44 - 32 - 72,
    [],
  );

  const heightList = useMemo(
    () =>
      ((width - 64) * 0.48 + width * 0.04) *
      Math.round(dataProducts ? dataProducts.length / 2 : 0),
    [dataProducts],
  );
  const { t } = useTranslation();

  const theme = useTheme();

  const pushAction = StackActions.push('ProductRegister', {
    product: undefined,
  });

  const addOrderBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const getProducts = useCallback(() => {
    dispatch(GET_ALL_PRODUCTS());
  }, [dispatch]);

  const createOrder = useCallback(
    ({ product, quantity }: ProductBag) => {
      dispatch(
        CREATE_ORDER({
          quantity,
          billId: bill.id,
          productId: product.id,
        }),
      );
    },
    [bill.id, dispatch],
  );

  const updateProduct = useCallback(
    ({ product, quantity }: ProductBag) => {
      dispatch(
        UPDATE_PRODUCT({
          productId: product.id,
          updatedProduct: {
            quantitySold: quantity,
          },
        }),
      );
    },
    [dispatch],
  );

  const handleShowAddOrderBottomSheet = useCallback(() => {
    addOrderBottomSheetModalRef.current?.present();
  }, []);

  const handleColseAddOrderBottomSheet = useCallback(
    (products: ProductBag[]) => {
      products?.forEach(item => {
        createOrder(item);
        updateProduct(item);
      });

      addOrderBottomSheetModalRef.current?.dismiss();
    },
    [createOrder, updateProduct],
  );

  const handleSelectProduct = useCallback(
    (product: ProductResponse) => {
      const alreadySelected = selectedProducts?.find(
        item => item.product.id === product.id,
      );

      if (alreadySelected && selectedProducts) {
        setSelectedProducts(
          selectedProducts?.map(item => {
            if (item.product.id === product.id) {
              return {
                product: item.product,
                quantity: item.quantity + 1,
              };
            }

            return item;
          }),
        );
      } else if (selectedProducts) {
        setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
      } else {
        setSelectedProducts([{ product, quantity: 1 }]);
      }
    },
    [selectedProducts],
  );

  const handleRemoveProduct = useCallback(
    (id: string) => {
      const filteredProducts = selectedProducts?.filter(
        item => item.product.id !== id,
      );

      if (filteredProducts)
        setSelectedProducts(
          filteredProducts.length === 0 ? null : filteredProducts,
        );
    },
    [selectedProducts],
  );

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
    <Background>
      <Header title={t('components.header.billAddProducts')} onPress={goBack} />

      {showContent && !!dataProducts?.length && (
        <>
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
                  heightList < heightEmptyContent
                    ? heightEmptyContent
                    : heightList,
              }}
            >
              {dataProducts?.slice(0, 20).map((item, index) => {
                return (
                  <SquareCard
                    key={item.id}
                    item={{
                      index,
                      name: item.name,
                      image: item.image,
                      price: formatedCurrency(item.price),
                    }}
                    onPress={() => handleSelectProduct(item)}
                  />
                );
              })}
            </StyledContainerCardProducts>

            <StyledBagButton onPress={handleShowAddOrderBottomSheet}>
              <StyledTextBagButton>
                {t('components.button.seeBag')}
              </StyledTextBagButton>
              <StyledIconBag>
                <Icon
                  name="shopping-outline"
                  color={theme.colors.WHITE}
                  size={RFValue(20)}
                />

                <StyledCircle>
                  <StyledTextCircle>
                    {selectedProducts
                      ? selectedProducts.reduce(
                          (prev, curr) => prev + curr.quantity,
                          0,
                        )
                      : 0}
                  </StyledTextCircle>
                </StyledCircle>
              </StyledIconBag>
            </StyledBagButton>
          </StyledContent>
        </>
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
        products={selectedProducts}
        closeBottomSheet={handleColseAddOrderBottomSheet}
        ref={addOrderBottomSheetModalRef}
        removeProduct={handleRemoveProduct}
      />
    </Background>
  );
};

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

  align-self: center;
`;

const StyledIconBag = styled.View``;

const StyledBagButton = styled.TouchableOpacity`
  min-height: 44px;

  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.BLACK};

  padding: 8px 16px;
  margin: 0 32px;
`;

const StyledTextBagButton = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.WHITE};

  align-self: center;
`;

const StyledCircle = styled.View`
  position: absolute;
  top: 2px;
  right: -4px;

  width: ${RFValue(12)}px;
  height: ${RFValue(12)}px;

  align-items: center;
  justify-content: center;

  border-radius: ${RFValue(6)}px;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledTextCircle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MINOR};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;
