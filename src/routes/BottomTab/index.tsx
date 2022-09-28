import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Dimensions, Keyboard, Platform } from 'react-native';

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
  'BillStack' | 'FinancialHome' | 'StockStack'
>;

interface TitleTabProps {
  active: boolean;
}

interface ButtonTabProps {
  state: TabNavigationState<ParamListBase>;
}

const { width } = Dimensions.get('window');

export const BottonTab = ({ state }: ButtonTabProps) => {
  const [showIcons, setShowIcons] = useState(true);

  const opacityIcons = useSharedValue(1);
  const heightBottomTab = useSharedValue(72);
  const lineTranslateX = useSharedValue(width * 0.2 - 30);

  const { navigate } = useNavigation<NavPropsProducer>();

  const activeTab = state.routes[state.index].name;

  const { t } = useTranslation();

  const theme = useTheme();

  // esconder tab bar quando abrir o teclado https://github.com/react-navigation/react-navigation/issues/6700
  useEffect(() => {
    let keyboardEventListeners: { remove: () => void }[];

    if (Platform.OS === 'android') {
      keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', () => {
          heightBottomTab.value = withTiming(0, { duration: 200 });
          opacityIcons.value = withTiming(0, { duration: 125 });
          setTimeout(() => setShowIcons(false), 100);
        }),
        Keyboard.addListener('keyboardDidHide', () => {
          heightBottomTab.value = withTiming(72, { duration: 200 });
          opacityIcons.value = withTiming(1, { duration: 125 });
          setTimeout(() => setShowIcons(true), 100);
        }),
      ];
    }

    return () => {
      if (Platform.OS === 'android') {
        keyboardEventListeners &&
          keyboardEventListeners.forEach(
            (eventListener: { remove: () => void }) => eventListener.remove(),
          );
      }
    };
  }, [heightBottomTab, opacityIcons]);

  useEffect(() => {
    if (activeTab === 'BillStack') {
      lineTranslateX.value = withTiming(width * 0.2 - 30, { duration: 200 });
    }

    if (activeTab === 'StockStack') {
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

  const animatedStyledHeightBottomTab = useAnimatedStyle(() => {
    return {
      height: heightBottomTab.value,
    };
  });

  const animatedStyledOpacityIcon = useAnimatedStyle(() => {
    return {
      opacity: opacityIcons.value,
    };
  });

  const renderTab = (
    Icon: () => JSX.Element,
    title: string,
    route: keyof LoggedStackParamList,
  ) => (
    <StyledBaseButton onPress={() => navigate(route)}>
      <Animated.View
        style={[
          {
            display: showIcons ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyledOpacityIcon,
        ]}
      >
        <Icon />
        <StyledTitleTab active={activeTab === route}>{title}</StyledTitleTab>
      </Animated.View>
    </StyledBaseButton>
  );

  return (
    <StyledBottonTabContainer
      style={[{ elevation: 20 }, animatedStyledHeightBottomTab]}
    >
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
                activeTab === 'StockStack'
                  ? theme.colors.PRIMARY_600
                  : theme.colors.GRAY_800
              }
            />
          ),
          t('components.bottomTab.stock'),
          'StockStack',
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

const StyledBottonTabContainer = styled(Animated.View)`
  align-items: center;
  justify-content: center;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  background-color: ${({ theme }) => theme.colors.WHITE};
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
