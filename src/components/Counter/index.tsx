/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';

import { useController } from 'react-hook-form';

interface CounterProps {
  name: string;
  control: any;
  maxQuantity?: number;
}

const Counter = ({ maxQuantity, name, control }: CounterProps) => {
  const [counter, setCounter] = useState(0);
  const theme = useTheme();

  const {
    field: { onChange },
  } = useController({ name, control });

  return (
    <>
      <StyledTitle>Quantidade</StyledTitle>
      <StyledContainer>
        <StyledBaseButton>
          <Icon
            testID="decrement-button"
            name="minus"
            color={theme.colors.PRIMARY_500}
            size={18}
            onPress={() => {
              const newCounter = counter - 1 < 0 ? 0 : counter - 1;

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
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.View`
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

export default memo(Counter);
