import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '@components/Header';
import Background from '@components/Background';
import Button from '@components/Button';

export const CheckoutPayment = () => {
  const { height } = useWindowDimensions();

  const { goBack } = useNavigation();

  const theme = useTheme();

  return (
    <Background>
      <StyledContainer>
        <Header
          onPress={goBack}
          backgroundColor="BACKGROUND_TRANSPARENT"
          type="justBackButton"
        />

        <StyledContent style={{ height: height - 100 - 16 - 16 - 46 - 48 }}>
          <Ionicons
            name="ios-checkmark-circle"
            size={RFValue(120)}
            color={theme.colors.SUCCESS_500}
          />
          <StyledTitle>Pronto!</StyledTitle>
          <StyledDescription>Seu pagmento foi aprovado</StyledDescription>
        </StyledContent>

        <Button title="Confirmar" onPress={() => null} />
      </StyledContainer>
    </Background>
  );
};

const StyledContainer = styled.View`
  width: 100%;
  height: 100%;
`;

const StyledContent = styled.View`
  align-items: center;
  justify-content: center;

  margin-bottom: 16px;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
`;

const StyledDescription = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.SECUNDARY_TEXT};
`;
