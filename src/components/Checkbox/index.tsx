import React, { memo, useCallback, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import Checked from '@assets/svgs/checked.svg';
import Unchecked from '@assets/svgs/unchecked.svg';

import { CheckBox } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';

interface CheckboxProps {
  options: string[];
}

const Checkbox = ({ options }: CheckboxProps) => {
  const [checked, setChecked] = useState<string[]>([]);

  const theme = useTheme();

  const handleCheck = useCallback(
    (option: string) => {
      if (!checked.length) return setChecked([option]);

      const hasChecked = checked.find(item => item === option);

      if (hasChecked) {
        const newChecked = checked.filter(item => item !== option);

        setChecked(newChecked);
      } else {
        const newChecked = [...checked, option];

        setChecked(newChecked);
      }
    },
    [checked],
  );

  return (
    <StyledContainer>
      {options.map((option, index) => {
        return (
          <CheckBox
            key={index}
            title={option}
            onPress={() => handleCheck(option)}
            checked={checked.includes(option)}
            size={20}
            textStyle={{
              fontFamily: theme.fonts.HEEBO_REGULAR,
              fontSize: RFValue(12),
              fontWeight: 'normal',
            }}
            checkedIcon={<Checked />}
            uncheckedIcon={<Unchecked />}
            containerStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              padding: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 8,
            }}
          />
        );
      })}
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  margin: 16px 32px;
`;

export default memo(Checkbox);
