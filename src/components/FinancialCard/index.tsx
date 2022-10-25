import React, { memo } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FinancialCardProps {
  item: {
    date: number;
    title?: string;
    price: number;
  };
}

const FinancialCard = ({
  item: { date, title, price },
}: FinancialCardProps) => {
  const theme = useTheme();

  const formatedDate = new Date(date).toLocaleDateString('pt-br', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return (
    <StyledContainer>
      <StyledCircle>
        <StyledIcon
          name={price >= 0 ? 'arrow-upward' : 'arrow-downward'}
          color={theme.colors.GRAY_600}
          size={21}
        />
      </StyledCircle>
      <StyledColumn>
        <StyledData>{formatedDate}</StyledData>
        <StyledTitle>{title}</StyledTitle>
      </StyledColumn>

      <StyledPrice>
        {`${price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
        })}`}
      </StyledPrice>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  padding: 2px 0;
  margin: 0 32px 16px;
`;

const StyledCircle = styled.View`
  width: 30px;
  height: 30px;

  align-items: center;
  justify-content: center;

  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.GRAY_300};
`;

const StyledIcon = styled(Icon)`
  margin-right: -1px;
`;

const StyledColumn = styled.View`
  flex: 1;

  align-items: flex-start;

  padding: 0 8px;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.MINOR};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledData = styled(StyledTitle)`
  font-size: ${({ theme }) => theme.sizing.SMALLEST};
`;

const StyledPrice = styled(StyledTitle)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};
`;

export default memo(FinancialCard);
