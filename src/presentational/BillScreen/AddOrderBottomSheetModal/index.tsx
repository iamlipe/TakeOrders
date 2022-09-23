/* eslint-disable react/display-name */

import React, { forwardRef, memo, useEffect, useMemo } from 'react';
import styled from 'styled-components/native';
import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { CREATE_ORDER } from '@store/slices/orderSlice';
import { Product } from '@database/models/productModel';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import formatedCurrency from '@utils/formatedCurrency';

import { Keyboard } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Counter from '@components/Counter';
import Button from '@components/Button';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { UPDATE_PRODUCT } from '@store/slices/productSlice';

const schema = Yup.object().shape({
  quantity: Yup.number()
    .min(1, 'Adicione ao menos 1')
    .required('Preenchimento obrigatório'),
});

interface FormAddNewOrder {
  quantity: string;
}

interface AddOrderBottomSheetModalProps {
  billId: string;
  product: Product | null;
  closeBottomSheet: () => void;
}

const AddOrderBottomSheetModal = forwardRef<
  BottomSheetModal,
  AddOrderBottomSheetModalProps
>(({ product, billId, closeBottomSheet }, ref) => {
  const dispatch = useReduxDispatch();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<FormAddNewOrder>({
    resolver: yupResolver(schema),
  });

  const { goBack } = useNavigation();

  const snapPointHeigth = useMemo(
    () => [16 + 32 + 32 + 24 + 136 + 24 + 60 + 40 + 45 + 32],
    [],
  );

  const onSubmit = (data: FormAddNewOrder) => {
    if (product) {
      dispatch(
        CREATE_ORDER({
          quantity: Number(data.quantity),
          billId,
          productId: product.id,
        }),
      );

      setTimeout(() => {
        dispatch(
          UPDATE_PRODUCT({
            product,
            updatedProduct: {
              quantity: product.quantity - Number(data.quantity),
            },
          }),
        );
      }, 1000);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        quantity: '1',
      });
      closeBottomSheet();
      Keyboard.dismiss();
      goBack();
    }
  }, [closeBottomSheet, goBack, isSubmitSuccessful, reset]);

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPointHeigth}>
      <StyledContainer>
        <StyledTitle>Adicionar Produto</StyledTitle>

        {product && (
          <>
            <StyledColumnProduct>
              <StyledImage source={product.image} />

              <StyledColumnProductInfo>
                <StyledTitleProduct>{product.name}</StyledTitleProduct>
                <StyledPriceProduct>
                  {formatedCurrency(product.price)}
                </StyledPriceProduct>
              </StyledColumnProductInfo>
            </StyledColumnProduct>

            <StyledContainerForm>
              <Counter
                name="quantity"
                control={control}
                error={isSubmitted ? errors.quantity?.message : ''}
              />
            </StyledContainerForm>

            <Button title="Adicionar" onPress={handleSubmit(onSubmit)} />
          </>
        )}
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

const StyledContainerForm = styled.View`
  height: 60px;

  margin-bottom: 40px;
`;

const StyledColumnProduct = styled.View`
  height: 136px;

  align-items: center;
  justify-content: center;

  margin: 0 32px 24px;
`;

const StyledColumnProductInfo = styled.View`
  height: 40px;

  justify-content: space-between;
`;

const StyledTitleProduct = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  line-height: 20px;
`;

const StyledPriceProduct = styled(StyledTitleProduct)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
`;

const StyledImage = styled.Image`
  width: 80px;
  height: 80px;

  background-color: ${({ theme }) => theme.colors.SECUNDARY_200};

  margin-bottom: 16px;
`;

export default memo(AddOrderBottomSheetModal);
