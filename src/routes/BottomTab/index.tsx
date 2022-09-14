import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ParamListBase,
  TabNavigationState,
  useNavigation,
} from '@react-navigation/native';

import { LoggedStackParamList } from '@routes/stacks/LoggedStack';

type NavPropsProducer = NativeStackNavigationProp<
  LoggedStackParamList,
  'BillHome' | 'FinancialHome' | 'StockHome'
>;

interface Props {
  state: TabNavigationState<ParamListBase>;
}

export const ButtonTab: React.FC<Props> = ({ state }) => {
  const { navigate } = useNavigation<NavPropsProducer>();
  const activeTab = state.routes[state.index].name;
  const theme = useTheme();

  const renderTab = (
    iconName: string,
    title: string,
    route: keyof LoggedStackParamList,
  ) => (
    <StyledButtonInactive onPress={() => navigate(route)}>
      <Icon
        name={iconName}
        size={24}
        color={
          activeTab === route ? theme.colors.PRIMARY_600 : theme.colors.GRAY_800
        }
      />
      {activeTab === route ? (
        <StyledTextActive>{title}</StyledTextActive>
      ) : (
        <StyledTextInactive>{title}</StyledTextInactive>
      )}
    </StyledButtonInactive>
  );

  return (
    <StyledBottonTabContainer>
      <StyledButtonTabRow>
        {renderTab('receipt-long', 'Comandas', 'BillHome')}
        {renderTab('inventory', 'Estoque', 'StockHome')}
        {renderTab('account-balance-wallet', 'Comandas', 'FinancialHome')}
      </StyledButtonTabRow>
    </StyledBottonTabContainer>
  );
};

export const StyledBottonTabContainer = styled.SafeAreaView`
  height: 49px;
  background-color: ${({ theme }) => theme.colors.GRAY_100};

  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.12);
`;

export const StyledButtonTabRow = styled.View`
  width: 90%;

  flex-direction: row;
  justify-content: space-between;
  align-self: center;
`;

export const StyledButtonInactive = styled.TouchableOpacity`
  width: 25%;

  align-items: center;
  justify-content: flex-end;
`;

export const StyledTextInactive = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-top: 5px;
`;

export const StyledTextActive = styled(StyledTextInactive)`
  background-color: ${({ theme }) => theme.colors.PRIMARY_100};
  border-radius: 10px;

  padding: 0 10px;
`;
