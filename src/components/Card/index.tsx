import React, { memo, useCallback, useEffect, useState } from 'react';
import styled, { css, useTheme } from 'styled-components/native';

import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { OrderUseCase } from '@database/useCase/orderUseCase';

import formatedCurrency from '@utils/formatedCurrency';

import { avatar } from '@config/mocks/avatar';

import Icon from 'react-native-vector-icons/MaterialIcons';

const cardSize = {
  small: css`
    height: 32px;
  `,

  medium: css`
    height: 44px;
  `,

  large: css`
    height: 60px;
  `,
};

const imageDefaultSize = {
  small: css`
    width: 32px;
    height: 32px;
  `,

  medium: css`
    width: 44px;
    height: 44px;
  `,

  large: css`
    width: 60px;
    height: 60px;
  `,
};

const imageSize = {
  small: css`
    width: 24px;
    height: 24px;

    margin: 3px;
  `,

  medium: css`
    width: 36px;
    height: 36px;

    margin: 4px;
  `,

  large: css`
    width: 48px;
    height: 48px;

    margin: 6px;
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
    image?: string | number;
    title: string;
    description: string;
    quantity?: string;
    linkTitle?: string;
    link?: () => void;
  };

  type?: 'normal' | 'clients';
  cardSize?: 'small' | 'medium' | 'large';

  onPress?: () => void;
  personCard?: boolean;
}

const Card = ({
  item: { image, title, description, quantity, linkTitle, link },
  type = 'normal',
  cardSize = 'medium',
  onPress,
  personCard = false,
}: CardProps) => {
  const [price, setPrice] = useState(0);

  const { t } = useTranslation();

  const isFocused = useIsFocused();

  const theme = useTheme();

  const handleOrders = useCallback(async () => {
    const orders = await OrderUseCase.get({ billId: description });

    if (orders.length) {
      const priceOrder = orders.reduce(
        (prev, curr) => prev + curr.quantity * curr.product.price,
        0,
      );

      setPrice(priceOrder);
    } else {
      setPrice(0);
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
      disabled={!onPress}
    >
      {image ? (
        personCard && typeof image === 'number' ? (
          <StyledImage
            size={cardSize}
            source={avatar.filter(item => item.id === image)[0]?.src}
            resizeMode="contain"
          />
        ) : (
          <StyledImage
            size={cardSize}
            source={{ uri: image }}
            resizeMode="contain"
          />
        )
      ) : (
        <StyledDefaultImage size={cardSize}>
          <Icon
            name="image-not-supported"
            color={theme.colors.WHITE}
            size={20}
          />
        </StyledDefaultImage>
      )}

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

  align-self: center;

  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledDefaultImage = styled.View<CardImageProps>`
  ${({ size }) => imageDefaultSize[size]}

  align-self: center;

  align-items: center;
  justify-content: center;

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
