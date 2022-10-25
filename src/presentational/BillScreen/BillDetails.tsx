import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  useLayoutEffect,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillStackParamList } from '@routes/stacks/BillStack';
import { Bill as BillModel } from '@database/models/billModel';
import {
  GET_ORDERS,
  OrdersResponse,
  REMOVE_ORDER,
} from '@store/slices/orderSlice';

import { RFValue } from 'react-native-responsive-fontsize';

import { Dimensions, RefreshControl } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import EmptyOrders from '@assets/svgs/empty-orders.svg';
import LinearGradient from 'react-native-linear-gradient';
import Loading from '@components/Loading';
import Header from '@components/Header';
import Card from '@components/Card';
import formatedCurrency from '@utils/formatedCurrency';
import Button from '@components/Button';
import CloseBillBottomSheetModal from './CloseBillBottomSheetModal';
import WarningDeleteModal from '@components/WarningDeleteModal';
import { Order } from '@database/models/orderModel';
import { GET_BILLS } from '@store/slices/billSlice';
import { UPDATE_PRODUCT } from '@store/slices/productSlice';
import { OrderUseCase } from '@database/useCase/orderUseCase';
import { ProductUseCase } from '@database/useCase/productUseCase';
import Background from '@components/Background';
import i18next from 'i18next';

interface ContainerEmptyOrders {
  height: number;
}

interface RowCardProps {
  hasBottomLine: boolean;
}

interface ColumnCardProps {
  hasBottomLine: boolean;
}

type StackParamsList = {
  Info: {
    bill: BillModel;
  };
};

type NavProps = NativeStackNavigationProp<BillStackParamList, 'BillAddProduct'>;

const { height, width } = Dimensions.get('window');

export const BillDetails = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [totalPriceBill, setTotalPriceBill] = useState(0);
  const [showWarningModal, setShowWargningModal] = useState(false);
  const [orderToRemove, setOrderToRemove] = useState<{
    orderId: string;
    quantity: number;
  } | null>(null);

  const { allOrdersClient, isLoading } = useReduxSelector(state => state.order);

  const dispatch = useReduxDispatch();

  const isFocused = useIsFocused();

  const { bill } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const { goBack } = useNavigation();
  const { navigate } = useNavigation<NavProps>();

  const theme = useTheme();

  const { t } = useTranslation();

  const heightList = useMemo(
    () => height - 120 - 32 - RFValue(32) - 16 - 16 - 32 - 98 - 32 - 72,
    [],
  );

  const closeBillBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const getOrders = useCallback(() => {
    dispatch(GET_ORDERS({ billId: bill.id }));
  }, [bill, dispatch]);

  const getBills = useCallback(() => {
    dispatch(GET_BILLS());
  }, [dispatch]);

  const removeOrder = useCallback(
    (order: Order) => {
      dispatch(REMOVE_ORDER({ order }));
    },
    [dispatch],
  );

  const updateProduct = useCallback(
    ({
      productId,
      productQuantity,
      quantity,
    }: {
      productId: string;
      productQuantity: number;
      quantity: number;
    }) => {
      dispatch(
        UPDATE_PRODUCT({
          productId,
          updatedProduct: {
            quantitySold: productQuantity + quantity,
          },
        }),
      );
    },
    [dispatch],
  );

  const handleRemoveOrder = useCallback(async () => {
    if (orderToRemove) {
      const order = await OrderUseCase.getById({
        billId: bill.id,
        orderId: orderToRemove.orderId,
      });

      const product = await ProductUseCase.getById({
        productId: order.product.id,
      });

      setTimeout(() => removeOrder(order), 250);

      setTimeout(
        () =>
          updateProduct({
            productId: product.id,
            productQuantity: product.quantitySold,
            quantity: orderToRemove.quantity,
          }),
        500,
      );

      setTimeout(() => getBills(), 750);

      setTimeout(() => setShowWargningModal(false), 1000);
    }
  }, [bill.id, getBills, orderToRemove, removeOrder, updateProduct]);

  const handleShowcloseBillBottomSheet = useCallback(() => {
    closeBillBottomSheetModalRef.current?.present();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getOrders();

    setTimeout(() => setRefreshing(false), 1000);
  }, [getOrders]);

  useEffect(() => {
    getOrders();
  }, [getOrders, isFocused, isLoading]);

  useEffect(() => {
    if (allOrdersClient) {
      const totalPrice = allOrdersClient.reduce(
        (prev, curr) => prev + curr.product.price * curr.quantity,
        0,
      );

      setTotalPriceBill(totalPrice);
    }
  }, [allOrdersClient, isLoading]);

  useLayoutEffect(() => {
    if (allOrdersClient) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allOrdersClient]);

  const renderCard = (order: OrdersResponse) => {
    return (
      <StyledContainerCard style={{ elevation: 2 }}>
        {order.product.image ? (
          <StyledImageCard
            source={{ uri: order.product.image }}
            resizeMode="contain"
          />
        ) : (
          <StyledDefaultImage />
        )}

        <StyledLineCard />

        <StyledColumnCard>
          <StyledDateCard>
            {new Date(order.createAt).toLocaleDateString(i18next.language, {
              hour: 'numeric',
              minute: 'numeric',
            })}
          </StyledDateCard>
          <StyledTitleCard>{order.product.name}</StyledTitleCard>

          <StyledQuntityAndPriceCard>
            {`qtd: ${order.quantity}, ${formatedCurrency(
              order.product.price * order.quantity,
            )}`}
          </StyledQuntityAndPriceCard>
        </StyledColumnCard>

        <StyledBaseButton
          onPress={() => {
            setShowWargningModal(true);
            setOrderToRemove({
              orderId: order.id,
              quantity: order.quantity,
            });
          }}
        >
          <StyledLink>{t('components.button.delete')}</StyledLink>
        </StyledBaseButton>
      </StyledContainerCard>
    );
  };

  return (
    <Background>
      <Header
        title={
          bill.name[0].toUpperCase() + bill.name.substring(1).toLowerCase()
        }
        onPress={goBack}
      />

      {showContent ? (
        <StyledContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <StyledTitle>{t('screens.billDetails.title')}</StyledTitle>

          {allOrdersClient?.length ? (
            <StyledContainerCardOrders style={{ minHeight: heightList }}>
              {allOrdersClient
                .slice(0, 10)
                .reverse()
                .map(item => renderCard(item))}
            </StyledContainerCardOrders>
          ) : (
            <StyledContainerEmptyOrders style={{ height: heightList }}>
              <EmptyOrders width={132} height={132} />
              <StyledTextEmptyOrders>
                {t('screens.billDetails.listOrdersEmpty')}
              </StyledTextEmptyOrders>
            </StyledContainerEmptyOrders>
          )}

          <StyledContainerInfoBill>
            <StyledTitleTotalPriceBill>
              {t('screens.billDetails.total').toUpperCase()}
            </StyledTitleTotalPriceBill>
            <StyledTotalPriceBill>
              {formatedCurrency(totalPriceBill)}
            </StyledTotalPriceBill>
          </StyledContainerInfoBill>

          <StyledContainerButtons>
            <Button
              title={t('components.button.addProductOrder')}
              onPress={() => navigate('BillAddProduct', { bill })}
              backgroundColor="trasparent"
              fontColor="GRAY_800"
            />
            <Button
              title={t('components.button.closeBill')}
              onPress={handleShowcloseBillBottomSheet}
            />
          </StyledContainerButtons>
        </StyledContent>
      ) : (
        <Loading />
      )}

      <CloseBillBottomSheetModal
        bill={bill}
        totalPriceBill={totalPriceBill}
        ref={closeBillBottomSheetModalRef}
      />

      <WarningDeleteModal
        visible={showWarningModal}
        setVisible={setShowWargningModal}
        remove={() => handleRemoveOrder()}
      />
    </Background>
  );
};

const StyledContent = styled.ScrollView`
  margin-bottom: 120px;
`;

const StyledContainerButtons = styled.View`
  height: 98px;

  justify-content: space-between;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(32)}px;

  padding: 0 32px;
`;

const StyledContainerInfoBill = styled.View`
  height: 32px;

  flex-direction: row;

  justify-content: space-between;
  align-items: center;

  padding: 0 32px;
`;

const StyledTitleTotalPriceBill = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledTotalPriceBill = styled(StyledTitleTotalPriceBill)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
`;

const StyledContainerEmptyOrders = styled.View<ContainerEmptyOrders>`
  height: ${({ height }) => height}px;

  justify-content: center;
  align-items: center;

  margin: 16px 0;
`;

const StyledTextEmptyOrders = styled(StyledTitle)`
  width: 80%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;
`;

const StyledContainerCardOrders = styled.View`
  margin: 16px 0;
`;

const StyledContainerCard = styled.View`
  align-items: center;

  flex-direction: row;

  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 8px;
  margin: 0 32px 16px;
`;

const StyledDateCard = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledImageCard = styled.Image`
  width: 60px;
  height: 80px;

  border-radius: 4px;
`;

const StyledDefaultImage = styled.View`
  width: 60px;
  height: 80px;

  border-radius: 4px;
`;

const StyledTitleCard = styled(StyledDateCard)``;

const StyledQuntityAndPriceCard = styled(StyledDateCard)``;

const StyledBaseButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const StyledLink = styled.Text`
  color: ${({ theme }) => theme.colors.SECUNDARY_600};

  text-decoration: underline;
`;

const StyledColumnCard = styled.View<ColumnCardProps>`
  width: ${width - 32 - 8 - 60 - 4 - 4 - 8 - 8 - width * 0.1 - 8 - 32}px;
  height: 80px;

  justify-content: space-between;

  padding: 0 8px;
`;

const StyledLineCard = styled.View`
  width: 1px;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.GRAY_300};
  margin: 0 4px;
`;
