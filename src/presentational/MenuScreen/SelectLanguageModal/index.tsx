import React, { memo, forwardRef, Dispatch, SetStateAction } from 'react';
import styled, { useTheme } from 'styled-components/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Overlay } from 'react-native-elements';

import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

interface SelectLanguageModalProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  handleLanguage: (language: 'pt' | 'en' | 'es') => void;
}

const { width, height } = Dimensions.get('window');

const SelectLanguageModal = ({
  visible,
  setVisible,
  handleLanguage,
}: SelectLanguageModalProps) => {
  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <>
      <StyledBackground />
      <StyledOverlay
        isVisible={!!visible}
        onBackdropPress={() => setVisible(false)}
        backdropStyle={{ backgroundColor: theme.colors.BACKGROUND_MODAL }}
        statusBarTranslucent
        fullScreen={false}
        overlayStyle={{
          height: 24 + 16 + 36 + 36 + 36 + 24 + RFValue(24),
          width: width * 0.9,
          padding: 24,
          borderRadius: 20,
          backgroundColor: theme.colors.WHITE,
        }}
      >
        <StyledBaseButtonClose onPress={() => setVisible(false)}>
          <Icon name="close" size={RFValue(16)} color={theme.colors.GRAY_800} />
        </StyledBaseButtonClose>
        <StyledTitle>
          {t('screens.menuHome.selectLanguageModal.title')}
        </StyledTitle>

        <StyledBaseButton onPress={() => handleLanguage('pt')}>
          <StyledTextButtton>
            {t('screens.menuHome.selectLanguageModal.options.portuguese')}
          </StyledTextButtton>
        </StyledBaseButton>
        <StyledBaseButton onPress={() => handleLanguage('en')}>
          <StyledTextButtton>
            {t('screens.menuHome.selectLanguageModal.options.english')}
          </StyledTextButtton>
        </StyledBaseButton>
        <StyledBaseButton onPress={() => handleLanguage('es')}>
          <StyledTextButtton>
            {t('screens.menuHome.selectLanguageModal.options.spanish')}
          </StyledTextButtton>
        </StyledBaseButton>
      </StyledOverlay>
    </>
  );
};

const StyledOverlay = styled(Overlay)``;

const StyledBackground = styled.Pressable`
  flex: 1;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.BACKGROUND_MODAL};
`;

const StyledBaseButtonClose = styled.TouchableOpacity`
  position: absolute;
  top: 24px;
  right: 16px;

  z-index: 1;

  width: ${RFValue(24)}px;
  height: ${RFValue(24)}px;

  align-self: flex-end;

  justify-content: center;
  align-items: center;

  border-radius: ${RFValue(12)}px;

  background-color: ${({ theme }) => theme.colors.GRAY_100};
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  line-height: ${RFValue(24)}px;

  margin-bottom: 16px;
`;

const StyledBaseButton = styled.TouchableOpacity`
  height: 36px;

  align-items: center;
  justify-content: center;
`;

const StyledTextButtton = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

export default memo(SelectLanguageModal);
