import React, { memo, Dispatch, SetStateAction } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { Overlay } from 'react-native-elements';

import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

interface TextButtonProps {
  remove?: boolean;
}

interface WarningLogoutModalProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => void;
}

const { width, height } = Dimensions.get('window');

const WarningLogoutModal = ({
  visible,
  setVisible,
  handleLogout,
}: WarningLogoutModalProps) => {
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
          height: 24 + RFValue(24) + 16 + RFValue(16) + RFValue(12) + 32 + 24,
          width: width * 0.9,
          padding: 24,
          borderRadius: 20,
          backgroundColor: theme.colors.WHITE,
        }}
      >
        <StyledTitle>
          {t('screens.menuHome.warningLogoutModal.title')}
        </StyledTitle>
        <StyledDescription>
          {t('screens.menuHome.warningLogoutModal.description')}
        </StyledDescription>

        <StyledContainerButtons>
          <StyledBaseButton onPress={() => setVisible(false)}>
            <StyledTextButton>{t('components.button.cancel')}</StyledTextButton>
          </StyledBaseButton>

          <StyledBaseButton remove onPress={handleLogout}>
            <StyledTextButton remove>
              {t('components.button.logout')}
            </StyledTextButton>
          </StyledBaseButton>
        </StyledContainerButtons>
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

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(24)}px;

  text-align: center;

  margin-bottom: 16px;
`;

const StyledDescription = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_600};

  line-height: ${RFValue(16)}px;

  text-align: center;

  margin-bottom: 16px;
`;

const StyledContainerButtons = styled.View`
  flex-direction: row;

  align-self: center;
`;

const StyledBaseButton = styled.TouchableOpacity<TextButtonProps>`
  min-width: 80px;

  background-color: ${({ theme, remove }) =>
    remove ? theme.colors.WARNING_600 : 'transparent'};

  border-radius: 4px;

  margin-left: 8px;

  padding: 8px 16px;
`;

const StyledTextButton = styled.Text<TextButtonProps>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme, remove }) =>
    remove ? theme.colors.WHITE : theme.colors.GRAY_800};

  text-align: center;
`;

export default memo(WarningLogoutModal);
