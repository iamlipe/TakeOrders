import Background from '@components/Background';
import React from 'react';
import styled from 'styled-components/native';

export const VerifyPhoneOrEmail = () => {
  return (
    <Background>
      <StyledContent>
        <StyledTitle>Verify phone or email</StyledTitle>
      </StyledContent>
    </Background>
  );
};

const StyledContent = styled.ScrollView``;

const StyledTitle = styled.Text``;
