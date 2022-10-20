import React, { memo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';

interface SquareCardProps {
  item: {
    index: number;
    name: string;
    price: string;
    image?: string;
  };

  onPress: () => void;
}

const { width } = Dimensions.get('window');

const SquareCard = ({
  item: { name, price, image, index },
  onPress,
}: SquareCardProps) => {
  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <StyledContainer
      style={{
        elevation: 5,
        marginRight: index % 2 === 0 ? (width - 64) * 0.04 : 0,
      }}
    >
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
        <StyledLink>{t('components.squareCard.button.add')}</StyledLink>
      </StyledBaseButton>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: ${(width - 64) * 0.48}px;
  height: ${(width - 64) * 0.48}px;

  border-radius: 5px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 16px 8px;
  margin-bottom: ${width * 0.04}px;
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
