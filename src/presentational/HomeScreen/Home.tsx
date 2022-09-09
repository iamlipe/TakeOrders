import React from 'react';
import styled from 'styled-components/native';

export const Home = () => {
  return (
    <StyledContainer>
      <StyledText>Home</StyledText>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  min-height: 100%;
`;

const StyledText = styled.Text``;
