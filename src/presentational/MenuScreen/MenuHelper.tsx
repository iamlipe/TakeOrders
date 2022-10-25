import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import Header from '@components/Header';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuStackParamList } from '@routes/stacks/MenuStack';
import { Dimensions } from 'react-native';
import Background from '@components/Background';

interface Doubt {
  id: number;
  question: string;
  answer: string;
}

type NavProps = NativeStackNavigationProp<MenuStackParamList, 'MenuDoubt'>;

export const MenuHelper = () => {
  const { navigate } = useNavigation<NavProps>();
  const { goBack } = useNavigation();

  const { t } = useTranslation();

  const theme = useTheme();

  const doubts: Doubt[] = useMemo(
    () => [
      {
        id: 0,
        question: t('doubts.questions.saveData'),
        answer: t('doubts.answers.saveData'),
      },
      {
        id: 1,
        question: t('doubts.questions.whatHappenWithMyData'),
        answer: t('doubts.answers.whatHappenWithMyData'),
      },
      {
        id: 2,
        question: t('doubts.questions.limitBills'),
        answer: t('doubts.answers.limitBills'),
      },
      {
        id: 3,
        question: t('doubts.questions.limitProductInStock'),
        answer: t('doubts.answers.limitProductInStock'),
      },
    ],
    [t],
  );

  const renderDoubt = ({ question, answer, id }: Doubt) => {
    return (
      <StyledContainerDoubt
        key={id}
        onPress={() => navigate('MenuDoubt', { question, answer })}
      >
        <StyledTextQuestion>{question}</StyledTextQuestion>
      </StyledContainerDoubt>
    );
  };

  return (
    <Background>
      <Header
        title={t('components.header.menuHelper')}
        backgroundColor="SECUNDARY_600"
        onPress={goBack}
        type="small"
      />

      <StyledContent>
        <StyledTitle>Dúvidas frequentes</StyledTitle>
        {doubts.map(({ question, answer, id }) =>
          renderDoubt({ answer, question, id }),
        )}
      </StyledContent>
    </Background>
  );
};

const StyledContent = styled.View`
  padding: 32px;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-bottom: 16px;
`;

const StyledContainerDoubt = styled.TouchableOpacity`
  margin-bottom: 12px;
`;

const StyledTextQuestion = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;
