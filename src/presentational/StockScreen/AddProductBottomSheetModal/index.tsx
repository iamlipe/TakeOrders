import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { CREATE_PRODUCT_PURCHASE } from '@store/slices/purchaseSlice';
import { GET_PRODUCT_BY_ID, UPDATE_PRODUCT } from '@store/slices/productSlice';

import { Keyboard } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Input from '@components/Input';
import Button from '@components/Button';

interface AddProductBottomSheetModalProps {
  productId: string | null;
  closeBottomSheet: () => void;
}

interface FormAddNewPurchase {
  quantity: string;
  totalPrice: string;
}

const AddProductBottomSheetModal = forwardRef<
  BottomSheetModal,
  AddProductBottomSheetModalProps
>(({ productId, closeBottomSheet }, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useReduxDispatch();
  const { selectedProduct } = useReduxSelector(state => state.product);
  const { spentId } = useReduxSelector(state => state.spent);

  const theme = useTheme();

  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      Yup.object().shape({
        quantity: Yup.string().required(t('errors.required')),
        totalPrice: Yup.string().required(t('errors.required')),
      }),
    [t],
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<FormAddNewPurchase>({
    resolver: yupResolver(schema),
  });

  const snapPointHeigth = useMemo(
    () => [16 + 16 + 32 + 24 + 80 + 24 + 120 + 40 + 44 + 48],
    [],
  );

  const getProductById = useCallback(() => {
    if (productId) {
      dispatch(GET_PRODUCT_BY_ID({ productId }));
    }
  }, [dispatch, productId]);

  const createProductPurchase = useCallback(
    (totalPrice: string) => {
      if (spentId && selectedProduct) {
        dispatch(
          CREATE_PRODUCT_PURCHASE({
            productId: selectedProduct.id,
            spentId,
            totalPrice:
              -Number(totalPrice.substring(2).replace(/[^0-9]/g, '')) / 100,
          }),
        );
      }
    },
    [dispatch, selectedProduct, spentId],
  );

  const updateQuantityProducInStock = useCallback(
    (quantity: number) => {
      if (selectedProduct) {
        dispatch(
          UPDATE_PRODUCT({
            product: selectedProduct,
            updatedProduct: {
              quantity: selectedProduct.quantity + quantity,
            },
          }),
        );
      }
    },
    [dispatch, selectedProduct],
  );

  const onSubmit = (data: FormAddNewPurchase) => {
    Keyboard.dismiss();
    setIsLoading(true);

    createProductPurchase(data.totalPrice);

    setTimeout(() => updateQuantityProducInStock(Number(data.quantity)), 1000);

    setTimeout(() => getProductById(), 2000);

    setTimeout(() => {
      setIsLoading(false);
      closeBottomSheet();
    }, 3000);
  };

  useEffect(() => {
    getProductById();
  }, [getProductById]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        quantity: undefined,
        totalPrice: undefined,
      });
    }
  });

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPointHeigth}>
      <StyledContainer>
        <StyledTitle>Adicionar produto</StyledTitle>

        {selectedProduct && (
          <StyledContainerProductInfo>
            {selectedProduct.image ? (
              <StyledImage
                source={{ uri: selectedProduct.image }}
                resizeMode="contain"
              />
            ) : (
              <StyledDefaultImage>
                <Icon
                  name="image-not-supported"
                  color={theme.colors.WHITE}
                  size={20}
                />
              </StyledDefaultImage>
            )}

            <StyledColumnInfoProduct>
              <StyledTitleProduct>{selectedProduct.name}</StyledTitleProduct>
              <StyledDescriptionProduct>{`Quantidade em stock: ${selectedProduct.quantity}`}</StyledDescriptionProduct>
            </StyledColumnInfoProduct>
          </StyledContainerProductInfo>
        )}

        <StyledContainerForm>
          <Input
            name="quantity"
            control={control}
            label={t('components.input.quantity')}
            error={isSubmitted ? errors.quantity?.message : ''}
          />
          <Input
            name="totalPrice"
            control={control}
            label={t('components.input.totalPrice')}
            type="money"
            error={isSubmitted ? errors.totalPrice?.message : ''}
          />
        </StyledContainerForm>

        <Button
          title="Adicionar"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />
      </StyledContainer>
    </BottomSheetModal>
  );
});

const StyledContainer = styled.View`
  padding: 16px 0 46px 0;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: 32px;

  text-align: center;

  margin-bottom: 24px;
`;

const StyledContainerProductInfo = styled.View`
  height: 80px;

  flex-direction: row;

  padding: 0 32px;

  margin-bottom: 24px;
`;

const StyledImage = styled.Image`
  width: 80px;
  height: 80px;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledDefaultImage = styled.View`
  width: 80px;
  height: 80px;

  align-items: center;
  justify-content: center;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.SECUNDARY_200};
`;

const StyledColumnInfoProduct = styled.View`
  flex: 1;

  justify-content: space-between;

  padding: 16px 0;
  margin-left: 4px;
`;

const StyledTitleProduct = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledDescriptionProduct = styled(StyledTitleProduct)``;

const StyledContainerForm = styled.View`
  height: 120px;

  margin-bottom: 40px;
`;

export default memo(AddProductBottomSheetModal);
