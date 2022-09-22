import React, { memo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('screen');

const Loading = () => {
  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <StyledContainer>
      <StyledLoading size="small" color={theme.colors.GRAY_800} />
      <StyledText>{t('components.loading')}</StyledText>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;

  width: ${width}px;
  height: ${height}px;

  justify-content: center;
  align-items: center;

  background-color: transparent;
`;

const StyledLoading = styled.ActivityIndicator``;

const StyledText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

export default memo(Loading);
