import React, { useCallback, useEffect, useState } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GET_FIRST_ACCESS } from '@store/slices/userSlice';

import { useReduxSelector } from '@hooks/useReduxSelector';
import { useReduxDispatch } from '@hooks/useReduxDispatch';

import { Onboarding } from '@presentational/OnboardingScreen/Onboarding';
import { AuthStack } from './AuthStack';
import { LoggedStack } from './LoggedStack';
import { PlanStack } from './PlanStack';
import { GlobalStack } from './GlobalStack';

import Loading from '@routes/Loading';

export type AppStackParamList = {
  Onboarding: undefined;
  AuthStack: undefined;
  LoggedStack: undefined;
  PlanStack: undefined;
  GlobalStack: undefined;
};

const App = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useReduxDispatch();
  const { firstAccess } = useReduxSelector(state => state.user);

  const { auth } = useReduxSelector(state => state.user);

  const getFirstAccess = useCallback(() => {
    dispatch(GET_FIRST_ACCESS());
  }, [dispatch]);

  useEffect(() => {
    getFirstAccess();

    setTimeout(() => setIsLoading(false), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(firstAccess);

  if (isLoading) return <Loading />;

  return (
    <App.Navigator screenOptions={{ headerShown: false }}>
      {!firstAccess && <App.Screen name="Onboarding" component={Onboarding} />}

      {!auth ? (
        <App.Screen name="AuthStack" component={AuthStack} />
      ) : (
        <App.Screen name="LoggedStack" component={LoggedStack} />
      )}

      <App.Screen name="PlanStack" component={PlanStack} />
      <App.Screen name="GlobalStack" component={GlobalStack} />
    </App.Navigator>
  );
};
