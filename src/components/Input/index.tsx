/* eslint-disable react/display-name */

import React, { forwardRef, memo, useCallback, useEffect } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInputProps } from 'react-native';
import {
  TextInputMask,
  TextInputMaskTypeProp,
  TextInputMaskOptionProp,
} from 'react-native-masked-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useController } from 'react-hook-form';
import { RFValue } from 'react-native-responsive-fontsize';

interface InputProps extends TextInputProps {
  name: string;
  control: any;
  label: string;
  error?: string;
  type?: TextInputMaskTypeProp;
  options?: TextInputMaskOptionProp;
}

const Input = forwardRef<any, InputProps>(
  ({ name, control, label, error, type, options, ...rest }, ref) => {
    const theme = useTheme();

    const {
      field: { onChange, value },
    } = useController({ name, control });

    return (
      <StyledContainer>
        <StyledContent style={{ elevation: 2 }}>
          <StyledRow>
            {type ? (
              <StyledInputMask
                {...rest}
                ref={ref}
                type={type}
                options={options}
                onChangeText={onChange}
                placeholder={label}
                placeholderTextColor={theme.colors.GRAY_600}
                value={value}
              />
            ) : (
              <StyledInputText
                {...rest}
                ref={ref}
                onChangeText={onChange}
                placeholder={label}
                placeholderTextColor={theme.colors.GRAY_600}
                value={value}
              />
            )}

            {error && (
              <StyledIconError
                name="error-outline"
                size={16}
                color={theme.colors.ERROR_300}
              />
            )}
          </StyledRow>
        </StyledContent>
        {error && <StyledError>{error}</StyledError>}
      </StyledContainer>
    );
  },
);

const StyledContainer = styled.View`
  margin: 0 32px;

  margin-bottom: 12px;
`;

const StyledContent = styled.View`
  width: 100%;
  height: 44px;

  justify-content: center;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 0 16px;
`;

const StyledRow = styled.View`
  flex-direction: row;
`;

const StyledInputText = styled.TextInput`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding: 0;
`;

const StyledInputMask = styled(TextInputMask)`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding: 0;
`;

const StyledError = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.ERROR_500};

  align-self: flex-end;

  margin: 0;
`;

const StyledIconError = styled(Icon)`
  align-self: center;
`;

export default memo(Input);
