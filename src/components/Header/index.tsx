import React, { memo, useCallback } from 'react';
import styled, { css, useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '@styles/colors';

import { useTranslation } from 'react-i18next';

const typeContainerHeader = {
  small: css`
    height: 80px;

    flex-direction: row;
    justify-content: space-between;
  `,

  normal: css`
    height: 120px;

    flex-direction: column;
    justify-content: space-evenly;
  `,

  justBackButton: css`
    height: 60px;

    justify-content: center;
  `,
};

const typeTitleHeader = {
  small: css`
    font-size: ${({ theme }) => theme.sizing.MEDIUM};

    color: ${({ theme }) => theme.colors.WHITE};

    align-self: center;
  `,

  main: css`
    font-size: ${({ theme }) => theme.sizing.LARGER};

    color: ${({ theme }) => theme.colors.WHITE};

    align-self: center;
  `,

  secundary: css`
    font-size: ${({ theme }) => theme.sizing.LARGE};

    color: ${({ theme }) => theme.colors.WHITE};

    align-self: flex-start;
  `,
};

interface ContainerProps {
  type: keyof typeof typeContainerHeader;
  background: keyof typeof colors;
}

interface HeaderTitleProps {
  type: keyof typeof typeTitleHeader;
}

interface TextButtonProps {
  color: keyof typeof colors;
}

interface HeaderProps {
  title?: string;
  type?: keyof typeof typeContainerHeader;
  backgroundColor?: keyof typeof colors;
  onPress?: () => void;
}

const Header = ({
  type = 'normal',
  title,
  backgroundColor = 'PRIMARY_500',
  onPress,
}: HeaderProps) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const handleTypeTitle = useCallback(() => {
    if (type === 'small') return 'small';

    if (type === 'normal' && !onPress) return 'main';

    if (type === 'normal' && !!onPress) return 'secundary';
  }, [onPress, type]);

  const handleTypeShareButton = useCallback(() => {
    if (type === 'small') return true;

    return false;
  }, [type]);

  const handleColorBackButton = useCallback(() => {
    if (backgroundColor === 'BACKGROUND_TRANSPARENT')
      return theme.colors.PRIMARY_TEXT;

    return theme.colors.WHITE;
  }, [backgroundColor, theme.colors.PRIMARY_TEXT, theme.colors.WHITE]);

  return (
    <StyledContainer type={type} background={backgroundColor}>
      {onPress && (
        <StyledBaseButton onPress={onPress}>
          <Icon name="angle-left" color={handleColorBackButton()} size={16} />

          <StyledTextButton color={handleColorBackButton}>
            {t('components.header.backButton').toUpperCase()}
          </StyledTextButton>
        </StyledBaseButton>
      )}

      {title && <StyledTitle type={handleTypeTitle()}>{title}</StyledTitle>}

      {handleTypeShareButton() && (
        <StyledBaseButton style={{ opacity: type === 'small' ? 0 : 1 }}>
          <Icon name="angle-left" color={theme.colors.WHITE} size={16} />

          <StyledTextButton>
            {t('components.header.backButton').toUpperCase()}
          </StyledTextButton>
        </StyledBaseButton>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.View<ContainerProps>`
  ${({ type }) =>
    css`
      ${typeContainerHeader[type]},
    `};

  background-color: ${({ theme, background }) => theme.colors[background]};

  position: relative;
  z-index: 1;

  width: 100%;

  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  padding: 8px 32px;
`;

const StyledTitle = styled.Text<HeaderTitleProps>`
  ${({ type }) =>
    css`
      ${typeTitleHeader[type]},
    `};

  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
`;

const StyledBaseButton = styled.TouchableOpacity`
  width: 60px;

  flex-direction: row;

  align-items: center;
`;

const StyledTextButton = styled.Text<TextButtonProps>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.MINOR};

  color: ${({ color }) => color};

  margin-left: 5px;
`;

export default memo(Header);
