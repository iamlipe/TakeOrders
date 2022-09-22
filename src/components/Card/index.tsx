import React, { memo, useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components/native';

import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { OrderUseCase } from '@database/useCase/orderUseCase';

import formatedCurrency from '@utils/formatedCurrency';

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
    quantity?: string;
    linkTitle?: string;
    link?: () => void;
  };

  type?: 'normal' | 'clients';
  cardSize?: 'small' | 'medium' | 'large';
  noTouchable?: boolean;

  onPress: () => void;
}

const Card = ({
  item: { image, title, description, quantity, linkTitle, link },
  type = 'normal',
  cardSize = 'medium',
  noTouchable = false,
  onPress,
}: CardProps) => {
  const [price, setPrice] = useState(0);

  const { t } = useTranslation();

  const isFocused = useIsFocused();

  const handleOrders = useCallback(async () => {
    const orders = await OrderUseCase.get({ billId: description });

    if (orders.length) {
      const priceOrder = orders.reduce(
        (prev, curr) => prev + curr.quantity * curr.product.price,
        0,
      );

      setPrice(priceOrder);
    }
  }, [description]);

  useEffect(() => {
    if (type === 'clients' && isFocused) {
      handleOrders();
    }
  }, [handleOrders, isFocused, type]);

  return (
    <StyledContainer
      size={cardSize}
      style={{ elevation: 2 }}
      onPress={onPress}
      disabled={noTouchable}
    >
      <StyledImage size={cardSize} source={image} />

      <StyledColumn>
        <StyledTitle>{title}</StyledTitle>
        <StyledRow>
          {quantity && (
            <StyledDescriptionQuantity>{`${t(
              'components.card.quantity',
            )}: ${quantity}`}</StyledDescriptionQuantity>
          )}
          <StyledDescription>
            {type === 'clients' ? formatedCurrency(price) : description}
          </StyledDescription>
        </StyledRow>
      </StyledColumn>

      {link && (
        <StyledBaseButton onPress={link}>
          <StyledLink>
            {linkTitle ? linkTitle : t('components.card.links.add')}
          </StyledLink>
        </StyledBaseButton>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.TouchableOpacity<CardContainerProps>`
  ${({ size }) => cardSize[size]}

  flex-direction: row;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding-right: 16px;
  margin: 4px 32px;
`;

const StyledRow = styled.View`
  flex-direction: row;
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

const StyledDescriptionQuantity = styled(StyledDescription)`
  margin-right: 8px;
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
