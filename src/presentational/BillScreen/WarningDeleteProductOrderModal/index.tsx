import React, {
  memo,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Overlay } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { UPDATE_PRODUCT } from '@store/slices/productSlice';
import { Bill } from '@database/models/billModel';
import { OrderUseCase } from '@database/useCase/orderUseCase';
import { ProductUseCase } from '@database/useCase/productUseCase';
import { REMOVE_ORDER } from '@store/slices/orderSlice';
import { GET_BILLS } from '@store/slices/billSlice';
import { Order } from '@database/models/orderModel';

interface TextButtonProps {
  remove?: boolean;
}

interface WarningDeleteProductModalProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  bill: Bill;
  removeProduct: {
    orderId: string;
    quantity: number;
  };
}

const { width, height } = Dimensions.get('window');

const WarningDeleteProductOrderModal = ({
  visible,
  setVisible,
  bill,
  removeProduct,
}: WarningDeleteProductModalProps) => {
  const [loadingRemove, setLoadingRemove] = useState(false);
  const dispatch = useReduxDispatch();

  const theme = useTheme();

  const { t } = useTranslation();

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

  const remove = useCallback(
    async ({ orderId, quantity }: { orderId: string; quantity: number }) => {
      setLoadingRemove(true);

      const order = await OrderUseCase.getById({
        billId: bill.id,
        orderId,
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
            quantity,
          }),
        500,
      );

      setTimeout(() => getBills(), 750);

      setTimeout(() => {
        setLoadingRemove(false);
        setVisible(false);
      }, 1000);
    },
    [bill.id, getBills, removeOrder, setVisible, updateProduct],
  );

  return (
    <>
      <StyledBackground />
      <StyledOverlay
        isVisible={!!visible}
        onBackdropPress={() => setVisible(false)}
        backdropStyle={{ backgroundColor: theme.colors.BACKGROUND_MODAL }}
        statusBarTranslucent
        fullScreen={false}
        overlayStyle={{
          height:
            24 +
            RFValue(72) +
            16 +
            RFValue(24) +
            16 +
            RFValue(16) +
            16 +
            RFValue(12) +
            32 +
            16 +
            24,
          width: width * 0.9,
          padding: 24,
          borderRadius: 20,
          backgroundColor: theme.colors.WHITE,
        }}
      >
        <Icon
          name="warning-outline"
          color={theme.colors.ERROR_500}
          size={RFValue(72)}
          style={{ alignSelf: 'center', marginBottom: 16 }}
        />
        <StyledTitle>
          {t('screens.billDetails.warningDeleteProductModal.title')}
        </StyledTitle>

        <StyledDescription>
          {t('screens.billDetails.warningDeleteProductModal.description')}
        </StyledDescription>

        <StyledContainerButtons>
          <StyledBaseButton onPress={() => setVisible(false)}>
            <StyledTextButton>{t('components.button.cancel')}</StyledTextButton>
          </StyledBaseButton>

          <StyledBaseButton
            onPress={() =>
              remove({
                orderId: removeProduct.orderId,
                quantity: removeProduct.quantity,
              })
            }
            remove
          >
            {loadingRemove ? (
              <StyledLoading size="small" color={theme.colors.WHITE} />
            ) : (
              <StyledTextButton remove>
                {t('components.button.delete')}
              </StyledTextButton>
            )}
          </StyledBaseButton>
        </StyledContainerButtons>
      </StyledOverlay>
    </>
  );
};

const StyledOverlay = styled(Overlay)``;

const StyledBackground = styled.TouchableOpacity`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;

  width: ${width}px;
  height: ${height}px;

  flex: 1;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.BACKGROUND_MODAL};
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(24)}px;

  text-align: center;

  margin-bottom: 16px;
`;

const StyledDescription = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_600};

  line-height: ${RFValue(16)}px;

  text-align: center;

  margin-bottom: 16px;
`;

const StyledContainerButtons = styled.View`
  flex-direction: row;

  align-self: center;
`;

const StyledBaseButton = styled.TouchableOpacity<TextButtonProps>`
  min-width: 80px;

  background-color: ${({ theme, remove }) =>
    remove ? theme.colors.ERROR_500 : 'transparent'};

  border-radius: 4px;

  margin-left: 8px;

  padding: 8px 16px;
`;

const StyledTextButton = styled.Text<TextButtonProps>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme, remove }) =>
    remove ? theme.colors.WHITE : theme.colors.GRAY_800};

  text-align: center;
`;

const StyledLoading = styled.ActivityIndicator``;

export default memo(WarningDeleteProductOrderModal);
