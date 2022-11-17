import React, { memo, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Dimensions, View } from 'react-native';
import { theme } from '@styles/index';
import { useController } from 'react-hook-form';
import { RFValue } from 'react-native-responsive-fontsize';

interface StyledLabelProps {
  select: boolean;
}

interface StyledContainerOptionProps {
  pair: boolean;
}

interface Option {
  id: string;
  name: string;
}

interface SelectProps {
  name: string;
  control: any;
  label: string;
  options: Option[];
}

const { width } = Dimensions.get('window');

const Select = ({ label, options, name, control }: SelectProps) => {
  const optionsBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPointHeigth = useMemo(() => ['40%'], []);

  const {
    field: { onChange, value },
  } = useController({ name, control });

  const handleShowOptionsBottomSheet = useCallback(() => {
    optionsBottomSheetModalRef.current?.present();
  }, []);

  const handleloseOptionsBottomSheet = useCallback(() => {
    optionsBottomSheetModalRef.current?.dismiss();
  }, []);

  const handleTextLabel = useCallback(() => {
    const selected = options.find(option => option.id === value);

    if (selected) return selected.name;

    return label;
  }, [label, options, value]);

  const renderOptions = ({
    option,
    index,
  }: {
    option: Option;
    index: number;
  }) => (
    <StyledContainerOption
      key={option.id}
      onPress={() => {
        onChange(option.id);
        handleloseOptionsBottomSheet();
      }}
      pair={index % 2 === 0}
    >
      <StyledTextOption>{option.name}</StyledTextOption>
    </StyledContainerOption>
  );

  return (
    <StyledContainer>
      <StyledContainerSelect>
        <StyledContent
          style={{ elevation: 2 }}
          onPress={handleShowOptionsBottomSheet}
        >
          <StyledLabel select={!!value}>{handleTextLabel()}</StyledLabel>
          <Icon
            name="keyboard-arrow-right"
            size={RFValue(18)}
            color={theme.colors.GRAY_600}
          />
        </StyledContent>
      </StyledContainerSelect>

      <BottomSheetModal
        ref={optionsBottomSheetModalRef}
        snapPoints={snapPointHeigth}
        backdropComponent={() => (
          <StyledBackground onPress={handleloseOptionsBottomSheet} />
        )}
        handleComponent={() => (
          <StyledHandleBottomSheetModal>
            <StyledTitleBottomSheetModal>Selecione</StyledTitleBottomSheetModal>
          </StyledHandleBottomSheetModal>
        )}
      >
        <StyledScrollrBottomSheetModal>
          {options?.map((option, index) => renderOptions({ option, index }))}
        </StyledScrollrBottomSheetModal>
      </BottomSheetModal>
    </StyledContainer>
  );
};

const StyledContainer = styled.View``;

const StyledBackground = styled.Pressable`
  position: absolute;

  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.BACKGROUND_MODAL};
`;

const StyledContainerSelect = styled.View`
  margin: 0 32px 12px;
`;

const StyledContent = styled.Pressable`
  width: 100%;
  height: 44px;

  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.WHITE};

  padding: 0 8px 0 16px;
`;

const StyledLabel = styled.Text<StyledLabelProps>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme, select }) =>
    select ? theme.colors.GRAY_800 : theme.colors.GRAY_600};
`;

const StyledHandleBottomSheetModal = styled.View`
  padding: 16px;
`;

const StyledTitleBottomSheetModal = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledScrollrBottomSheetModal = styled(BottomSheetScrollView)`
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledContainerOption = styled.TouchableOpacity<StyledContainerOptionProps>`
  width: ${width}px;
  height: 50px;

  justify-content: center;

  background-color: ${({ pair, theme }) =>
    pair ? theme.colors.GRAY_100 : theme.colors.WHITE};

  padding: 4px 16px;
`;

const StyledTextOption = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

export default memo(Select);
