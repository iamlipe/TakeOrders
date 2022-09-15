import React, { memo } from 'react';
import styled from 'styled-components/native';

interface SquareCardProps {
  item: {
    title: string;
    description: string;

    link: () => void;
  };
}

const SquareCard = ({
  item: { title, description, link },
}: SquareCardProps) => {
  return (
    <StyledContainer style={{ elevation: 5 }}>
      <StyledImage />
      <StyledTitle>{title}</StyledTitle>
      <StyledDescription>{description}</StyledDescription>

      <StyledBaseButton onPress={link}>
        <StyledLink>Adicionar</StyledLink>
      </StyledBaseButton>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 49%;

  border-radius: 5px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 16px 8px;
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
