/* eslint-disable react/display-name */

import React, { forwardRef, memo, useMemo } from 'react';
import styled from 'styled-components/native';

import { Bill as BillModel } from '@database/models/billModel';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import Button from '@components/Button';
import formatedCurrency from '@utils/formatedCurrency';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { CLOSE_BILL } from '@store/slices/billSlice';
import { useNavigation } from '@react-navigation/native';

interface CloseBillBottomSheetModalProps {
  bill: BillModel;
  totalPriceBill: number;
}

const CloseBillBottomSheetModal = forwardRef<
  BottomSheetModal,
  CloseBillBottomSheetModalProps
>(({ bill, totalPriceBill }, ref) => {
  const dispatch = useReduxDispatch();

  const { goBack } = useNavigation();

  const snapPointHeigth = useMemo(
    () => [16 + 32 + 32 + 40 + 80 + 32 + 44 + 32],
    [],
  );

  const closeBill = () => {
    dispatch(CLOSE_BILL({ bill }));
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

        <Button
          title="Fechar"
          onPress={() => {
            closeBill();
            goBack();
          }}
        />
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

  line-height: 32px;

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
