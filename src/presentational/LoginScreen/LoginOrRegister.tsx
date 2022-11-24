import React, { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import i18next from 'i18next';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@routes/stacks/AuthStack';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useTranslation } from 'react-i18next';
import { useUserStorage } from '@hooks/useUserStorage';
import { useNavigation } from '@react-navigation/native';

import { LOGIN, User } from '@store/slices/userSlice';

import { StatusBar } from 'react-native';

import Wallpaper from '@assets/svgs/wallpaper-login.svg';

import Button from '@components/Button';
import RowOr from '@components/RowOr';

type NavProps = NativeStackNavigationProp<AuthStackParamList>;

export const LoginOrRegister = () => {
  const [loadingLogin, setLoadingLogin] = useState(false);

  const { navigate } = useNavigation<NavProps>();

  const userStorage = useUserStorage();

  const dispatch = useReduxDispatch();

  const { t } = useTranslation();

  const theme = useTheme();

  StatusBar.setBackgroundColor(theme.colors.PRIMARY_200);

  const navigateToLogin = useCallback(() => {
    navigate('Login');
  }, [navigate]);

  const navigateToRegister = useCallback(() => {
    navigate('Register');
  }, [navigate]);

  const login = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      setLoadingLogin(true);

      setTimeout(() => {
        dispatch(LOGIN({ email, password }));

        setLoadingLogin(false);
      }, 1000);
    },
    [dispatch],
  );

  const rememberLogin = useCallback(async () => {
    const data: User = await userStorage.read('user');

    if (data) login({ email: data.email, password: data.password });
  }, [login, userStorage]);

  const getLanguage = useCallback(async () => {
    const data = await userStorage.read('language');

    if (data) {
      i18next.changeLanguage(data);
    }
  }, [userStorage]);

  useEffect(() => {
    setTimeout(() => getLanguage(), 1000);
    setTimeout(() => rememberLogin(), 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledContainer>
      <StyleWallpaper />

      <StyledContent>
        <Button
          title={t('components.button.login')}
          onPress={navigateToLogin}
          containerStyle={{ marginBottom: 8 }}
        />

        <Button
          title={t('components.button.register')}
          onPress={navigateToRegister}
          backgroundColor="trasparent"
          fontColor="GRAY_800"
        />

        <RowOr />

        <Button
          title={t('components.button.loginWithoutRegister')}
          onPress={() =>
            login({ email: 'default@email.com', password: 'default@123' })
          }
          loading={loadingLogin}
          backgroundColor="trasparent"
          fontColor="GRAY_800"
        />
      </StyledContent>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;
  align-self: center;

  background-color: ${({ theme }) => theme.colors.PRIMARY_200};
`;

const StyleWallpaper = styled(Wallpaper)`
  margin-bottom: 24px;
`;

const StyledContent = styled.View`
  width: 100%;
`;
