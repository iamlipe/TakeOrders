import React, { memo } from 'react';
import styled, { css, useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '@styles/colors';
import { RFValue } from 'react-native-responsive-fontsize';

const buttonIconPosition = {
  none: css``,

  left: css`
    position: absolute;
    top: ${(50 % -RFValue(16)) / 2}px;
    left: 12px;
  `,
};

const buttonBackgroundColor = {
  light: css`
    background-color: ${({ theme }) => theme.colors.WHITE};
  `,

  dark: css`
    background-color: ${({ theme }) => theme.colors.GRAY_800};
  `,

  trasparent: css`
    background-color: transparent;
    border: 1.6px solid ${({ theme }) => theme.colors.GRAY_800};
  `,
};

const buttonAling = {
  center: css`
    flex-direction: row;
    justify-content: center;
  `,

  spaceBetween: css`
    flex-direction: row;
    justify-content: space-between;
  `,
};

interface ButtonContainerProps {
  background: keyof typeof buttonBackgroundColor;
  align: keyof typeof buttonAling;
}

interface ButtonTextProps {
  color: keyof typeof colors;
}

interface ButtonIconProps {
  position: keyof typeof buttonIconPosition;
}

interface Props {
  fontColor?: keyof typeof colors;
  backgroundColor?: keyof typeof buttonBackgroundColor;
  align?: keyof typeof buttonAling;
  iconPosition?: keyof typeof buttonIconPosition;
  title: string;
  icon?: {
    name: string;
    color: keyof typeof colors;
  };
  onPress: () => void;
  loading?: boolean;
}

const Button = ({
  fontColor = 'WHITE',
  backgroundColor = 'dark',
  iconPosition = 'none',
  align = 'center',
  icon,
  title,
  loading,
  onPress,
}: Props) => {
  const theme = useTheme();

  return (
    <StyledContainer
      background={backgroundColor}
      align={align}
      onPress={onPress}
    >
      {loading && !icon ? (
        <StyledLoading color="white" size="small" />
      ) : (
        <StyledText color={fontColor}>{title}</StyledText>
      )}

      {icon && !loading && (
        <StyledIcon
          name={icon.name}
          color={theme.colors[icon.color]}
          size={RFValue(16)}
          position={iconPosition}
        />
      )}

      {icon && loading && <StyledLoading color="white" size="small" />}
    </StyledContainer>
  );
};

const StyledContainer = styled.TouchableOpacity<ButtonContainerProps>`
  ${({ background, align }) =>
    css`
      ${buttonBackgroundColor[background]},
      ${buttonAling[align]}
    `};

  min-height: 44px;

  flex-direction: row;
  align-items: center;

  border-radius: 10px;

  padding: 8px 12px;
  margin: 0 32px;
`;

const StyledText = styled.Text<ButtonTextProps>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme, color }) => theme.colors[color]};

  align-self: center;
`;

const StyledIcon = styled(Icon)<ButtonIconProps>`
  ${({ position }) =>
    css`
      ${buttonIconPosition[position]},
    `};

  line-height: ${RFValue(16)}px;
`;

const StyledLoading = styled.ActivityIndicator``;

export default memo(Button);
