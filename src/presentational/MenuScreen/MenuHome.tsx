import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useTranslation } from 'react-i18next';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '@components/Header';

import ModalSelectLanguage from './ModalSelectLanguage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuStackParamList } from '@routes/stacks/MenuStack';
import { Dimensions, StatusBar } from 'react-native';
import i18next from 'i18next/index';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { LOGOUT } from '@store/slices/userSlice';
import { useUserStorage } from '@hooks/useUserStorage';

type NavProps = NativeStackNavigationProp<MenuStackParamList, 'MenuHelper'>;

const { height } = Dimensions.get('window');

export const MenuHome = () => {
  const [visibleModalSelectLanguage, setVisibleModalSelectLanguage] =
    useState(false);

  const dispatch = useReduxDispatch();

  const userStorage = useUserStorage();

  const { navigate } = useNavigation<NavProps>();

  const { t } = useTranslation();

  const theme = useTheme();

  const handleLanguage = (language: 'pt' | 'es' | 'en') => {
    i18next.changeLanguage(language);

    userStorage.saveUserLanguage('language', language);

    setVisibleModalSelectLanguage(false);
  };

  const handleLogout = () => {
    dispatch(LOGOUT());
  };

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header
        title={t('components.header.menuHome')}
        backgroundColor="SECUNDARY_600"
      />

      <StyledContent>
        <StyledContainerOptions>
          <StyledBaseButton onPress={() => setVisibleModalSelectLanguage(true)}>
            <StyledTextButton>
              {t('screens.menuHome.options.language')}
            </StyledTextButton>
          </StyledBaseButton>

          <StyledBaseButton onPress={() => navigate('MenuHelper')}>
            <StyledTextButton>
              {t('screens.menuHome.options.help')}
            </StyledTextButton>
          </StyledBaseButton>
        </StyledContainerOptions>

        <StyledBaseButtonLogout onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.GRAY_800} size={24} />
          <StyledTextButtonLogout>
            {t('screens.menuHome.logout')}
          </StyledTextButtonLogout>
        </StyledBaseButtonLogout>
      </StyledContent>

      <ModalSelectLanguage
        visible={visibleModalSelectLanguage}
        setVisible={setVisibleModalSelectLanguage}
        handleLanguage={handleLanguage}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContent = styled.View`
  padding: 32px;
`;

const StyledContainerOptions = styled.View`
  height: ${StatusBar.currentHeight
    ? height - StatusBar.currentHeight - 120 - 32 - 40 - 32 - 72
    : height - 120 - 32 - 40 - 32 - 72}px;
`;

const StyledBaseButton = styled.TouchableOpacity`
  height: 40px;
`;

const StyledTextButton = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledBaseButtonLogout = styled(StyledBaseButton)`
  flex-direction: row;

  align-items: center;
`;

const StyledTextButtonLogout = styled(StyledTextButton)`
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.SECUNDARY_800};

  margin-left: 5px;
`;
