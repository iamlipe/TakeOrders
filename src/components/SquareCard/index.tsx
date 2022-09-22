import React, { memo } from 'react';
import styled from 'styled-components/native';

interface SquareCardProps {
  item: {
    name: string;
    price: string;
  };

  onPress: () => void;
}

const SquareCard = ({ item: { name, price }, onPress }: SquareCardProps) => {
  return (
    <StyledContainer style={{ elevation: 5 }}>
      <StyledImage />
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
  margin: 1%;
`;

const StyledImage = styled.Image`
  width: 80px;
  height: 80px;

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
