/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import { useController } from 'react-hook-form';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';

interface ImagePickerProps {
  name: string;
  control: any;
  label: string;
}

const ImagePicker = ({ control, name, label }: ImagePickerProps) => {
  const [image, setImage] = useState('');

  const {
    field: { onChange, value },
  } = useController({ control, name });

  const snapPointHeigth = useMemo(
    () => [22 + 8 + RFValue(24) + 16 + 52 + 8 + 52 + 8 + 16],
    [],
  );

  const chosePickerBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const theme = useTheme();

  const options: CameraOptions = {
    mediaType: 'photo',
    maxWidth: 400,
    maxHeight: 400,
    includeBase64: true,
  };

  const handleShowChosePickerBottomSheet = useCallback(() => {
    chosePickerBottomSheetModalRef.current?.present();
  }, []);

  const openCamera = async () => {
    const result = await launchCamera(options);

    if (result?.assets) {
      const uri = result.assets[0].uri!;

      onChange(uri);
    }
  };

  const openGalery = async () => {
    const result = await launchImageLibrary(options);

    if (result?.assets) {
      const uri = result.assets[0].uri!;

      onChange(uri);
    }
  };

  useEffect(() => {
    setImage(value);
  }, [value]);

  const SelectPicker = () => {
    return (
      <BottomSheetModal
        snapPoints={snapPointHeigth}
        ref={chosePickerBottomSheetModalRef}
      >
        <StyledContainerSelectPicker>
          <StyledTitleSelectPicker>
            Selecionar foto ou imagem para o produto
          </StyledTitleSelectPicker>

          <StyledBaseButtonSelect onPress={openCamera}>
            <Icon name="camera-alt" color={theme.colors.GRAY_600} size={24} />

            <StyledColumnInfoSelectPicker>
              <StyledTitleButtonSelectPicker>
                Câmera
              </StyledTitleButtonSelectPicker>

              <StyledDescriptionButtonSelectPicker>
                Tire uma foto do produto que deseja cadastrar
              </StyledDescriptionButtonSelectPicker>
            </StyledColumnInfoSelectPicker>
          </StyledBaseButtonSelect>

          <StyledBaseButtonSelect onPress={openGalery}>
            <Icon name="image" color={theme.colors.GRAY_600} size={24} />
            <StyledColumnInfoSelectPicker>
              <StyledTitleButtonSelectPicker>
                Galeria
              </StyledTitleButtonSelectPicker>

              <StyledDescriptionButtonSelectPicker>
                Selecione uma foto da galeria do seu dispotivo
              </StyledDescriptionButtonSelectPicker>
            </StyledColumnInfoSelectPicker>
          </StyledBaseButtonSelect>
        </StyledContainerSelectPicker>
      </BottomSheetModal>
    );
  };

  return (
    <StyledContainer>
      <StyledBaseButtonInput onPress={handleShowChosePickerBottomSheet}>
        {image ? (
          <StyledInputImage
            style={{ elevation: 5 }}
            source={{ uri: image }}
            resizeMode="center"
          ></StyledInputImage>
        ) : (
          <StyledInputImageDefault>
            <Icon name="add-a-photo" color={theme.colors.WHITE} size={24} />
          </StyledInputImageDefault>
        )}

        <StyledText>{label}</StyledText>
      </StyledBaseButtonInput>

      <SelectPicker />
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  height: 124px;

  justify-content: center;
  align-items: center;

  margin-bottom: 16px;
`;

const StyledBaseButtonInput = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const StyledBaseButtonSelect = styled.TouchableOpacity`
  height: 52px;

  flex-direction: row;

  align-items: center;

  margin-bottom: 8px;
`;

const StyledInputImage = styled.Image`
  width: 100px;
  height: 100px;

  justify-content: center;
  align-items: center;

  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  border: 5px solid ${({ theme }) => theme.colors.WHITE};
`;

const StyledInputImageDefault = styled.View`
  width: 100px;
  height: 100px;

  justify-content: center;
  align-items: center;

  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.PRIMARY_500};
`;

const StyledText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(24)}px;
`;

const StyledContainerSelectPicker = styled.View`
  height: 156px;

  flex-direction: column;

  justify-content: center;

  padding: 0 16px;
  margin-top: 8px;
`;

const StyledTitleSelectPicker = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  line-height: 20px;

  margin-bottom: 8px;
`;

const StyledColumnInfoSelectPicker = styled.View`
  margin-left: 4px;
`;

const StyledTitleButtonSelectPicker = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledDescriptionButtonSelectPicker = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.MINOR};

  color: ${({ theme }) => theme.colors.GRAY_600};
`;

export default memo(ImagePicker);
