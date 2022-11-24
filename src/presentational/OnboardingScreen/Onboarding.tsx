import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import phone1 from '@assets/imgs/onboarding/phone1.png';
import phone2 from '@assets/imgs/onboarding/phone2.png';
import phone3 from '@assets/imgs/onboarding/phone3.png';

import wave1 from '@assets/imgs/onboarding/wave1.png';
import wave2 from '@assets/imgs/onboarding/wave2.png';
import wave3 from '@assets/imgs/onboarding/wave3.png';

import { mySync } from '@database/index';

import { useTranslation } from 'react-i18next';
import { useUserStorage } from '@hooks/useUserStorage';
import { useReduxDispatch } from '@hooks/useReduxDispatch';

import { GET_FIRST_ACCESS } from '@store/slices/userSlice';

import { Image, StatusBar, useWindowDimensions } from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';

import Background from '@components/Background';
import Button from '@components/Button';

interface SlideProps {
  id: number;
  title: string;
  description: string;
  src: Image;
  background: Image;
}

export const Onboarding = () => {
  const { height } = useWindowDimensions();

  const { t } = useTranslation();

  const theme = useTheme();

  const userStorage = useUserStorage();

  const dispatch = useReduxDispatch();

  const slides: SlideProps[] = useMemo(
    () => [
      {
        id: 1,
        title: 'Registres suas comadas de um jeito fácil e rápido',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy ',
        src: phone1,
        background: wave1,
      },
      {
        id: 2,
        title: 'Controle todos os produtos no estoque',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy ',
        src: phone2,
        background: wave2,
      },
      {
        id: 3,
        title: 'Acompanhe o desempenho do seu negócio',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy ',
        src: phone3,
        background: wave3,
      },
    ],
    [],
  );

  StatusBar.setBackgroundColor(theme.colors.PRIMARY_200);

  const handleSync = useCallback(async () => {
    await mySync();
  }, []);

  const handleFirstAccess = useCallback(async () => {
    await userStorage.getDidFirstAccessApp('firstAccessApp');

    dispatch(GET_FIRST_ACCESS());
  }, [dispatch, userStorage]);

  useLayoutEffect(() => {
    handleSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSlide = ({ item }: { item: SlideProps }) => {
    return (
      <Background>
        <StyledContainerSlide>
          <StyledTitle style={{ height: (height - 64) * 0.2 }}>
            {item.title}
          </StyledTitle>

          <StyledContainerImage style={{ height: (height - 64) * 0.9 }}>
            <StyledImage source={item.src} resizeMode="contain" />
          </StyledContainerImage>

          <StyledBackground source={item.background} resizeMode="contain" />
          <StyledDescription>{item.description}</StyledDescription>
        </StyledContainerSlide>
      </Background>
    );
  };

  const renderDone = () => (
    <Button
      title="Concluido"
      onPress={async () => await handleFirstAccess()}
      containerStyle={{ marginLeft: 0, marginRight: 0, width: 100 }}
    />
  );

  const renderNext = () => (
    <StyledButtonNext>
      <StyledButtonTextNext>Proximo</StyledButtonTextNext>
    </StyledButtonNext>
  );

  const renderPrev = () => (
    <StyledButtonPrev>
      <StyledButtonTextPrev>Voltar</StyledButtonTextPrev>
    </StyledButtonPrev>
  );

  const renderSkip = () => (
    <StyledButtonSkip>
      <StyledButtonTextSkip>Pular</StyledButtonTextSkip>
    </StyledButtonSkip>
  );

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderSlide}
      showPrevButton
      showSkipButton
      renderNextButton={renderNext}
      renderDoneButton={renderDone}
      renderPrevButton={renderPrev}
      renderSkipButton={renderSkip}
      activeDotStyle={{
        backgroundColor: theme.colors.GRAY_800,
        width: 6,
        height: 6,
      }}
      dotStyle={{
        backgroundColor: theme.colors.WHITE,
        width: 6,
        height: 6,
      }}
    />
  );
};

const StyledContainerSlide = styled.View`
  width: 100%;
  height: 100%;

  align-items: center;

  background-color: transparent;

  padding: 32px 0;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};

  text-align: center;

  padding: 24px;
`;

const StyledDescription = styled.Text`
  position: absolute;

  z-index: 2;

  bottom: 80px;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};

  text-align: center;

  padding: 16px;
`;

const StyledContainerImage = styled.View`
  width: 75%;

  justify-content: center;
`;

const StyledImage = styled.Image`
  width: 100%;

  align-self: center;
`;

const StyledBackground = styled.Image`
  position: absolute;

  z-index: 1;

  bottom: -290px;

  width: 100%;
`;

const StyledButtonNext = styled.View`
  width: 100px;
  height: 44px;

  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.BLACK};

  padding: 8px 12px;
`;

const StyledButtonTextNext = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledButtonPrev = styled(StyledButtonNext)`
  background-color: transparent;
`;

const StyledButtonTextPrev = styled(StyledButtonTextNext)`
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
`;

const StyledButtonSkip = styled(StyledButtonPrev)``;

const StyledButtonTextSkip = styled(StyledButtonTextPrev)``;
