import React, { useCallback } from 'react';
import styled from 'styled-components/native';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@routes/stacks/AuthStack';

import { Dimensions } from 'react-native';

import Header from '@components/Header';
import Background from '@components/Background';
import Input from '@components/Input';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';

interface FormRegister {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type NavProps = NativeStackNavigationProp<AuthStackParamList>;

export const Register = () => {
  const { goBack, navigate } = useNavigation<NavProps>();

  const { control } = useForm<FormRegister>();

  const navigateToLogin = useCallback(() => {
    navigate('Login');
  }, [navigate]);

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
          <Input name="firstName" control={control} label="Nome" />
          <Input name="lastName" control={control} label="Sobrenome" />
          <Input name="email" control={control} label="E-mail" />
          <Input name="phone" control={control} label="Telefone" />
          <Input name="password" control={control} label="Senha" />
          <Input
            name="confirmPassword"
            control={control}
            label="Confirmar senha"
          />
        </StyledContainerFormRegister>

        <Checkbox options={['Aceito os termos e a política de privacidade']} />

        <Button title="Continuar" onPress={() => null} />
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
