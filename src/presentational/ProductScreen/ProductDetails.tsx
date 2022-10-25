import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { GET_PRODUCT_BY_ID, REMOVE_PRODUCT } from '@store/slices/productSlice';
import { GET_ORDERS_BY_PRODUCT } from '@store/slices/orderSlice';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductStackParamList } from '@routes/stacks/ProductStack';

import { filterByDate } from '@utils/filterByDate';

import { Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import Loading from '@components/Loading';
import Button from '@components/Button';
import WarningDeleteModal from '@components/WarningDeleteModal';
import Background from '@components/Background';

interface ContainerInfoProps {
  noPadding?: boolean;
}

type StackParamsList = {
  Info: {
    productId: string;
  };
};

type NavProps = NativeStackNavigationProp<
  ProductStackParamList,
  'ProductRegister'
>;

const { height } = Dimensions.get('window');

export const ProductDetails = () => {
  const [showContent, setShowContent] = useState(true);
  const [showWarningModal, setShowWargningModal] = useState(false);

  const dispatch = useReduxDispatch();
  const { allOrdersByProduct } = useReduxSelector(state => state.order);
  const { selectedProduct } = useReduxSelector(state => state.product);

  const { navigate } = useNavigation<NavProps>();
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

  const handleRemoveProduct = useCallback(() => {
    if (selectedProduct) {
      dispatch(REMOVE_PRODUCT({ productId: selectedProduct.id }));

      goBack();
    }
  }, [dispatch, goBack, selectedProduct]);

  const handleNavigateToEditProduct = useCallback(() => {
    if (selectedProduct) {
      navigate('ProductRegister', { product: selectedProduct });
    }
  }, [navigate, selectedProduct]);

  useEffect(() => {
    getProductById();
    getOrdersByProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            source={{ uri: selectedProduct?.image }}
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

        <StyledColumnInfoProduct>
          <StyledTitleProduct>{selectedProduct?.name}</StyledTitleProduct>
          <StyledDescriptionProduct>
            {selectedProduct?.category.name}
          </StyledDescriptionProduct>
        </StyledColumnInfoProduct>
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
              {ordersLast7Years?.reduce(
                (prev, curr) => prev + curr.quantity,
                0,
              ) || '0'}
            </StyledDescriptionInfoSales>
          </StyledColumnInfoSales>
          <StyledColumnInfoSales>
            <StyledTitleInfoSales>
              {t('screens.stockDetailsProduct.titleSales.30days')}
            </StyledTitleInfoSales>
            <StyledDescriptionInfoSales>
              {ordersLast30Years?.reduce(
                (prev, curr) => prev + curr.quantity,
                0,
              ) || '0'}
            </StyledDescriptionInfoSales>
          </StyledColumnInfoSales>
          <StyledColumnInfoSales>
            <StyledTitleInfoSales>
              {t('screens.stockDetailsProduct.titleSales.lastMonth')}
            </StyledTitleInfoSales>
            <StyledDescriptionInfoSales>
              {ordersLastMonth?.reduce(
                (prev, curr) => prev + curr.quantity,
                0,
              ) || '0'}
            </StyledDescriptionInfoSales>
          </StyledColumnInfoSales>
        </StyledContainerInfoProduct>
      </>
    );
  };

  const renderButtons = () => {
    return (
      <StyledContainerButtons>
        <Button
          title="Editar"
          onPress={handleNavigateToEditProduct}
          backgroundColor="trasparent"
          fontColor="GRAY_800"
        />
        <Button title="Excluir" onPress={() => setShowWargningModal(true)} />
      </StyledContainerButtons>
    );
  };

  return (
    <Background>
      <Header
        title={t('components.header.stockDetailsProduct')}
        onPress={goBack}
      />

      {showContent ? (
        <StyledContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 32 }}
        >
          <StyledContainerInfo>
            {renderInfoProduct()}
            {renderInfoSales()}
          </StyledContainerInfo>
          {renderButtons()}
        </StyledContent>
      ) : (
        <Loading />
      )}

      <WarningDeleteModal
        visible={showWarningModal}
        setVisible={setShowWargningModal}
        remove={() => handleRemoveProduct()}
      />
    </Background>
  );
};

const StyledContent = styled.ScrollView`
  height: ${height - 120 - 72}px;
`;

const StyledContainerInfo = styled.View`
  height: ${height - 120 - 32 - 98 - 32 - 72}px;
`;

const StyledContainerInfoProduct = styled.View<ContainerInfoProps>`
  flex-direction: row;

  align-items: center;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: ${({ noPadding }) => (noPadding ? '8' : '16')}px;

  margin: 0 32px;
`;

const StyledImageProduct = styled.Image`
  width: 80px;
  height: 120px;

  border-radius: 4px;

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
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-left: 8px;
  margin-bottom: 12px;
`;

const StyledDescriptionProduct = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-left: 8px;
`;

const StyledTitleInfo = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin: 24px 0 4px 32px;
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

const StyledColumnInfoProduct = styled.View``;

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

const StyledContainerButtons = styled.View`
  height: 98px;

  justify-content: space-between;
`;
