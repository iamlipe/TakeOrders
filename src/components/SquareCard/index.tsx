import React, { memo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

interface SquareCardProps {
  item: {
    name: string;
    price: string;
    image?: string;
  };

  onPress: () => void;
}

const SquareCard = ({
  item: { name, price, image },
  onPress,
}: SquareCardProps) => {
  const theme = useTheme();

  return (
    <StyledContainer style={{ elevation: 5 }}>
      {image ? (
        <StyledImage source={{ uri: image }} resizeMode="stretch" />
      ) : (
        <StyledDefaultImage>
          <Icon
            name="image-not-supported"
            color={theme.colors.WHITE}
            size={24}
          />
        </StyledDefaultImage>
      )}

      <StyledTitle>{name}</StyledTitle>
      <StyledDescription>{price}</StyledDescription>

      <StyledBaseButton onPress={onPress}>
        <StyledLink>Adicionar</StyledLink>
      </StyledBaseButton>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 48%;

  border-radius: 5px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 16px 8px;
  margin-bottom: 8px;
`;

const StyledImage = styled.Image`
  width: 60px;
  height: 80px;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledDefaultImage = styled.View`
  width: 80px;
  height: 80px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.SECUNDARY_200};
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MINOR};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-top: 4px;
`;

const StyledDescription = styled(StyledTitle)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};

  margin-top: 0px;
`;

const StyledBaseButton = styled.TouchableOpacity`
  margin-top: 8px;
`;

const StyledLink = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.SECUNDARY_600};

  text-decoration: underline;
`;

export default memo(SquareCard);
