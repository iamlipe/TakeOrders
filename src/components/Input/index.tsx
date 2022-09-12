/* eslint-disable react/display-name */

import React, { forwardRef, memo, useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label: string;
}

const Input = forwardRef(({ label }: InputProps, ref) => {
  const [value, setValue] = useState('');
  const labelTraslateY = useSharedValue(0);
  const labelFontSize = useSharedValue(14);
  const labelOpacity = useSharedValue(1);

  const handleFocus = useCallback(
    (editing: boolean) => {
      if (editing) {
        labelTraslateY.value = withTiming(-12, { duration: 100 });
        labelFontSize.value = withTiming(10, { duration: 100 });
        labelOpacity.value = withTiming(0.2, { duration: 100 });
      } else {
        labelTraslateY.value = withTiming(0, { duration: 100 });
        labelFontSize.value = withTiming(12, { duration: 100 });
        labelOpacity.value = withTiming(1, { duration: 100 });
      }
    },
    [labelFontSize, labelOpacity, labelTraslateY],
  );

  const animatedStyleLabel = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: labelTraslateY.value }],
      fontSize: labelFontSize.value,
      opacity: labelOpacity.value,
    };
  });

  return (
    <StyledContainer style={{ elevation: 5 }}>
      <StyledLabel style={animatedStyleLabel}>{label}</StyledLabel>
      <StyledInputText
        ref={ref}
        onChangeText={setValue}
        onFocus={() => handleFocus(true)}
        onBlur={() => {
          if (value === '') handleFocus(false);
        }}
      />
    </StyledContainer>
  );
});

const StyledContainer = styled.View`
  width: 100%;
  height: 45px;

  justify-content: center;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 0 16px;
`;

const StyledLabel = styled(Animated.Text)`
  position: absolute;
  z-index: -1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding-left: 16px;
`;

const StyledInputText = styled.TextInput`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  padding: 0;
  margin-top: 12px;
`;

export default memo(Input);
