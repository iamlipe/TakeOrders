import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { Sales as SalesModel } from '@database/models/salesModel';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { GET_SALES } from '@store/slices/saleSlice';

import { RFValue } from 'react-native-responsive-fontsize';
import { filterAllByMonth } from '@utils/filterByDate';

import EmptyChart from '@assets/svgs/empty-chart-2.svg';

import { Dimensions, RefreshControl } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import FinancialCard from '@components/FinancialCard';
import Loading from '@components/Loading';
import Overview from '@components/Overview';
import i18next from '@i18n/index';

const { height } = Dimensions.get('window');

export const FinancialInvoicing = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [profitFilteredByMonth, setProfitFilteredByMonth] = useState<
    SalesModel[][] | null
  >(null);

  const dispatch = useReduxDispatch();

  const { auth } = useReduxSelector(state => state.user);
  const { allSales, isLoading } = useReduxSelector(state => state.sale);

  const isFocused = useIsFocused();

  const { goBack } = useNavigation();

  const { t } = useTranslation();

  const theme = useTheme();

  const heightList = useMemo(
    () => height - 120 - RFValue(24) - 8 - 220 - 16 - 72 - 120,
    [],
  );

  const getSales = useCallback(() => {
    if (auth) {
      dispatch(GET_SALES({ userId: auth.id }));
    }
  }, [auth, dispatch]);

  const handleDataOverview = useCallback(() => {
    const result = profitFilteredByMonth?.map(profitMonth => {
      return {
        month: profitMonth.length
          ? new Date(profitMonth[0].createdAt).toLocaleDateString(
              i18next.language,
              {
                month: 'numeric',
                year: 'numeric',
              },
            )
          : new Date().toLocaleDateString(i18next.language, {
              month: 'numeric',
              year: 'numeric',
            }),

        x: profitMonth.length
          ? new Date(profitMonth[0].createdAt).toLocaleDateString(
              i18next.language,
              {
                month: 'long',
              },
            )
          : new Date().toLocaleDateString(i18next.language, {
              month: 'long',
            }),

        y: profitMonth.reduce((prev, curr) => prev + curr.totalPrice, 0),
      };
    });

    return result || [];
  }, [profitFilteredByMonth]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getSales();

    setTimeout(() => setRefreshing(false), 1000);
  }, [getSales]);

  useEffect(() => {
    getSales();
  }, [getSales, isFocused, isLoading]);

  useEffect(() => {
    if (allSales?.length) {
      const data = filterAllByMonth({
        data: allSales,
      }) as unknown as SalesModel[][];

      setProfitFilteredByMonth(data);
    }
  }, [allSales]);

  useLayoutEffect(() => {
    if (allSales) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allSales]);

  const renderListSales = () =>
    allSales &&
    [...allSales].reverse().map(item => (
      <FinancialCard
        key={item.id}
        item={{
          title: item.name,
          date: item.createdAt,
          price: item.totalPrice,
        }}
      />
    ));

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header
        title={t('components.header.financialInvoicing')}
        onPress={goBack}
      />

      {showContent ? (
        <StyledContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {profitFilteredByMonth ? (
            <>
              <StyledTitleOverview>
                {t('screens.financialProfit.overview')}
              </StyledTitleOverview>
              <Overview data={handleDataOverview()} type="profit" />
              <StyledContainerCardFinancial style={{ minHeight: heightList }}>
                {renderListSales()}
              </StyledContainerCardFinancial>
            </>
          ) : (
            <StyledContainerEmptyProfit
              style={{ height: heightList + 220 + RFValue(24) + 8 }}
            >
              <EmptyChart width={132} height={132} />
              <StyledTextEmptyProfit>
                {t('screens.financialProfit.textEmptyProfit')}
              </StyledTextEmptyProfit>
            </StyledContainerEmptyProfit>
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

const StyledContent = styled.ScrollView`
  margin-bottom: 120px;
`;

const StyledTitleOverview = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALL};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(24)}px;

  padding: 0 32px;
  margin-bottom: 8px;
`;

const StyledContainerEmptyProfit = styled.View`
  justify-content: center;
  align-items: center;

  margin: 16px 0;
`;

const StyledTextEmptyProfit = styled.Text`
  width: 80%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-top: 16px;
`;

const StyledContainerCardFinancial = styled.View`
  margin: 16px 0;
`;
