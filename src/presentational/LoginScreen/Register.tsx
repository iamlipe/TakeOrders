import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@routes/stacks/AuthStack';

import { Keyboard } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '@components/Header';
import Background from '@components/Background';
import Input from '@components/Input';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';

interface FormRegister {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ValidatePassword {
  key: number;
  validate:
    | 'atLeastEightChar'
    | 'atLeastOneUpperCaseWord'
    | 'atLeastOneNumber'
    | 'atLeastOneSpecialChar';
  description: string;
}

type NavProps = NativeStackNavigationProp<AuthStackParamList>;

export const Register = () => {
  const [validatePassword, setValidatePassword] = useState({
    atLeastEightChar: false,
    atLeastOneUpperCaseWord: false,
    atLeastOneNumber: false,
    atLeastOneSpecialChar: false,
  });

  const { goBack, navigate } = useNavigation<NavProps>();

  const { t } = useTranslation();

  const theme = useTheme();

  const dataValidatePassword: ValidatePassword[] = useMemo(
    () => [
      {
        key: 0,
        validate: 'atLeastEightChar',
        description: 'deve conter ao menos 8 caracteres',
      },
      {
        key: 1,
        validate: 'atLeastOneUpperCaseWord',
        description: 'deve conter ao menos 1 letra minúscula',
      },
      {
        key: 2,
        validate: 'atLeastOneNumber',
        description: 'deve conter ao menos 1 número',
      },
      {
        key: 3,
        validate: 'atLeastOneSpecialChar',
        description: 'deve conter ao menos 1 caractere especial',
      },
    ],
    [],
  );

  const schema = useMemo(
    () =>
      yup.object().shape({
        firstName: yup.string().min(3).required(t('errors.required')),
        lastName: yup.string().min(3).required(t('errors.required')),
        email: yup.string().email().required(t('errors.required')),
        phone: yup
          .string()
          .matches(
            /^\(([0-9]{2})\) ([0-9]{4,5})-([0-9]{4})$/,
            t('errors.validPhone'),
          )
          .required(t('errors.required')),
        password: yup.string().required(t('errors.required')),
        confirmPassword: yup
          .string()
          .when('password', (password, field) =>
            password ? field.required().oneOf([yup.ref('password')]) : field,
          )
          .required(t('errors.required')),
      }),
    [t],
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<FormRegister>({
    resolver: yupResolver(schema),
  });

  const navigateToLogin = useCallback(() => {
    navigate('Login');
  }, [navigate]);

  const handleValidatePassword = useCallback(
    (text: string) => {
      if (text.match(/^.{8,}$/)) {
        setValidatePassword({ ...validatePassword, atLeastEightChar: true });
      } else {
        setValidatePassword({ ...validatePassword, atLeastEightChar: false });
      }
    },
    [validatePassword],
  );

  const onSubmit = useCallback((data: FormRegister) => {
    console.log(data);
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phone: undefined,
        password: undefined,
        confirmPassword: undefined,
      });

      Keyboard.dismiss();
    }
  }, [isSubmitSuccessful, reset]);

  const renderItemValidatePassword = ({
    key,
    validate,
    description,
  }: ValidatePassword) => {
    const isValid = validatePassword[validate];

    return (
      <StyledRowValidatePassword key={key}>
        <Icon
          name={isValid ? 'check-circle-outline' : 'remove-circle-outline'}
          color={isValid ? theme.colors.SUCCESS_600 : theme.colors.ERROR_300}
          size={16}
        />
        <StyledTextValidatePassword>{description}</StyledTextValidatePassword>
      </StyledRowValidatePassword>
    );
  };

  return (
    <Background>
      <Header
        onPress={goBack}
        backgroundColor="BACKGROUND_TRANSPARENT"
        type="justBackButton"
      />

      <StyledContent showsVerticalScrollIndicator={false}>
        <StyledContainerIntroduction>
          <StyledTitle>Register</StyledTitle>
          <StyledRowSubtitle>
            <StyledSubtitle>{'Você já tem uma conta? '}</StyledSubtitle>
            <StyledButtonLinkLogin onPress={navigateToLogin}>
              <StyledTextLinkLogin>Faça login</StyledTextLinkLogin>
            </StyledButtonLinkLogin>
          </StyledRowSubtitle>
        </StyledContainerIntroduction>

        <StyledContainerFormRegister>
          <Input
            name="firstName"
            control={control}
            label="Nome"
            error={isSubmitted ? errors.firstName?.message : ''}
          />
          <Input
            name="lastName"
            control={control}
            label="Sobrenome"
            error={isSubmitted ? errors.lastName?.message : ''}
          />
          <Input
            name="email"
            control={control}
            label="E-mail"
            error={isSubmitted ? errors.email?.message : ''}
          />
          <Input
            name="phone"
            control={control}
            label="Telefone"
            error={isSubmitted ? errors.phone?.message : ''}
            type="cel-phone"
          />
          <Input
            name="password"
            control={control}
            label="Senha"
            error={isSubmitted ? errors.password?.message : ''}
            onChangeText={handleValidatePassword}
          />

          <StyledContainerValidatePassword>
            {dataValidatePassword.map(validate =>
              renderItemValidatePassword(validate),
            )}
          </StyledContainerValidatePassword>

          <Input
            name="confirmPassword"
            control={control}
            label="Confirmar senha"
            error={isSubmitted ? errors.confirmPassword?.message : ''}
          />
        </StyledContainerFormRegister>

        <Checkbox options={['Aceito os termos e a política de privacidade']} />

        <Button title="Continuar" onPress={handleSubmit(onSubmit)} />
      </StyledContent>
    </Background>
  );
};

const StyledContent = styled.ScrollView``;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};

  margin: 0 32px 8px;
`;

const StyledSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.SECUNDARY_TEXT};
`;

const StyledContainerIntroduction = styled.View`
  margin-bottom: 48px;
`;

const StyledContainerFormRegister = styled(StyledContainerIntroduction)``;

const StyledRowSubtitle = styled.View`
  flex-direction: row;

  margin: 0 32px;
`;

const StyledButtonLinkLogin = styled.TouchableOpacity``;

const StyledTextLinkLogin = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.PRIMARY_500};
`;

const StyledContainerValidatePassword = styled.View`
  margin: 0 32px 12px;
`;

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
