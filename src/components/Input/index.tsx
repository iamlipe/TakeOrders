/* eslint-disable react/display-name */

import React, { forwardRef, memo, useCallback } from 'react';
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

interface InputProps extends TextInputProps {
  name: string;
  control: any;
  label: string;
  error?: string;
  type?: TextInputMaskTypeProp;
  options?: TextInputMaskOptionProp;
}

const Input = forwardRef<TextInputMask, InputProps>(
  ({ name, control, label, error, type, options }: InputProps, ref) => {
    const theme = useTheme();

    const labelTraslateY = useSharedValue(0);
    const labelFontSize = useSharedValue(14);

    const {
      field: { onChange, value },
    } = useController({ name, control });

    const handleFocus = useCallback(
      (editing: boolean) => {
        if (editing) {
          labelTraslateY.value = withTiming(-12, { duration: 100 });
          labelFontSize.value = withTiming(10, { duration: 100 });
        } else {
          labelTraslateY.value = withTiming(0, { duration: 100 });
          labelFontSize.value = withTiming(12, { duration: 100 });
        }
      },
      [labelFontSize, labelTraslateY],
    );

    const animatedStyleLabel = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: labelTraslateY.value }],
        fontSize: labelFontSize.value,
      };
    });

    return (
      <StyledContainer>
        <StyledContent style={{ elevation: 2 }}>
          <StyledLabel style={animatedStyleLabel}>{label}</StyledLabel>
          <StyledRow>
            {type ? (
              <StyledInputMask
                ref={ref}
                type={type}
                options={options}
                onChangeText={onChange}
                onFocus={() => handleFocus(true)}
                onBlur={() => {
                  if (value === '') handleFocus(false);
                }}
                value={value}
              />
            ) : (
              <StyledInputText
                ref={ref}
                onChangeText={onChange}
                onFocus={() => handleFocus(true)}
                onBlur={() => {
                  if (value === '') handleFocus(false);
                }}
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
        <StyledError>{error}</StyledError>
      </StyledContainer>
    );
  },
);

const StyledContainer = styled.View`
  margin: 0 32px;
`;

const StyledContent = styled.View`
  width: 100%;
  height: 45px;

  justify-content: center;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 0 16px;
`;

const StyledRow = styled.View`
  flex-direction: row;
`;

const StyledLabel = styled(Animated.Text)`
  position: absolute;
  z-index: -1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};

  color: ${({ theme }) => theme.colors.GRAY_800};

  opacity: 0.4;

  padding-left: 16px;
`;

const StyledInputText = styled.TextInput`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding: 0;
  margin-top: 12px;
`;

const StyledInputMask = styled(TextInputMask)`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding: 0;
  margin-top: 12px;
`;

const StyledError = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.ERROR_500};

  align-self: flex-end;
`;

const StyledIconError = styled(Icon)`
  align-self: center;
`;

export default memo(Input);
