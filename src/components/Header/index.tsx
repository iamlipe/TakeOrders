import React, { memo, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '@styles/colors';

import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useTranslation } from 'react-i18next';

interface HeaderTitleProps {
  type: 'primary' | 'secundary';
}

interface ContainerProps {
  background?: keyof typeof colors;
}

interface HeaderProps {
  title: string;
  backgroundColor?: keyof typeof colors;
  onPress?: () => void;
}

const Header = ({ title, backgroundColor, onPress }: HeaderProps) => {
  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <StyledContainer background={backgroundColor}>
      {onPress && (
        <StyledBaseButton onPress={onPress}>
          <Icon name="angle-left" color={theme.colors.WHITE} size={16} />
          <StyledTextButton>
            {t('components.header.backButton').toUpperCase()}
          </StyledTextButton>
        </StyledBaseButton>
      )}

      <StyledTitle type={!onPress ? 'primary' : 'secundary'}>
        {title}
      </StyledTitle>
    </StyledContainer>
  );
};

const StyledContainer = styled.View<ContainerProps>`
  position: relative;
  z-index: 1;

  width: 100%;
  height: 120px;

  justify-content: space-evenly;

  background-color: ${({ theme, background }) =>
    background ? theme.colors[background] : theme.colors.PRIMARY_500};

  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  padding: 8px 16px;
`;

const StyledTitle = styled.Text<HeaderTitleProps>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme, type }) =>
    type === 'primary' ? theme.sizing.LARGER : theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.WHITE};

  align-self: ${({ type }) => (type === 'primary' ? 'center' : 'flex-start')};

  padding: 0 16px;
`;

const StyledBaseButton = styled.TouchableOpacity`
  width: 60px;

  flex-direction: row;

  align-items: center;
`;

const StyledTextButton = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.MINOR};

  color: ${({ theme }) => theme.colors.WHITE};

  margin-left: 5px;
`;

export default memo(Header);
