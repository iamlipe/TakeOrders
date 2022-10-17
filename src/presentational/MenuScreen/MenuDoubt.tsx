import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';

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

  const theme = useTheme();

  const renderContent = () => {
    return (
      <StyledContent>
        <StyledContainerDoubt>
          <StyledTextQuestion>{question}</StyledTextQuestion>
          <StyledTextAnswer>{answer}</StyledTextAnswer>
        </StyledContainerDoubt>
      </StyledContent>
    );
  };

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title="Dúvida" backgroundColor="SECUNDARY_600" onPress={goBack} />

      {useMemo(renderContent, [answer, question])}
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

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
