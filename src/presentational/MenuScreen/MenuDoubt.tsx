import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Header from '@components/Header';
import Background from '@components/Background';

type StackParamsList = {
  Info: {
    question: string;
    answer: string;
  };
};

export const MenuDoubt = () => {
  const { goBack } = useNavigation();

  const { question, answer } =
    useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <Background>
      <Header
        title={t('components.header.menuDoubt')}
        backgroundColor="SECUNDARY_600"
        onPress={goBack}
        type="small"
      />

      <StyledContent>
        <StyledContainerDoubt>
          <StyledTextQuestion>{question}</StyledTextQuestion>
          <StyledTextAnswer>{answer}</StyledTextAnswer>
        </StyledContainerDoubt>
      </StyledContent>
    </Background>
  );
};

const StyledContent = styled.View`
  padding: 32px;
`;

const StyledContainerDoubt = styled.View``;

const StyledTextQuestion = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-bottom: 8px;
`;

const StyledTextAnswer = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;
