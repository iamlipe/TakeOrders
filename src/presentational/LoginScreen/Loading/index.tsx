import React, { memo } from 'react';
import styled from 'styled-components/native';

const Loading = () => {
  return (
    <StyledContainer>
      <StyledLoading size="large" color="white" />
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;

  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.PRIMARY_600};
`;

const StyledLoading = styled.ActivityIndicator``;

export default memo(Loading);
