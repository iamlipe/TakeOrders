import React, { memo, useLayoutEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useWindowDimensions } from 'react-native';

import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ValidatePassword {
  key: number;
  validate:
    | 'atLeastEightChar'
    | 'atLeastOneLowerCaseWord'
    | 'atLeastOneUpperCaseWord'
    | 'atLeastOneNumber'
    | 'atLeastOneSpecialChar';
  description: string;
}

interface StrenghtPasswordProps {
  password: string;
}

const StrenghtPassword = ({ password }: StrenghtPasswordProps) => {
  const widhtBarStrengthPassword = useSharedValue(0);

  const { width } = useWindowDimensions();

  const theme = useTheme();

  const atLeastOneUppercase = useMemo(() => /[A-Z]/g, []); // capital letters from A to Z
  const atLeastOneLowercase = useMemo(() => /[a-z]/g, []); // small letters from a to z
  const atLeastOneNumeric = useMemo(() => /[0-9]/g, []); // numbers from 0 to 9
  const atLeastOneSpecialChar = useMemo(() => /[#?!@$%^&*-]/g, []); // any of the special characters within the square brackets
  const eightCharsOrMore = useMemo(() => /.{8,}/g, []); // eight characters or more

  const dataValidatePassword: ValidatePassword[] = useMemo(
    () => [
      {
        key: 0,
        validate: 'atLeastEightChar',
        description: 'deve conter ao menos 8 caracteres',
      },
      {
        key: 1,
        validate: 'atLeastOneLowerCaseWord',
        description: 'deve conter ao menos 1 letra minúscula',
      },
      {
        key: 2,
        validate: 'atLeastOneUpperCaseWord',
        description: 'deve conter ao menos 1 letra maiúscula',
      },
      {
        key: 3,
        validate: 'atLeastOneNumber',
        description: 'deve conter ao menos 1 número',
      },
      {
        key: 4,
        validate: 'atLeastOneSpecialChar',
        description: 'deve conter ao menos 1 caractere especial',
      },
    ],
    [],
  );

  const validatePassword = useMemo(() => {
    return {
      atLeastOneUpperCaseWord: password
        ? password.match(atLeastOneUppercase)
        : false,
      atLeastOneLowerCaseWord: password
        ? password.match(atLeastOneLowercase)
        : false,
      atLeastOneNumber: password ? password.match(atLeastOneNumeric) : false,
      atLeastOneSpecialChar: password
        ? password.match(atLeastOneSpecialChar)
        : false,
      atLeastEightChar: password ? password.match(eightCharsOrMore) : false,
    };
  }, [
    atLeastOneLowercase,
    atLeastOneNumeric,
    atLeastOneSpecialChar,
    atLeastOneUppercase,
    eightCharsOrMore,
    password,
  ]);

  const passwordStrength = useMemo(
    () => Object.values(validatePassword).filter(value => value).length,
    [validatePassword],
  );

  const styledBarStrenghtPassword = useAnimatedStyle(() => {
    const colors = [
      theme.colors.WHITE,
      theme.colors.ERROR_500,
      theme.colors.SECUNDARY_500,
      '#03a2cc',
      '#03a2cc',
      theme.colors.SUCCESS_500,
    ];

    return {
      width: `${widhtBarStrengthPassword.value}%`,
      backgroundColor: colors[passwordStrength],
    };
  });

  useLayoutEffect(() => {
    widhtBarStrengthPassword.value = withTiming(
      passwordStrength !== 0 ? (passwordStrength / 5) * 100 : 0,
      {
        duration: width * 0.2,
      },
    );
  }, [passwordStrength, widhtBarStrengthPassword, width]);

  const renderItemValidatePassword = ({
    key,
    validate,
    description,
  }: ValidatePassword) => {
    const isValid = validatePassword[validate];

    return (
      <StyledRowValidatePassword key={key}>
        <FontAwesomeIcons
          name={isValid ? 'check' : 'close'}
          color={isValid ? theme.colors.SUCCESS_500 : theme.colors.ERROR_500}
          size={16}
        />
        <StyledTextValidatePassword>{description}</StyledTextValidatePassword>
      </StyledRowValidatePassword>
    );
  };

  return (
    <>
      <StyledContainerBarStrength style={{ elevation: 2 }}>
        <StyledBarStrength style={[styledBarStrenghtPassword]} />
      </StyledContainerBarStrength>

      <StyledContainerRequirementsPassword>
        {dataValidatePassword.map(validate =>
          renderItemValidatePassword(validate),
        )}
      </StyledContainerRequirementsPassword>
    </>
  );
};

const StyledContainerRequirementsPassword = styled.View``;

const StyledRowValidatePassword = styled.View`
  flex-direction: row;

  align-items: center;

  margin-bottom: 2px;
`;

const StyledTextValidatePassword = styled.Text`
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};

  margin-left: 2px;
`;

const StyledContainerBarStrength = styled.View`
  height: 8px;
  width: 100%;

  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.WHITE};

  margin: 8px 0;
`;

const StyledBarStrength = styled(Animated.View)`
  height: 100%;

  border-radius: 4px;
`;

export default memo(StrenghtPassword);
