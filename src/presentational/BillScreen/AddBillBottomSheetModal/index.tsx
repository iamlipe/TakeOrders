/* eslint-disable react/display-name */

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import styled from 'styled-components/native';
import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { CREATE_BILL, GET_BILLS } from '@store/slices/billSlice';

import { Keyboard } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import Input from '@components/Input';
import Button from '@components/Button';

const schema = Yup.object().shape({
  name: Yup.string().required('Preenchimento obrigatório'),
  phone: Yup.string().matches(
    /^\(([0-9]{2})\) ([0-9]{4,5})-([0-9]{4})$/,
    'Insira um numero de celular valido',
  ),
});

interface FormAddNewBill {
  name: string;
  phone?: string;
}

interface AddBillBottomSheetModalProps {
  closeBottomSheet: () => void;
}

const AddBillBottomSheetModal = forwardRef<
  BottomSheetModal,
  AddBillBottomSheetModalProps
>(({ closeBottomSheet }, ref) => {
  const { invoiceId } = useReduxSelector(state => state.invoice);
  const { auth } = useReduxSelector(state => state.user);
  const dispatch = useReduxDispatch();

  const { t } = useTranslation();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<FormAddNewBill>({
    resolver: yupResolver(schema),
  });

  const snapPoints = useMemo(
    () => [16 + 16 + 32 + 24 + 120 + 40 + 44 + 48],
    [],
  );

  const createBill = useCallback(
    (data: FormAddNewBill) => {
      if (invoiceId && auth?.id) {
        dispatch(
          CREATE_BILL({
            client: { name: data.name, phone: data.phone },
            invoiceId,
            userId: auth.id,
          }),
        );

        dispatch(GET_BILLS());
      }
    },
    [auth, dispatch, invoiceId],
  );

  const onSubmit = (data: FormAddNewBill) => {
    createBill(data);
    closeBottomSheet();
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: undefined,
        phone: undefined,
      });

      Keyboard.dismiss();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPoints}>
      <StyledContainer>
        <StyledTitle>
          {t('screens.billHome.addBillBottomSheet.title')}
        </StyledTitle>

        <StyledContainerForm>
          <Input
            name={t('components.input.name')}
            control={control}
            label="Nome"
            error={isSubmitted ? errors.name?.message : ''}
          />
          <Input
            name={t('components.input.phone')}
            control={control}
            label="Celular (Opcional)"
            error={isSubmitted ? errors.phone?.message : ''}
          />
        </StyledContainerForm>

        <Button
          title={t('components.button.add')}
          onPress={handleSubmit(onSubmit)}
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

  margin-bottom: 24px;
`;

const StyledContainerForm = styled.View`
  height: 120px;

  margin-bottom: 40px;
`;

export default memo(AddBillBottomSheetModal);
