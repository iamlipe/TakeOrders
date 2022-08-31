import React from 'react';
import styled from 'styled-components/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@routes/stacks/AppStack';

import { useNavigation } from '@react-navigation/native';

type NavProps = NativeStackNavigationProp<AppStackParamList, 'LoggedStack'>;

export const Login = () => {
  const { navigate } = useNavigation<NavProps>();

  return (
    <StyledContainer>
      <StyledTitle>Login</StyledTitle>

      <StyledButton
        title="go to home"
        onPress={() => navigate('LoggedStack')}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.View``;

const StyledTitle = styled.Text``;

const StyledButton = styled.Button``;
