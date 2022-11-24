import React, { useCallback } from 'react';
import styled from 'styled-components/native';

import { useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

import Background from '@components/Background';
import Header from '@components/Header';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';
import Input from '@components/Input';
import { useForm } from 'react-hook-form';
import Button from '@components/Button';

export const Payment = () => {
  const { goBack } = useNavigation();

  const { height, width } = useWindowDimensions();

  const { control, handleSubmit } = useForm();

  const onSubmit = useCallback((data: any) => {
    console.log(data);
  }, []);

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
        <Title>Pagemento</Title>
        <Subtitle>Insira seus dados de pagamento</Subtitle>

        <StyledContainerForm>
          <Input name="cardNumber" control={control} label="Numero do cartão" />
          <Input
            name="cardOwner"
            control={control}
            label="Nome impresso no cartão"
          />

          <StyledRowForm>
            <Input
              name="cardValidate"
              control={control}
              label="Data de validade"
              box="firstHalf"
            />
            <Input name="cvc" control={control} label="CVC" box="secondHalf" />
          </StyledRowForm>
        </StyledContainerForm>

        <StyledRowWarning>
          <StyledTextWarning>{`Ao continuar você concorda com nossos `}</StyledTextWarning>
          <StyledButtonLinkTerms>
            <StyledTextLinkTerms>Termos e condições</StyledTextLinkTerms>
          </StyledButtonLinkTerms>
        </StyledRowWarning>
        <Button title="Confirmar" onPress={handleSubmit(onSubmit)} />
      </StyledContainer>
    </Background>
  );
};

const StyledContainer = styled.ScrollView``;

const StyledContainerForm = styled.View`
  margin: 16px 0 48px 0;
`;

const StyledRowForm = styled.View`
  flex-direction: row;

  justify-content: space-between;
`;

const StyledRowWarning = styled.View`
  flex-direction: row;

  flex-wrap: wrap;

  margin: 0 32px 32px;
`;

const StyledTextWarning = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
`;

const StyledButtonLinkTerms = styled.TouchableOpacity``;

const StyledTextLinkTerms = styled(StyledTextWarning)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};

  text-decoration: underline;
`;
