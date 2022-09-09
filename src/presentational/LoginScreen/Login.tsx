import React from 'react';
import styled from 'styled-components/native';

import Button from '@components/Button';

export const Login = () => {
  return (
    <StyledContainer>
      <Button
        backgroundColor="dark"
        fontColor="dark"
        iconPosition="left"
        align="center"
        icon={{ name: 'arrow-forward', color: 'WHITE' }}
      />
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
