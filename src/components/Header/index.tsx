import React, { memo } from 'react';
import styled from 'styled-components/native';

const Header = () => {
  return (
    <StyledContainer>
      <StyledText>text</StyledText>
    </StyledContainer>
  );
};

const StyledContainer = styled.View``;
const StyledText = styled.Text``;

export default memo(Header);
