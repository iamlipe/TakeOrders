import React, {
  memo,
  useCallback,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions, Keyboard } from 'react-native';

import { useReduxDispatch } from '@hooks/useReduxDispatch';

import { GET_BILLS_BY_NAME } from '@store/slices/billSlice';
import { GET_PRODUCTS_BY_NAME } from '@store/slices/productSlice';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SearchInputProps {
  placeholder: string;
  type: 'bills' | 'products';
}

const { width } = Dimensions.get('window');

const SearchInput = ({ placeholder, type }: SearchInputProps) => {
  const [focused, setFocused] = useState(false);
  const [searching, setSearching] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const refInput = useRef<any>(null);

  const widthContainer = useSharedValue(width - 64 - (width - 64) * 0.125);
  const opacitySearchButton = useSharedValue(1);

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
    Keyboard.addListener('keyboardDidHide', () => refInput.current?.blur());
  });

  useLayoutEffect(() => {
    if (focused) {
      widthContainer.value = withTiming(width - 64, { duration: 200 });
      opacitySearchButton.value = withTiming(0, { duration: 300 });
    }

    if (!focused) {
      widthContainer.value = withTiming(width - 64 - (width - 64) * 0.125, {
        duration: 200,
      });
      opacitySearchButton.value = withTiming(1, { duration: 300 });
    }
  }, [focused, opacitySearchButton, widthContainer]);

  const animatedContainer = useAnimatedStyle(() => {
    return {
      width: widthContainer.value,
    };
  });

  const animateSearchButton = useAnimatedStyle(() => {
    return {
      opacity: opacitySearchButton.value,
    };
  });

  return (
    <StyledRow>
      <StyledContainer style={[{ elevation: 3 }, animatedContainer]}>
        <StyledInputText
          ref={refInput}
          onSubmitEditing={handleSearch}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.GRAY_800}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </StyledContainer>

      <StyledContainerSearchButton style={[animateSearchButton]}>
        {searching ? (
          <StyledLoading size="small" color={theme.colors.SECUNDARY_600} />
        ) : (
          <StyledBaseButton
            onPress={() => {
              setFocused(true);
              refInput.current?.focus();
            }}
          >
            <Icon
              name="search"
              color={theme.colors.SECUNDARY_600}
              size={RFValue(20)}
            />
          </StyledBaseButton>
        )}
      </StyledContainerSearchButton>
    </StyledRow>
  );
};

const StyledContainer = styled(Animated.View)`
  height: 56px;

  flex-direction: row;
  align-items: center;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 0 16px;
  margin: 0 32px;
`;

const StyledInputText = styled.TextInput`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-left: 4px;
`;

const StyledRow = styled.View`
  flex-direction: row;
`;

const StyledLoading = styled.ActivityIndicator``;

const StyledBaseButton = styled.TouchableOpacity``;

const StyledContainerSearchButton = styled(Animated.View)`
  width: ${(width - 64) * 0.125}px;
  height: 56px;

  position: absolute;
  right: 32px;

  z-index: -1;

  align-items: flex-end;
  justify-content: center;
`;

export default memo(SearchInput);
