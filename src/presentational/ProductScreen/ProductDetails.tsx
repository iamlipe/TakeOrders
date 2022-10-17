import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { GET_PRODUCT_BY_ID } from '@store/slices/productSlice';
import { GET_ORDERS_BY_PRODUCT } from '@store/slices/orderSlice';

import { filterByDate } from '@utils/filterByDate';

import { Dimensions, StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import Loading from '@components/Loading';

interface ContainerInfoProps {
  noPadding?: boolean;
}

type StackParamsList = {
  Info: {
    productId: string;
  };
};

const { width, height } = Dimensions.get('window');

export const ProductDetails = () => {
  const [showContent, setShowContent] = useState(false);

  const dispatch = useReduxDispatch();
  const { allOrdersByProduct } = useReduxSelector(state => state.order);
  const { selectedProduct } = useReduxSelector(state => state.product);

  const { goBack } = useNavigation();

  const { t } = useTranslation();

  const theme = useTheme();

  const { productId } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const ordersLast7Years = allOrdersByProduct?.filter(order => {
    const date = order.createAt as unknown as Date;

    if (filterByDate({ date, period: 'last7Days' })) {
      return order;
    }
  });

  const ordersLast30Years = allOrdersByProduct?.filter(order => {
    const date = order.createAt as unknown as Date;

    if (filterByDate({ date, period: 'last30Days' })) {
      return order;
    }
  });

  const ordersLastMonth = allOrdersByProduct?.filter(order => {
    const date = order.createAt as unknown as Date;

    if (filterByDate({ date, period: 'lastMonth' })) {
      return order;
    }
  });

  const getProductById = useCallback(() => {
    if (productId) {
      dispatch(GET_PRODUCT_BY_ID({ productId }));
    }
  }, [dispatch, productId]);

  const getOrdersByProduct = useCallback(() => {
    if (selectedProduct) {
      dispatch(GET_ORDERS_BY_PRODUCT({ productId: selectedProduct.id }));
    }
  }, [dispatch, selectedProduct]);

  useEffect(() => {
    getProductById();
    getOrdersByProduct();
  }, [getOrdersByProduct, getProductById]);

  useEffect(() => {
    if (selectedProduct) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [selectedProduct]);

  const renderInfoProduct = () => {
    return (
      <StyledContainerInfoProduct style={{ elevation: 2 }} noPadding>
        {selectedProduct?.image ? (
          <StyledImageProduct
            source={{ uri: selectedProduct.image }}
            resizeMode="cover"
          />
        ) : (
          <StyledDefaultImageProduct>
            <Icon
              name="image-not-supported"
              color={theme.colors.WHITE}
              size={20}
            />
          </StyledDefaultImageProduct>
        )}

        <StyledTitleProduct>{selectedProduct?.name}</StyledTitleProduct>
      </StyledContainerInfoProduct>
    );
  };

  const renderInfoSales = () => {
    return (
      <>
        <StyledTitleInfo>
          {t('screens.stockDetailsProduct.sales')}
        </StyledTitleInfo>
        <StyledContainerInfoProduct>
          <StyledColumnInfoSales>
            <StyledTitleInfoSales>
              {t('screens.stockDetailsProduct.titleSales.7days')}
            </StyledTitleInfoSales>
            <StyledDescriptionInfoSales>
              {ordersLast7Years?.length}
            </StyledDescriptionInfoSales>
          </StyledColumnInfoSales>
          <StyledColumnInfoSales>
            <StyledTitleInfoSales>
              {t('screens.stockDetailsProduct.titleSales.30days')}
            </StyledTitleInfoSales>
            <StyledDescriptionInfoSales>
              {ordersLast30Years?.length}
            </StyledDescriptionInfoSales>
          </StyledColumnInfoSales>
          <StyledColumnInfoSales>
            <StyledTitleInfoSales>
              {t('screens.stockDetailsProduct.titleSales.lastMonth')}
            </StyledTitleInfoSales>
            <StyledDescriptionInfoSales>
              {ordersLastMonth?.length}
            </StyledDescriptionInfoSales>
          </StyledColumnInfoSales>
        </StyledContainerInfoProduct>
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
      <Header
        title={t('components.header.stockDetailsProduct')}
        onPress={goBack}
      />

      {showContent ? (
        <StyledContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 32 }}
        >
          {renderInfoProduct()}
          {renderInfoSales()}
        </StyledContent>
      ) : (
        <Loading />
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContent = styled.ScrollView`
  height: ${height - 120 - 72}px;
`;

const StyledContainerInfoProduct = styled.View<ContainerInfoProps>`
  flex-direction: row;

  align-items: center;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: ${({ noPadding }) => (noPadding ? '8' : '16')}px;
`;

const StyledImageProduct = styled.Image`
  width: 80px;
  height: 120px;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledDefaultImageProduct = styled.View`
  width: 80px;
  height: 120px;

  align-items: center;
  justify-content: center;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.SECUNDARY_200};
`;

const StyledTitleProduct = styled.Text`
  width: ${width - 64 - 32 - 120}px;

  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-transform: uppercase;

  margin-left: 8px;
`;

const StyledTitleInfo = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-top: 24px;
`;

const StyledColumnInfoStock = styled.View`
  width: 50%;
  height: 80px;

  justify-content: center;
  align-items: center;
`;

const StyledTitleInfoStock = styled.Text`
  height: 45px;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-bottom: 4px;
`;

const StyledDescriptionInfoStock = styled(StyledTitleInfoStock)`
  height: 20px;

  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};

  color: ${({ theme }) => theme.colors.PRIMARY_600};

  margin-bottom: 0;
`;

const StyledColumnInfoSales = styled(StyledColumnInfoStock)`
  width: 33.33%;
`;

const StyledTitleInfoSales = styled(StyledTitleInfoStock)`
  height: 20px;
`;

const StyledDescriptionInfoSales = styled(StyledDescriptionInfoStock)``;
