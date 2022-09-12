import React, { memo } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInputProps } from 'react-native';

interface SearchInputProps extends TextInputProps {
  placeholder: string;
  onSubmit?: () => void;
}

const SearchInput = ({ placeholder, onSubmit }: SearchInputProps) => {
  const theme = useTheme();

  return (
    <StyledContainer style={{ elevation: 5 }}>
      <Icon name="search" color={theme.colors.GRAY_800} size={16} />
      <StyledInputText onSubmitEditing={onSubmit} placeholder={placeholder} />
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 100%;
  height: 55px;

  flex-direction: row;
  align-items: center;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 0 16px;
`;

const StyledInputText = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding: 0 4px;
`;

export default memo(SearchInput);
