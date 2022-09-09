import React from 'react';
import styled from 'styled-components/native';

export const Login = () => {
  return (
    <StyledContainer>
      <StyledText>Login</StyledText>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 90%;
  height: 100%;

  justify-content: center;
  align-items: center;
  align-self: center;
`;

const StyledText = styled.Text``;
