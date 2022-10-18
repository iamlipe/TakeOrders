import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { Sales as SalesModel } from '@database/models/salesModel';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { RFValue } from 'react-native-responsive-fontsize';
import { GET_SALES } from '@store/slices/saleSlice';

import { filterAllByMonth } from '@utils/filterByDate';

import EmptyChart from '@assets/svgs/empty-chart-2.svg';

import { Dimensions, FlatList } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import FinancialCard from '@components/FinancialCard';
import Loading from '@components/Loading';
import Overview from '@components/Overview';

const { height } = Dimensions.get('window');

export const FinancialInvoicing = () => {
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
    () => height - 120 - 32 - RFValue(24) - 8 - 220 - 16 - 16 - 72,
    [],
  );

  const getSales = useCallback(() => {
    if (auth) {
      dispatch(GET_SALES({ userId: auth.id }));
    }
  }, [auth, dispatch]);

  useEffect(() => {
    getSales();
  }, [getSales, isFocused]);

  useEffect(() => {
    if (allSales && !isLoading) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allSales, isLoading]);

  useEffect(() => {
    if (allSales?.length) {
      const data = filterAllByMonth({
        data: allSales,
      }) as unknown as SalesModel[][];

      setProfitFilteredByMonth(data);
    }
  }, [allSales]);

  const renderContent = () => {
    if (showContent) {
      return (
        <StyledContent>
          {profitFilteredByMonth ? (
            <>
              <StyledTitleOverview>
                {t('screens.financialProfit.overview')}
              </StyledTitleOverview>

              {profitFilteredByMonth && (
                <Overview
                  data={profitFilteredByMonth.map(profitMonth => {
                    return {
                      months: profitMonth.length
                        ? new Date(profitMonth[0].createdAt).toLocaleDateString(
                            'pt-br',
                            { month: 'long' },
                          )
                        : new Date().toLocaleDateString('pt-br', {
                            month: 'long',
                          }),
                      earnings: profitMonth.reduce(
                        (prev, curr) => prev + curr.totalPrice,
                        0,
                      ),
                    };
                  })}
                  type="profit"
                />
              )}

              <FlatList
                data={allSales}
                renderItem={({ item }) => (
                  <FinancialCard
                    key={item.id}
                    item={{
                      title: item.name,
                      date: item.createdAt,
                      price: item.totalPrice,
                    }}
                  />
                )}
                style={{
                  height: heightList,
                  marginTop: 16,
                }}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
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
      );
    }

    return <Loading />;
  };

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

      {useMemo(renderContent, [
        allSales,
        heightList,
        profitFilteredByMonth,
        showContent,
        t,
      ])}
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContent = styled.View`
  padding: 32px 0;
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
