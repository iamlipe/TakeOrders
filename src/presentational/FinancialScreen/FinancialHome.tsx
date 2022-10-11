import React, { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FinancialStackParamList } from '@routes/stacks/FinancialStack';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { GET_PURCHASES } from '@store/slices/purchaseSlice';

import EmptyExtract from '@assets/svgs/empty-extract.svg';

import { Dimensions, StatusBar } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import ScrollableButton from '@components/ScrollableButton';
import Loading from '@components/Loading';
import FinancialCard from '@components/FinancialCard';
import { GET_INVOICE } from '@store/slices/invoiceSlice';
import { RFValue } from 'react-native-responsive-fontsize';

interface ContainerEmptyExtract {
  height: number;
}

type NavProps = NativeStackNavigationProp<
  FinancialStackParamList,
  'FinancialInvoicing' | 'FinancialProfit' | 'FinancialSpending'
>;

const { height } = Dimensions.get('window');

const heigthList =
  height - (120 + 32 + height * 0.1 + 32 + RFValue(24) + 16 + 32 + 72);

export const FinancialHome = () => {
  const [showContent, setShowContent] = useState(false);

  const dispatch = useReduxDispatch();

  const { auth } = useReduxSelector(state => state.user);
  const { allInvoicies } = useReduxSelector(state => state.invoice);

  const isFocused = useIsFocused();

  const { navigate } = useNavigation<NavProps>();

  const { t } = useTranslation();

  const theme = useTheme();

  const getInvoicies = useCallback(() => {
    if (auth) {
      dispatch(GET_INVOICE({ userId: auth.id }));
    }
  }, [auth, dispatch]);

  useEffect(() => {
    getInvoicies();
  }, [getInvoicies, isFocused]);

  useEffect(() => {
    if (allInvoicies) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allInvoicies]);

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title={t('components.header.financialHome')} />

      {showContent ? (
        <StyledContent>
          <StyledContainerButtons>
            <ScrollableButton
              buttons={[
                {
                  iconName: 'shopping-cart',
                  onPress: () => navigate('FinancialSpending'),
                  title: t('components.scrollableButton.spending'),
                },
                {
                  iconName: 'local-offer',
                  onPress: () => navigate('FinancialInvoicing'),
                  title: t('components.scrollableButton.invoicing'),
                },
                {
                  iconName: 'attach-money',
                  onPress: () => navigate('FinancialProfit'),
                  title: t('components.scrollableButton.profit'),
                },
              ]}
            />
          </StyledContainerButtons>

          <StyledTitleExtract>
            {t('screens.financialHome.extract')}
          </StyledTitleExtract>

          {allInvoicies?.length ? (
            <FlatList
              data={allInvoicies}
              renderItem={({ item }) => (
                <FinancialCard
                  key={item.id}
                  item={{
                    title: item.name,
                    date: item.createdAt,
                    price: item.price,
                  }}
                />
              )}
              keyExtractor={item => item.id}
              style={{
                height: StatusBar.currentHeight
                  ? heigthList - StatusBar.currentHeight
                  : heigthList,
                marginVertical: 16,
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <StyledContainerEmptyExtract
              height={
                StatusBar.currentHeight
                  ? heigthList - StatusBar.currentHeight
                  : heigthList
              }
            >
              <EmptyExtract width={132} height={132} />
              <StyledTextEmptyExtract>
                {t('screens.financialHome.textEmptyExtract')}
              </StyledTextEmptyExtract>
            </StyledContainerEmptyExtract>
          )}
        </StyledContent>
      ) : (
        <Loading />
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContent = styled.View`
  padding: 32px;
`;

const StyledContainerButtons = styled.View`
  height: ${height * 0.1}px;

  margin-bottom: 32px;
`;

const StyledTitleExtract = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(24)}px;

  margin-bottom: 16px;
`;

const StyledContainerEmptyExtract = styled.View<ContainerEmptyExtract>`
  height: ${StatusBar.currentHeight
    ? height -
      StatusBar.currentHeight -
      120 -
      72 -
      RFValue(24) -
      32 -
      70 -
      32 -
      32
    : height - 120 - 72 - RFValue(24) - 32 - 70 - 32 - 32}px;

  justify-content: center;
  align-items: center;

  margin-top: -32px;
`;

const StyledTextEmptyExtract = styled.Text`
  width: 60%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-top: 16px;
`;
