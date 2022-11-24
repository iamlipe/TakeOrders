import React from 'react';
import styled from 'styled-components/native';

import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '@components/Header';
import Background from '@components/Background';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';
import PlanCard from './PlanCard';

export const ChosePlan = () => {
  const { height } = useWindowDimensions();

  const { goBack } = useNavigation();

  return (
    <Background>
      <StyledContainer
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: height - 24,
        }}
      >
        <Header
          onPress={goBack}
          backgroundColor="BACKGROUND_TRANSPARENT"
          type="justBackButton"
        />
        <Title>Chose Plan</Title>
        <Subtitle>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered
        </Subtitle>

        <PlanCard />
      </StyledContainer>
    </Background>
  );
};

const StyledContainer = styled.ScrollView``;
