import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, useWindowDimensions } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@routes/stacks/AuthStack';

import Header from '@components/Header';
import Background from '@components/Background';
import Input from '@components/Input';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';
import { GlobalStackParamList } from '@routes/stacks/GlobalStack';

interface FormRegister {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type NavPropsAuthStack = NativeStackNavigationProp<AuthStackParamList>;
type NavPropsGlobalStack = NativeStackNavigationProp<GlobalStackParamList>;

export const Register = () => {
  const { height } = useWindowDimensions();

  const { goBack, navigate: navigateAuthStack } =
    useNavigation<NavPropsAuthStack>();
  const { navigate: navigateGlobalStack } =
    useNavigation<NavPropsGlobalStack>();

  const { t } = useTranslation();

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
    navigateAuthStack('Login');
  }, [navigateAuthStack]);

  const navigateToVerifyPhoneOrEmail = useCallback(() => {
    navigateGlobalStack('VerifyPhoneOrEmail');
  }, [navigateGlobalStack]);

  const onSubmit = useCallback(
    (data: FormRegister) => {
      navigateToVerifyPhoneOrEmail();
    },
    [navigateToVerifyPhoneOrEmail],
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });

      Keyboard.dismiss();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Background>
      <StyledContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: height - 24,
        }}
      >
        <Header
          onPress={goBack}
          backgroundColor="BACKGROUND_TRANSPARENT"
          type="justBackButton"
        />
        <StyledContainerIntroduction>
          <Title>Register</Title>
          <StyledRowSubtitle>
            <Subtitle>{'Você já tem uma conta? '}</Subtitle>
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
            passowrd
            secureTextEntry
          />

          <Input
            name="confirmPassword"
            control={control}
            label="Confirmar senha"
            error={isSubmitted ? errors.confirmPassword?.message : ''}
            secureTextEntry
          />
        </StyledContainerFormRegister>

        <Checkbox options={['Aceito os termos e a política de privacidade']} />

        <Button title="Continuar" onPress={handleSubmit(onSubmit)} />
      </StyledContent>
    </Background>
  );
};

const StyledContent = styled.ScrollView``;

const StyledContainerIntroduction = styled.View`
  margin-bottom: 48px;
`;

const StyledContainerFormRegister = styled.View`
  margin-bottom: 16px;
`;

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
