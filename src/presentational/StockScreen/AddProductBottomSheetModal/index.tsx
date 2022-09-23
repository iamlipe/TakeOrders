/* eslint-disable react/display-name */
import React, { forwardRef, memo, useEffect, useMemo } from 'react';
import styled from 'styled-components/native';
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Product } from '@database/models/productModel';

import Input from '@components/Input';
import Button from '@components/Button';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { CREATE_PRODUCT_PURCHASE } from '@store/slices/purchaseSlice';
import { GET_PRODUCT_BY_ID, UPDATE_PRODUCT } from '@store/slices/productSlice';

interface AddProductBottomSheetModalProps {
  productId: string | null;
}

interface FormAddNewPurchase {
  quntity: string;
  totalPrice: string;
}

const schema = Yup.object().shape({
  quantity: Yup.string().required('Preenchimento obrigatório'),
  totalPrice: Yup.string().required('Preenchimento obrigatório'),
});

const AddProductBottomSheetModal = forwardRef<
  BottomSheetModal,
  AddProductBottomSheetModalProps
>(({ productId }, ref) => {
  const dispatch = useReduxDispatch();
  const { selectedProduct } = useReduxSelector(state => state.product);
  const { allPurchases } = useReduxSelector(state => state.purchase);
  const { spentId } = useReduxSelector(state => state.spent);

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

  const onSubmit = (data: FormAddNewPurchase) => {
    if (spentId && selectedProduct) {
      dispatch(
        CREATE_PRODUCT_PURCHASE({
          productId: selectedProduct.id,
          spentId,
          totalPrice: Number(data.totalPrice),
        }),
      );

      setTimeout(() => {
        dispatch(
          UPDATE_PRODUCT({
            product: selectedProduct,
            updatedProduct: {
              quantity: selectedProduct.quantity + Number(data.quntity),
            },
          }),
        );
      }, 1000);
    }
  };

  useEffect(() => {
    if (productId) {
      dispatch(GET_PRODUCT_BY_ID({ productId }));
    }
  });

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPointHeigth}>
      <StyledContainer>
        <StyledTitle>Adicionar produto</StyledTitle>

        {selectedProduct && (
          <StyledContainerProductInfo>
            <StyledImage />
            <StyledColumnInfoProduct>
              <StyledTitleProduct>{selectedProduct.name}</StyledTitleProduct>
              <StyledDescriptionProduct>{`Quantidade em stock: ${selectedProduct.quantity}`}</StyledDescriptionProduct>
            </StyledColumnInfoProduct>
          </StyledContainerProductInfo>
        )}

        <StyledContainerForm>
          <Input name="quantity" control={control} label="Quantidade" />
          <Input name="totalPrice" control={control} label="Preço total" />
        </StyledContainerForm>

        <Button title="Adicionar" onPress={handleSubmit(onSubmit)} />
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
