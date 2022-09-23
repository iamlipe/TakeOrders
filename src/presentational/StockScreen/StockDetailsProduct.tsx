import React from 'react';
import styled from 'styled-components/native';

import { useNavigation } from '@react-navigation/native';

import Header from '@components/Header';

export const StockDetailsProduct = () => {
  const { goBack } = useNavigation();

  return (
    <StyledContainer>
      <Header title="Detalhes Produto" onPress={goBack} />

      <StyledContent></StyledContent>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  min-height: 100%;
`;

const StyledContent = styled.View`
  padding: 32px 0;
`;
