import React from 'react';
import styled from 'styled-components/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@routes/stacks/AppStack';

import { useNavigation } from '@react-navigation/native';

type NavProps = NativeStackNavigationProp<AppStackParamList, 'AuthStack'>;

export const Home = () => {
  const { navigate } = useNavigation<NavProps>();

  return (
    <StyledContainer>
      <StyledTitle>Home</StyledTitle>

      <StyledButton title="logout" onPress={() => navigate('AuthStack')} />
    </StyledContainer>
  );
};

const StyledContainer = styled.View``;

const StyledTitle = styled.Text``;

const StyledButton = styled.Button``;
