import React, { memo } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface HeaderTitleProps {
  type: 'primary' | 'secundary';
}

interface HeaderProps {
  title: string;
  onPress?: () => void;
}

const Header = ({ title, onPress }: HeaderProps) => {
  const theme = useTheme();

  return (
    <StyledContainer>
      {onPress && (
        <StyledBaseButton onPress={onPress}>
          <Icon name="angle-left" color={theme.colors.WHITE} size={16} />
          <StyledTextButton>VOLTAR</StyledTextButton>
        </StyledBaseButton>
      )}

      <StyledTitle type={!onPress ? 'primary' : 'secundary'}>
        {title}
      </StyledTitle>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 100%;
  height: 100px;

  justify-content: space-evenly;

  background-color: ${({ theme }) => theme.colors.PRIMARY_600};

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
