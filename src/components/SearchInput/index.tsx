import React, { memo, useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useReduxDispatch } from '@hooks/useReduxDispatch';

import { GET_BILLS_BY_NAME } from '@store/slices/billSlice';
import { GET_PRODUCTS_BY_NAME } from '@store/slices/productSlice';
import { RFValue } from 'react-native-responsive-fontsize';

interface SearchInputProps {
  placeholder: string;
  type: 'bills' | 'products';
}

const SearchInput = ({ placeholder, type }: SearchInputProps) => {
  const [searching, setSearching] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const dispatch = useReduxDispatch();

  const theme = useTheme();

  const handleSearch = useCallback(() => {
    if (typeof value === 'string') {
      setSearching(true);

      if (type === 'bills') {
        dispatch(GET_BILLS_BY_NAME({ billName: value }));
      }

      if (type === 'products') {
        dispatch(GET_PRODUCTS_BY_NAME({ name: value }));
      }

      setTimeout(() => setSearching(false), 1000);
    }
  }, [dispatch, type, value]);

  useEffect(() => {
    if (value === '') {
      handleSearch();
    }
  }, [handleSearch, value]);

  return (
    <StyledContainer style={{ elevation: 3 }}>
      <StyledContainerIcon>
        {searching ? (
          <StyledLoading color={theme.colors.GRAY_800} size="small" />
        ) : (
          <StyledBaseButton onPress={handleSearch}>
            <Icon
              name="search"
              color={theme.colors.GRAY_800}
              size={RFValue(16)}
            />
          </StyledBaseButton>
        )}
      </StyledContainerIcon>

      <StyledInputText
        onSubmitEditing={handleSearch}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.GRAY_800}
        onChangeText={setValue}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  flex-direction: row;
  align-items: center;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 0 16px;
  margin: 0 32px;
`;

const StyledInputText = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledContainerIcon = styled.View`
  justify-content: center;
  align-items: center;

  padding: 0 4px;
`;

const StyledLoading = styled.ActivityIndicator``;

const StyledBaseButton = styled.TouchableOpacity``;

export default memo(SearchInput);
