import React, { forwardRef, memo, useMemo, useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components/native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '@hooks/useReduxSelector';

import colors from '@styles/colors';

import { CREATE_EXPANSE_PURCHASE } from '@store/slices/purchaseSlice';

import { formatedValue } from '@utils/formatedValueString';

import { Keyboard } from 'react-native';
import { BottomSheetScrollView, BottomSheetModal } from '@gorhom/bottom-sheet';

import Icon from 'react-native-vector-icons/Ionicons';

import Input from '@components/Input';
import { RFValue } from 'react-native-responsive-fontsize';

interface PadNumberProps {
  text?: string;
  icon?: string;
  index: number;
}

interface TextInputValue {
  marginBottom: 4 | 32;
}

interface CirclePadProps {
  backgroundColor: keyof typeof colors;
}

interface FormNewExpansePurchase {
  expanse: string;
}

interface AddPurchaseBottomSheetModalProps {
  closeBottomSheet: () => void;
}

const arrNumPad = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'backspace',
  '0',
  'enter',
];

const AddPurchaseBottomSheetModal = forwardRef<
  BottomSheetModal,
  AddPurchaseBottomSheetModalProps
>(({ closeBottomSheet }, ref) => {
  const [value, setValue] = useState('0');
  const [errorValueInput, setErrorValueInput] = useState('');

  const { spentId } = useReduxSelector(state => state.spent);

  const dispatch = useReduxDispatch();

  const { t } = useTranslation();

  const theme = useTheme();

  const snapPointHeigth = useMemo(() => ['90%'], []);

  const schema = useMemo(
    () =>
      Yup.object().shape({
        expanse: Yup.string().required(t('errors.required')),
      }),
    [t],
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<FormNewExpansePurchase>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormNewExpansePurchase) => {
    if (value === '0') {
      return setErrorValueInput('Digite um valor válido');
    }

    if (spentId) {
      dispatch(
        CREATE_EXPANSE_PURCHASE({
          expanse: data.expanse,
          totalPrice: -Number(value) / 100,
          spentId,
        }),
      );

      closeBottomSheet();
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        expanse: undefined,
      });

      setValue('0');

      Keyboard.dismiss();
    }
  }, [isSubmitSuccessful, reset]);

  const renderPadNumber = ({ text, icon, index }: PadNumberProps) => {
    return (
      <StyledCirclePad
        key={index}
        onPress={
          icon === 'enter'
            ? handleSubmit(onSubmit)
            : () => {
                if (!isNaN(Number(text))) setValue(value + text);
                if (icon === 'backspace' && value !== '0')
                  setValue(value.substring(0, value.length - 1));
              }
        }
        backgroundColor={icon === 'enter' ? 'PRIMARY_500' : 'PRIMARY_200'}
      >
        {icon ? (
          <Icon
            name={
              icon === 'enter'
                ? 'ios-arrow-forward'
                : 'md-return-down-back-sharp'
            }
            color={
              icon === 'enter'
                ? theme.colors.PRIMARY_200
                : theme.colors.PRIMARY_500
            }
            size={24}
          />
        ) : (
          <StyledTextPad>{text}</StyledTextPad>
        )}
      </StyledCirclePad>
    );
  };

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPointHeigth}>
      <StyledContainer>
        <StyledTitle>Adicionar gasto</StyledTitle>

        <StyledLabelInputValue>Valor</StyledLabelInputValue>
        <StyledTextInputValue marginBottom={errorValueInput ? 4 : 32}>
          {formatedValue({ value })}
        </StyledTextInputValue>

        {errorValueInput && (
          <StyledTextError>{errorValueInput}</StyledTextError>
        )}

        <Input
          control={control}
          name="expanse"
          label="Ex: conta de água"
          error={isSubmitted ? errors.expanse?.message : ''}
        />

        <StyledContainerPadNumbers>
          {arrNumPad.map((item, index) =>
            !isNaN(Number(item))
              ? renderPadNumber({ text: item, index })
              : renderPadNumber({ icon: item, index }),
          )}
        </StyledContainerPadNumbers>
      </StyledContainer>
    </BottomSheetModal>
  );
});

const StyledContainer = styled(BottomSheetScrollView)`
  padding: 16px 0 48px;

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

const StyledLabelInputValue = styled(StyledTitle)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};

  line-height: 40px;

  margin-bottom: 16px;
`;

const StyledTextInputValue = styled.Text<TextInputValue>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.LARGER};

  color: ${({ theme }) => theme.colors.PRIMARY_500};

  line-height: 48px;

  text-align: center;

  margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
`;

const StyledTextError = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.ERROR_500};

  align-self: center;

  line-height: 16px;

  margin-bottom: 12px;
`;

const StyledContainerPadNumbers = styled.View`
  width: ${88 * 3}px;
  height: 352px;

  flex-direction: row;
  flex-wrap: wrap;

  align-self: center;

  margin: 16px 0;
`;

const StyledCirclePad = styled.TouchableOpacity<CirclePadProps>`
  height: 64px;
  width: 64px;

  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background-color: ${({ backgroundColor, theme }) =>
    theme.colors[backgroundColor]};

  margin: 12px;
`;

const StyledTextPad = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.PRIMARY_500};
`;

export default memo(AddPurchaseBottomSheetModal);
