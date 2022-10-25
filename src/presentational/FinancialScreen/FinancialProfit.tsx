import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';

import { GET_PROFIT, ProfitResponse } from '@store/slices/profitSlice';

import { filterAllByMonth } from '@utils/filterByDate';

import EmptyChart from '@assets/svgs/empty-chart-1.svg';

import { Dimensions, RefreshControl } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import FinancialCard from '@components/FinancialCard';
import Loading from '@components/Loading';
import Overview from '@components/Overview';
import i18next from '@i18n/index';

const { height } = Dimensions.get('window');

export const FinancialProfit = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [profitFilteredByMonth, setProfitFilteredByMonth] = useState<
    ProfitResponse[][] | null
  >(null);

  const dispatch = useReduxDispatch();

  const { auth } = useReduxSelector(state => state.user);
  const { allProfit, isLoading } = useReduxSelector(state => state.profit);

  const isFocused = useIsFocused();

  const { goBack } = useNavigation();

  const { t } = useTranslation();

  const theme = useTheme();

  const heightList = useMemo(
    () => height - 120 - 32 - RFValue(24) - 8 - 220 - 16 - 72 - 120,
    [],
  );

  const getProfit = useCallback(() => {
    if (auth) {
      dispatch(GET_PROFIT({ userId: auth.id }));
    }
  }, [auth, dispatch]);

  const handleDataOverview = useCallback(() => {
    const result = profitFilteredByMonth?.map(invoicingMonth => {
      return {
        month: invoicingMonth.length
          ? new Date(invoicingMonth[0].createdAt).toLocaleDateString(
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

        x: invoicingMonth.length
          ? new Date(invoicingMonth[0].createdAt).toLocaleDateString(
              i18next.language,
              {
                month: 'long',
              },
            )
          : new Date().toLocaleDateString(i18next.language, {
              month: 'long',
            }),

        y: invoicingMonth.reduce((prev, curr) => prev + curr.price, 0),
      };
    });

    return result || [];
  }, [profitFilteredByMonth]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getProfit();

    setTimeout(() => setRefreshing(false), 1000);
  }, [getProfit]);

  useEffect(() => {
    getProfit();
  }, [getProfit, isFocused, isLoading]);

  useEffect(() => {
    if (allProfit?.length) {
      const data = filterAllByMonth({
        data: allProfit,
      }) as unknown as ProfitResponse[][];

      setProfitFilteredByMonth(data);
    }
  }, [allProfit]);

  useLayoutEffect(() => {
    if (allProfit) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allProfit]);

  const renderListProfit = () =>
    allProfit?.map(item => (
      <FinancialCard
        key={item.id}
        item={{
          title: item.name,
          price: item.price,
          date: item.createdAt,
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
      <Header title={t('components.header.financialProfit')} onPress={goBack} />

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
                {t('screens.financialInvoicing.overview')}
              </StyledTitleOverview>

              <Overview data={handleDataOverview()} type="invoicing" />

              <StyledContainerCardFinancial style={{ minHeight: heightList }}>
                {renderListProfit()}
              </StyledContainerCardFinancial>
            </>
          ) : (
            <StyledContainerEmptyInvoicing
              style={{ height: heightList + 220 + RFValue(24) + 8 }}
            >
              <EmptyChart width={132} height={132} />
              <StyledTextEmptyInvoicing>
                {t('screens.financialInvoicing.textEmptyInvoicing')}
              </StyledTextEmptyInvoicing>
            </StyledContainerEmptyInvoicing>
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

const StyledContainerEmptyInvoicing = styled.View`
  justify-content: center;
  align-items: center;

  margin: 16px 0;
`;

const StyledTextEmptyInvoicing = styled.Text`
  width: 80%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-top: 16px;
`;

const StyledContainerCardFinancial = styled.View`
  margin-top: 16px;
`;
