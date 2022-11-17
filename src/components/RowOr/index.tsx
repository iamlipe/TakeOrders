import React, { memo } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const RowOr = () => {
  return (
    <StyledContainer>
      <StyledLine />
      <StyledTextOr>ou</StyledTextOr>
      <StyledLine />
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  height: 48px;

  align-items: center;
  justify-content: center;

  flex-direction: row;
`;

const StyledLine = styled.View`
  width: ${(width - 64 - width * 0.1) / 2}px;
  height: 1px;

  background-color: ${({ theme }) => theme.colors.GRAY_600};
`;

const StyledTextOr = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};

  width: 10%;

  text-align: center;
`;

export default memo(RowOr);
