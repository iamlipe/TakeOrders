import React, { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import i18next from 'i18next';

import { mySync } from '@database/index';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useTranslation } from 'react-i18next';
import { useUserStorage } from '@hooks/useUserStorage';

import { LOGIN } from '@store/slices/userSlice';

import Wallpaper from '@assets/svgs/wallpaper-login.svg';

import { StatusBar } from 'react-native';

import Button from '@components/Button';
import Loading from '@presentational/LoginScreen/Loading';
import { User } from '@database/models/userModel';

export const Login = () => {
  const [loadingRemember, setLoadingRemember] = useState(true);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const userStorage = useUserStorage();

  const dispatch = useReduxDispatch();

  const { t } = useTranslation();

  const theme = useTheme();

  StatusBar.setBackgroundColor(theme.colors.PRIMARY_600);

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

  const getFirstAccessApp = useCallback(async () => {
    const data = await userStorage.read('firstAccessApp');

    if (!data) {
      await mySync();

      await userStorage.getDidFirstAccessApp('firstAccessApp');
    } else {
      rememberLogin();
    }
  }, [rememberLogin, userStorage]);

  useEffect(() => {
    setTimeout(() => getLanguage(), 1000);
    setTimeout(() => getFirstAccessApp(), 1500);
    setTimeout(() => setLoadingRemember(false), 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingRemember) return <Loading />;

  return (
    <StyledContainer>
      <Wallpaper />

      <StyledColumn>
        <Button
          title={t('components.button.loginWithoutRegister')}
          icon={{ name: 'arrow-forward', color: 'WHITE' }}
          align="spaceBetween"
          onPress={() =>
            login({ email: 'default@email.com', password: 'default@123' })
          }
          loading={loadingLogin}
        />
      </StyledColumn>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;
  align-self: center;

  background-color: ${({ theme }) => theme.colors.PRIMARY_600};
`;

const StyledColumn = styled.View`
  width: 100%;

  margin-top: 100px;
`;
