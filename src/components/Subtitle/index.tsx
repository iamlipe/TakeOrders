import React, { memo, ReactNode } from 'react';
import styled from 'styled-components/native';

interface SubTitleProps {
  children: ReactNode;
}

const SubTitle = ({ children }: SubTitleProps) => {
  return <StyledSubtitle>{children}</StyledSubtitle>;
};

const StyledSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.SECUNDARY_TEXT};

  margin: 0 32px 8px;
`;

export default memo(SubTitle);
