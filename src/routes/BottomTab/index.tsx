import React, { useEffect } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Dimensions } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import BillIcon from '@assets/svgs/bill.svg';
import FinancialIcon from '@assets/svgs/financial.svg';
import StockIcon from '@assets/svgs/stock.svg';

import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ParamListBase,
  TabNavigationState,
  useNavigation,
} from '@react-navigation/native';

import { LoggedStackParamList } from '@routes/stacks/LoggedStack';

type NavPropsProducer = NativeStackNavigationProp<
  LoggedStackParamList,
  'BillStack' | 'FinancialHome' | 'StockHome'
>;

interface TitleTabProps {
  active: boolean;
}

interface ButtonTabProps {
  state: TabNavigationState<ParamListBase>;
}

const { width } = Dimensions.get('window');

export const ButtonTab = ({ state }: ButtonTabProps) => {
  const lineTranslateX = useSharedValue(width * 0.2 - 30);

  const { navigate } = useNavigation<NavPropsProducer>();

  const activeTab = state.routes[state.index].name;

  const { t } = useTranslation();

  const theme = useTheme();

  useEffect(() => {
    if (activeTab === 'BillStack') {
      lineTranslateX.value = withTiming(width * 0.2 - 30, { duration: 200 });
    }

    if (activeTab === 'StockHome') {
      lineTranslateX.value = withTiming(width * 0.5 - 30, { duration: 200 });
    }

    if (activeTab === 'FinancialHome') {
      lineTranslateX.value = withTiming(width * 0.8 - 30, { duration: 200 });
    }
  });

  const animatedStyledLine = useAnimatedStyle(() => {
    return {
      left: lineTranslateX.value,
    };
  });

  const renderTab = (
    Icon: () => JSX.Element,
    title: string,
    route: keyof LoggedStackParamList,
  ) => (
    <StyledBaseButton onPress={() => navigate(route)}>
      <Icon />
      <StyledTitleTab active={activeTab === route}>{title}</StyledTitleTab>
    </StyledBaseButton>
  );

  return (
    <StyledBottonTabContainer style={{ elevation: 5 }}>
      <StyledButtonTabRow>
        {renderTab(
          () => (
            <BillIcon
              fill={
                activeTab === 'BillStack'
                  ? theme.colors.PRIMARY_600
                  : theme.colors.GRAY_800
              }
            />
          ),
          t('components.bottomTab.bill'),
          'BillStack',
        )}
        {renderTab(
          () => (
            <StockIcon
              fill={
                activeTab === 'StockHome'
                  ? theme.colors.PRIMARY_600
                  : theme.colors.GRAY_800
              }
            />
          ),
          t('components.bottomTab.stock'),
          'StockHome',
        )}
        {renderTab(
          () => (
            <FinancialIcon
              fill={
                activeTab === 'FinancialHome'
                  ? theme.colors.PRIMARY_600
                  : theme.colors.GRAY_800
              }
            />
          ),
          t('components.bottomTab.financial'),
          'FinancialHome',
        )}
      </StyledButtonTabRow>
      <StyledLine style={animatedStyledLine} />
    </StyledBottonTabContainer>
  );
};

const StyledBottonTabContainer = styled.SafeAreaView`
  height: 72px;

  align-items: center;
  justify-content: center;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  background-color: ${({ theme }) => theme.colors.GRAY_100};
`;

const StyledButtonTabRow = styled.View`
  width: 90%;

  flex-direction: row;

  justify-content: space-between;
  align-self: center;
`;

const StyledBaseButton = styled.TouchableOpacity`
  width: 33%;

  align-items: center;
  justify-content: flex-end;
`;

const StyledTitleTab = styled.Text<TitleTabProps>`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme, active }) =>
    active ? theme.colors.PRIMARY_600 : theme.colors.GRAY_800};
`;

const StyledLine = styled(Animated.View)`
  position: absolute;

  left: ${width * 0.2 - 30}px;
  top: 58px;

  width: 60px;
  height: 2px;

  background-color: ${({ theme }) => theme.colors.PRIMARY_500};
`;
