import React, { memo } from 'react';
import styled, { css, useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '@styles/colors';

interface ContainerCircleButton {
  backgroundColor: keyof typeof colors;
}

interface TextButton {
  textColor: keyof typeof colors;
}

interface ScrollableButtonProps {
  backgroundColor?: keyof typeof colors;
  textColor?: keyof typeof colors;

  buttons: {
    title: string;
    iconName: string;
    onPress: () => void;
  }[];
}

const ScrollableButton = ({
  backgroundColor = 'PRIMARY_800',
  textColor = 'GRAY_800',
  buttons,
}: ScrollableButtonProps) => {
  const theme = useTheme();

  return (
    <StyledContainer horizontal={true} showsHorizontalScrollIndicator={false}>
      {buttons.map((button, index) => (
        <StyledContainerButton key={index} onPress={button.onPress}>
          <StyledCircle backgroundColor={backgroundColor}>
            <Icon name={button.iconName} color={theme.colors.WHITE} size={18} />
          </StyledCircle>
          <StyledTextButton textColor={textColor}>
            {button.title}
          </StyledTextButton>
        </StyledContainerButton>
      ))}
    </StyledContainer>
  );
};

const StyledContainer = styled.ScrollView``;

const StyledContainerButton = styled.View`
  align-items: center;
  justify-content: center;

  margin: 0 8px;
`;

const StyledCircle = styled.TouchableOpacity<ContainerCircleButton>`
  width: 50px;
  height: 50px;

  align-items: center;
  justify-content: center;

  border-radius: 25px;

  background-color: ${({ theme, backgroundColor }) =>
    theme.colors[backgroundColor]};
`;

const StyledTextButton = styled.Text<TextButton>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.MINOR};

  color: ${({ theme, textColor }) => theme.colors[textColor]};
`;

export default memo(ScrollableButton);
