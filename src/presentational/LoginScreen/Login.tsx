import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/native';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { GET_DEFAULT_USER, LOGIN, REGISTER } from '@store/slices/userSlice';

import Wallpaper from '@assets/svgs/wallpaper-login.svg';

import Button from '@components/Button';
import Loading from '@presentational/LoginScreen/Loading';

export const Login = () => {
  const [getUser, setGetUser] = useState(true);

  const dispatch = useReduxDispatch();
  const { error, defaultUser, isLoading } = useReduxSelector(
    state => state.user,
  );

  const { t } = useTranslation();

  const getDefaultUser = useCallback(() => {
    dispatch(GET_DEFAULT_USER({ email: 'default@email.com' }));

    setTimeout(() => setGetUser(false), 1000);
  }, [dispatch]);

  const register = useCallback(() => {
    dispatch(
      REGISTER({
        name: 'default',
        email: 'default@email.com',
        password: 'default@123',
      }),
    );
  }, [dispatch]);

  const login = useCallback(() => {
    dispatch(LOGIN({ email: 'default@email.com', password: 'default@123' }));
  }, [dispatch]);

  useEffect(() => {
    getDefaultUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (defaultUser && !isLoading) login();
  }, [defaultUser, isLoading, login]);

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
          onPress={getDefaultUser}
          loading={!!defaultUser && isLoading}
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
