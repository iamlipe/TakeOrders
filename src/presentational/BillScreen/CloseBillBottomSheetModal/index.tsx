import React, { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components/native';

import { Bill as BillModel } from '@database/models/billModel';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useNavigation } from '@react-navigation/native';
import { useReduxSelector } from '@hooks/useReduxSelector';

import { CLOSE_BILL } from '@store/slices/billSlice';
import { CREATE_SALE } from '@store/slices/saleSlice';

import formatedCurrency from '@utils/formatedCurrency';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import Button from '@components/Button';
import { RFValue } from 'react-native-responsive-fontsize';

interface CloseBillBottomSheetModalProps {
  bill: BillModel;
  totalPriceBill: number;
}

const CloseBillBottomSheetModal = forwardRef<
  BottomSheetModal,
  CloseBillBottomSheetModalProps
>(({ bill, totalPriceBill }, ref) => {
  const [loadingCloseBill, setLoadingCloseBill] = useState(false);

  const dispatch = useReduxDispatch();

  const { auth } = useReduxSelector(state => state.user);

  const { goBack } = useNavigation();

  const snapPointHeigth = useMemo(
    () => [16 + 32 + RFValue(32) + 40 + 80 + 32 + 44 + 32],
    [],
  );

  const closeBill = useCallback(() => {
    dispatch(CLOSE_BILL({ bill }));
  }, [bill, dispatch]);

  const createSale = useCallback(() => {
    if (auth) {
      dispatch(
        CREATE_SALE({
          name: `venda ${bill.name}`,
          totalPrice: totalPriceBill,
          userId: auth.id,
        }),
      );
    }
  }, [auth, bill.name, dispatch, totalPriceBill]);

  const onSubmit = () => {
    setLoadingCloseBill(true);

    setTimeout(() => closeBill(), 500);

    setTimeout(() => createSale(), 1000);

    setTimeout(() => {
      setLoadingCloseBill(false);
      goBack();
    }, 1500);
  };

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPointHeigth}>
      <StyledContainer>
        <StyledTitle>Finalizar Comanda</StyledTitle>

        <StyledContainerBillInfo>
          <StyledRow>
            <StyledText>Cliente</StyledText>
            <StyledText>{bill.name}</StyledText>
          </StyledRow>

          <StyledRow>
            <StyledText>Total:</StyledText>
            <StyledTextTotal>
              {formatedCurrency(totalPriceBill)}
            </StyledTextTotal>
          </StyledRow>
        </StyledContainerBillInfo>

        <Button title="Fechar" onPress={onSubmit} loading={loadingCloseBill} />
      </StyledContainer>
    </BottomSheetModal>
  );
});

const StyledContainer = styled.View`
  padding: 16px 0 48px 0;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  line-height: ${RFValue(32)}px;

  margin-bottom: 40px;
`;

const StyledContainerBillInfo = styled.View`
  height: 80px;

  justify-content: space-evenly;

  padding: 0 32px;
  margin-bottom: 32px;
`;

const StyledRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledTextTotal = styled(StyledText)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
`;

export default memo(CloseBillBottomSheetModal);
