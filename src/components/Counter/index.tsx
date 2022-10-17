/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';

import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface CounterProps {
  name: string;
  control: any;
  error?: string;
  maxQuantity?: number;
}

const Counter = ({ maxQuantity, name, control, error }: CounterProps) => {
  const [counter, setCounter] = useState(1);

  const { t } = useTranslation();

  const theme = useTheme();

  const {
    field: { onChange },
  } = useController({ name, control });

  useEffect(() => {
    onChange(1);
  }, [onChange]);

  return (
    <StyledContainer>
      <StyledTitle>{t('components.counter.quantity')}</StyledTitle>
      <StyledContent>
        <StyledBaseButton>
          <Icon
            testID="decrement-button"
            name="minus"
            color={theme.colors.PRIMARY_500}
            size={18}
            onPress={() => {
              const newCounter = counter - 1 < 1 ? 1 : counter - 1;

              setCounter(newCounter);
              onChange(newCounter);
            }}
          />
        </StyledBaseButton>
        <StyledInputCounter value={String(counter)} editable={false} />
        <StyledBaseButton>
          <Icon
            testID="increment-button"
            name="plus"
            color={theme.colors.PRIMARY_500}
            size={18}
            onPress={() => {
              if (maxQuantity) {
                const newCounter =
                  counter + 1 > maxQuantity ? maxQuantity : counter + 1;

                setCounter(newCounter);
                onChange(newCounter);
              } else {
                const newCounter = counter + 1;

                setCounter(newCounter);
                onChange(newCounter);
              }
            }}
          />
        </StyledBaseButton>
      </StyledContent>
      {error && <StyledError>{error}</StyledError>}
    </StyledContainer>
  );
};

const StyledContainer = styled.View``;

const StyledContent = styled.View`
  height: 40px;
  width: 118px;

  flex-direction: row;
  align-self: center;
  justify-content: space-between;
  align-items: center;

  border: 1px solid ${({ theme }) => theme.colors.PRIMARY_500};
  border-radius: 20px;

  background-color: ${({ theme }) => theme.colors.PRIMARY_200};

  padding: 0px 10px;
`;

const StyledInputCounter = styled.TextInput`
  width: 40px;

  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.PRIMARY_500};

  text-align: center;

  padding: 0;
`;

const StyledBaseButton = styled.TouchableOpacity``;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-bottom: 4px;
`;

const StyledError = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.ERROR_500};

  align-self: center;

  line-height: 16px;

  margin-top: 8px;
  margin-bottom: -24px;
`;

export default memo(Counter);
