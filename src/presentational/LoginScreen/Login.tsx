import React, { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import i18next from 'i18next';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';
import { useUserStorage } from '@hooks/useUserStorage';

import { GET_DEFAULT_USER, LOGIN, REGISTER } from '@store/slices/userSlice';

import Wallpaper from '@assets/svgs/wallpaper-login.svg';

import { StatusBar } from 'react-native';

import Button from '@components/Button';
import Loading from '@presentational/LoginScreen/Loading';

export const Login = () => {
  const [getUser, setGetUser] = useState(true);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const userStorage = useUserStorage();

  const dispatch = useReduxDispatch();

  const { error, defaultUser, isLoading } = useReduxSelector(
    state => state.user,
  );

  const { t } = useTranslation();

  const theme = useTheme();

  StatusBar.setBackgroundColor(theme.colors.PRIMARY_600);

  const login = useCallback(() => {
    setLoadingLogin(true);

    setTimeout(() => {
      dispatch(LOGIN({ email: 'default@email.com', password: 'default@123' }));

      setLoadingLogin(false);
    }, 1000);
  }, [dispatch]);

  const register = useCallback(() => {
    dispatch(
      REGISTER({
        name: 'default',
        email: 'default@email.com',
        password: 'default@123',
      }),
    );

    setTimeout(() => login(), 1000);
  }, [dispatch, login]);

  const getDefaultUser = useCallback(() => {
    dispatch(GET_DEFAULT_USER({ email: 'default@email.com' }));
  }, [dispatch]);

  const rememberLogin = useCallback(async () => {
    const data = await userStorage.read('user');

    if (data) login();

    setTimeout(() => setGetUser(false), 1000);
  }, [login, userStorage]);

  const getLanguage = useCallback(async () => {
    const data = await userStorage.read('language');

    if (data) {
      i18next.changeLanguage(data);
    }
  }, [userStorage]);

  useEffect(() => {
    getDefaultUser();
    getLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (defaultUser) {
      rememberLogin();
    }
  }, [defaultUser, rememberLogin]);

  useEffect(() => {
    if (error === 'unregistered default user' && !isLoading) register();
  }, [error, isLoading, register]);

  if (getUser) return <Loading />;

  return (
    <StyledContainer>
      <Wallpaper />

      <StyledColumn>
        <Button
          title={t('components.button.loginWithoutRegister')}
          icon={{ name: 'arrow-forward', color: 'WHITE' }}
          align="spaceBetween"
          onPress={login}
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
