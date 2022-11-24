import React from 'react';
import styled from 'styled-components/native';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useWindowDimensions } from 'react-native';

import Background from '@components/Background';
import Button from '@components/Button';
import Header from '@components/Header';
import Input from '@components/Input';
import Subtitle from '@components/Subtitle';
import Title from '@components/Title';

export const RememberOrChangePassword = () => {
  const { height } = useWindowDimensions();

  const { goBack } = useNavigation();

  const { control } = useForm();

  return (
    <Background>
      <StyledContainer
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
        <Title>Esqueceu sua senha</Title>
        <Subtitle>Preencha o campo abaixo com seu e-mail</Subtitle>

        <StyledContainerForm>
          <Input name="email" control={control} label="E-mail" />
        </StyledContainerForm>

        <Button title="Enviar" onPress={() => null} />
      </StyledContainer>
    </Background>
  );
};

const StyledContainer = styled.ScrollView``;

const StyledContainerForm = styled.View`
  margin: 16px 0 48px;
`;
