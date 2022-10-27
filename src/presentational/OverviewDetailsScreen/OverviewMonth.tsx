import React from 'react';
import styled from 'styled-components/native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import formatedCurrency from '@utils/formatedCurrency';

import Header from '@components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutesParamList } from '@routes/index';
import Background from '@components/Background';
import { useTranslation } from 'react-i18next';

type StackParamsList = {
  Info: {
    data: {
      month: string;
      x: string;
      y: number;
    }[];

    type: 'invoicing' | 'spending' | 'profit';
  };
};

type NavProps = NativeStackNavigationProp<RoutesParamList, 'OverviewExtract'>;

export const OverviewMonth = () => {
  const { navigate } = useNavigation<NavProps>();
  const { goBack } = useNavigation();

  const { data, type } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const { t } = useTranslation();

  const renderCard = (
    info: { month: string; x: string; y: number },
    index: number,
  ) => {
    return (
      <StyledContainerCard
        key={index}
        onPress={() => navigate('OverviewExtract', { data: info, type })}
      >
        <StyledBoxMonth>
          <StyledTextMonth>{info.x}</StyledTextMonth>
        </StyledBoxMonth>

        <StyledContainerInfoMonth>
          <StyledTitleInfo>
            {t(`screens.overviewDetails.months.card.title.${type}`)}
          </StyledTitleInfo>
          <StyledDescriptionInfo>
            {formatedCurrency(info.y)}
          </StyledDescriptionInfo>
        </StyledContainerInfoMonth>

        <StyledContainerDetails>
          <StyledTextDetails>
            {t(`screens.overviewDetails.months.card.details`)}
          </StyledTextDetails>
        </StyledContainerDetails>
      </StyledContainerCard>
    );
  };

  return (
    <Background>
      <Header
        title={t('components.header.overview')}
        onPress={goBack}
        type="small"
      />

      <StyledContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 32 }}
      >
        <StyledTitle>
          {t(`screens.overviewDetails.months.title.${type}`)}
        </StyledTitle>

        {data.map((item, index) => renderCard(item, index))}
      </StyledContent>
    </Background>
  );
};

const StyledContainer = styled.View``;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-bottom: 16px;
`;

const StyledContainerCard = styled.TouchableOpacity`
  border: 1px solid ${({ theme }) => theme.colors.GRAY_300};

  flex-direction: row;

  border-radius: 4px;

  margin-bottom: 16px;
`;

const StyledBoxMonth = styled.View`
  width: 30%;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.GRAY_300};

  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const StyledTextMonth = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_600};

  text-transform: uppercase;

  padding: 24px 4px;
`;

const StyledContainerInfoMonth = styled.View`
  width: 45%;

  justify-content: space-evenly;

  padding: 8px;
`;

const StyledTitleInfo = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledDescriptionInfo = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledContainerDetails = styled.View`
  width: 25%;

  justify-content: center;
  align-items: center;
`;

const StyledTextDetails = styled.Text`
  color: ${({ theme }) => theme.colors.GRAY_600};

  text-decoration: underline;
`;

const StyledContent = styled.ScrollView`
  margin: 0 32px;
`;
