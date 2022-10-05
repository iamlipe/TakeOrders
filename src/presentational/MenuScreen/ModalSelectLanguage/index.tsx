import React, { memo, forwardRef, Dispatch, SetStateAction } from 'react';
import styled, { useTheme } from 'styled-components/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

interface ModalSelectLanguageProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  handleLanguage: (language: 'pt' | 'en' | 'es') => void;
}

const ModalSelectLanguage = ({
  visible,
  setVisible,
  handleLanguage,
}: ModalSelectLanguageProps) => {
  const theme = useTheme();

  return (
    <StyledModal
      animationType="fade"
      transparent={true}
      visible={visible}
      statusBarTranslucent
    >
      <StyledBackground>
        <StyledContainerModal>
          <StyledBaseButtonClose onPress={() => setVisible(false)}>
            <Icon name="close" size={16} color={theme.colors.GRAY_800} />
          </StyledBaseButtonClose>
          <StyledTitle>Selecione seu idioma</StyledTitle>

          <StyledBaseButton onPress={() => handleLanguage('pt')}>
            <StyledTextButtton>Portugues</StyledTextButtton>
          </StyledBaseButton>
          <StyledBaseButton onPress={() => handleLanguage('en')}>
            <StyledTextButtton>Ingles</StyledTextButtton>
          </StyledBaseButton>
          <StyledBaseButton onPress={() => handleLanguage('es')}>
            <StyledTextButtton>Espanhol</StyledTextButtton>
          </StyledBaseButton>
        </StyledContainerModal>
      </StyledBackground>
    </StyledModal>
  );
};

const StyledModal = styled.Modal`
  flex: 1;

  align-items: center;
  justify-content: center;
`;

const StyledBackground = styled.View`
  flex: 1;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.BACKGROUND_MODAL};
`;

const StyledContainerModal = styled.View`
  height: 212px;
  width: 90%;

  background-color: ${({ theme }) => theme.colors.WHITE};

  border-radius: 20px;

  padding: 32px 16px;
`;

const StyledBaseButtonClose = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;

  width: 32px;
  height: 32px;

  align-self: flex-end;

  justify-content: center;
  align-items: center;

  border-radius: 16px;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  line-height: 24px;

  margin-bottom: 16px;
`;

const StyledBaseButton = styled.TouchableOpacity`
  height: 36px;

  justify-content: center;
`;

const StyledTextButtton = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

export default memo(ModalSelectLanguage);
