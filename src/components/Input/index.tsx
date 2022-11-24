/* eslint-disable react/display-name */

import React, { forwardRef, memo, useCallback, useState } from 'react';
import styled, { useTheme, css } from 'styled-components/native';

import { useController } from 'react-hook-form';

import { Dimensions, TextInputProps, ViewStyle } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TextInputMask,
  TextInputMaskTypeProp,
  TextInputMaskOptionProp,
} from 'react-native-masked-text';

import StrenghtPassword from './StrenghtPassword';

const { width } = Dimensions.get('window');

const containerType = {
  full: css`
    margin: 0 32px 12px;
  `,

  firstHalf: css`
    width: ${(width - 64) * 0.49}px;
    margin: 0 0 12px 32px;
  `,

  secondHalf: css`
    width: ${(width - 64) * 0.49}px;
    margin: 0 32px 12px 0;
  `,
};

interface ContainerProps {
  box: keyof typeof containerType;
}

interface InputProps extends TextInputProps {
  name: string;
  control: any;
  label: string;
  error?: string;
  type?: TextInputMaskTypeProp;
  options?: TextInputMaskOptionProp;
  passowrd?: boolean;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  box?: keyof typeof containerType;
}

const Input = forwardRef<any, InputProps>(
  (
    {
      name,
      control,
      label,
      error,
      type,
      options,
      passowrd = false,
      secureTextEntry = false,
      containerStyle = {},
      box = 'full',
      ...rest
    },
    ref,
  ) => {
    const [securityText, setSecurityText] = useState(secureTextEntry);
    const [showRequirementsPassword, setShowRequirementsPassoword] =
      useState(false);

    const theme = useTheme();

    const {
      field: { onChange, value },
    } = useController({ name, control });

    const handleText = useCallback(
      (text: string) => {
        onChange(text);
      },
      [onChange],
    );

    const handleShowRequirementsPassword = useCallback(
      (show: boolean) => {
        if (passowrd) {
          setShowRequirementsPassoword(show);
        }
      },
      [passowrd],
    );

    return (
      <StyledContainer box={box} style={[containerStyle]}>
        <StyledContent style={{ elevation: 1 }}>
          <StyledRow>
            {type ? (
              <StyledInputMask
                {...rest}
                ref={ref}
                type={type}
                options={options}
                onChangeText={handleText}
                onFocus={() => handleShowRequirementsPassword(true)}
                onBlur={() => handleShowRequirementsPassword(false)}
                placeholder={label}
                placeholderTextColor={theme.colors.GRAY_600}
                value={value}
              />
            ) : (
              <StyledInputText
                {...rest}
                ref={ref}
                onChangeText={handleText}
                placeholder={label}
                placeholderTextColor={theme.colors.GRAY_600}
                onFocus={() => handleShowRequirementsPassword(true)}
                onBlur={() => handleShowRequirementsPassword(false)}
                secureTextEntry={securityText}
                value={value}
              />
            )}

            {secureTextEntry && (
              <StyledBaseButton onPress={() => setSecurityText(!securityText)}>
                <Ionicons
                  name={securityText ? 'eye' : 'eye-off'}
                  size={18}
                  color={theme.colors.GRAY_600}
                  style={{ marginHorizontal: 2 }}
                />
              </StyledBaseButton>
            )}

            {error && (
              <MaterialIcons
                name="error-outline"
                size={18}
                color={theme.colors.ERROR_300}
                style={{ marginHorizontal: 2, alignSelf: 'center' }}
              />
            )}
          </StyledRow>
        </StyledContent>

        {error && !passowrd && <StyledError>{error}</StyledError>}

        {showRequirementsPassword && passowrd && (
          <StrenghtPassword password={value} />
        )}
      </StyledContainer>
    );
  },
);

const StyledContainer = styled.View<ContainerProps>`
  ${({ box }) =>
    css`
      ${containerType[box]},
    `};
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

const StyledBaseButton = styled.TouchableOpacity`
  justify-content: center;
`;

export default memo(Input);
