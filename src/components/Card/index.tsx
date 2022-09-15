import React, { memo } from 'react';
import styled, { css } from 'styled-components/native';

const cardSize = {
  small: css`
    height: 30px;
  `,

  medium: css`
    height: 45px;
  `,

  large: css`
    height: 60px;
  `,
};

const imageSize = {
  small: css`
    width: 30px;
    height: 30px;
  `,

  medium: css`
    width: 45px;
    height: 45px;
  `,

  large: css`
    width: 60px;
    height: 60px;
  `,
};

interface CardContainerProps {
  size: keyof typeof cardSize;
}

interface CardImageProps {
  size: keyof typeof imageSize;
}

interface CardProps {
  item: {
    image?: string;
    title: string;
    description: string;
    link?: () => void;
  };

  cardSize?: 'small' | 'medium' | 'large';
}

const Card = ({
  item: { image, title, description, link },
  cardSize = 'medium',
}: CardProps) => {
  return (
    <StyledContainer size={cardSize} style={{ elevation: 5 }}>
      <StyledImage size={cardSize} source={image} />

      <StyledColumn>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </StyledColumn>

      {link && (
        <StyledBaseButton onPress={link}>
          <StyledLink>Adicionar</StyledLink>
        </StyledBaseButton>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.View<CardContainerProps>`
  ${({ size }) => cardSize[size]}

  width: 100%;

  flex-direction: row;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding-right: 16px;
`;

const StyledColumn = styled.View`
  flex: 1;

  height: 100%;

  justify-content: space-evenly;

  padding: 8px;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledDescription = styled(StyledTitle)`
  font-size: ${({ theme }) => theme.sizing.MINOR};
`;

const StyledImage = styled.Image<CardImageProps>`
  ${({ size }) => imageSize[size]}

  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;

  background-color: ${({ theme }) => theme.colors.SECUNDARY_200};
`;

const StyledBaseButton = styled.TouchableOpacity`
  justify-content: center;
`;

const StyledLink = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.SECUNDARY_600};

  text-decoration: underline;
`;

export default memo(Card);
