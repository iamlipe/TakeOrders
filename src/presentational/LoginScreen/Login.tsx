import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, StatusBar } from 'react-native';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import GoogleIcon from '@assets/svgs/google.svg';
import AppleIcon from '@assets/svgs/apple.svg';

import Background from '@components/Background';
import Header from '@components/Header';
import Input from '@components/Input';
import Button from '@components/Button';
import RowOr from '@components/RowOr';

interface FormLogin {
  email: string;
  password: string;
}

const { height } = Dimensions.get('window');

export const Login = () => {
  const { goBack } = useNavigation();

  const { control } = useForm<FormLogin>();

  const { t } = useTranslation();

  return (
    <Background>
      <Header
        onPress={goBack}
        backgroundColor="BACKGROUND_TRANSPARENT"
        type="justBackButton"
      />

      <StyledContent showsVerticalScrollIndicator={false}>
        <StyledContainerIntroduction>
          <StyledTitle>Fazer login</StyledTitle>
          <StyledSubtitle>
            Insira suas credenciais para continuar
          </StyledSubtitle>
        </StyledContainerIntroduction>

        <StyledContainerFormLogin>
          <Input name="email" control={control} label="E-mail" />
          <Input name="password" control={control} label="Senha" />

          <StyledButtonLinkForgotPassword onPress={() => null}>
            <StyledLinkForgotPassword>
              Esqueceu a senha?
            </StyledLinkForgotPassword>
          </StyledButtonLinkForgotPassword>

          <Button title={t('components.button.login')} onPress={() => null} />
        </StyledContainerFormLogin>

        <RowOr />

        <StyledContainerLoginWithGoogleOrApple>
          <Button
            title="Entrar com Google"
            backgroundColor="light"
            fontColor="PRIMARY_TEXT"
            IconComponent={() => (
              <StyledContainerIconButton>
                <GoogleIcon />
              </StyledContainerIconButton>
            )}
            onPress={() => null}
            containerStyle={{ marginBottom: 8 }}
          />
          <Button
            title="Entrar com Apple"
            backgroundColor="light"
            fontColor="PRIMARY_TEXT"
            IconComponent={() => (
              <StyledContainerIconButton>
                <AppleIcon />
              </StyledContainerIconButton>
            )}
            onPress={() => null}
          />
        </StyledContainerLoginWithGoogleOrApple>

        <StyledContainerGoToRegister>
          <StyledTextAlreadyRegister>
            {`Não tem uma conta? `}
          </StyledTextAlreadyRegister>

          <StyledButtonLinkRegister onPress={() => null}>
            <StyledLinkRegister>Registre-se agora</StyledLinkRegister>
          </StyledButtonLinkRegister>
        </StyledContainerGoToRegister>
      </StyledContent>
    </Background>
  );
};

const StyledContent = styled.ScrollView``;

const StyledContainerIntroduction = styled.View`
  margin-bottom: 48px;
`;

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

  margin: 0 32px;
`;

const StyledContainerFormLogin = styled.View``;

const StyledButtonLinkForgotPassword = styled.TouchableOpacity`
  align-self: flex-end;

  margin: 0 32px 16px;
`;

const StyledLinkForgotPassword = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
`;

const StyledContainerIconButton = styled.View`
  margin-right: 10px;
`;

const StyledContainerLoginWithGoogleOrApple = styled.View`
  margin-bottom: 48px;
`;

const StyledContainerGoToRegister = styled.View`
  flex-direction: row;

  justify-content: center;

  margin-bottom: 16px;
`;

const StyledTextAlreadyRegister = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
`;

const StyledButtonLinkRegister = styled.TouchableOpacity`
  align-self: center;
`;

const StyledLinkRegister = styled(StyledTextAlreadyRegister)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
`;
