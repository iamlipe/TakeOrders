import React from 'react';
import styled from 'styled-components/native';

import Header from '@components/Header';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export const MenuHelper = () => {
  const { goBack } = useNavigation();

  const { t } = useTranslation();

  return (
    <StyledContainer>
      <Header
        title={t('components.header.menuHelper')}
        backgroundColor="SECUNDARY_600"
        onPress={goBack}
      />

      <StyledText>Menu Helper</StyledText>
    </StyledContainer>
  );
};

const StyledContainer = styled.View``;
const StyledText = styled.Text``;
