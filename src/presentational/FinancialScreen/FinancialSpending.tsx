import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { Purchase as PurchaseModel } from '@database/models/purchaseModel';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { GET_PURCHASES } from '@store/slices/purchaseSlice';

import { filterAllByMonth } from '@utils/filterByDate';
import { RFValue } from 'react-native-responsive-fontsize';

import EmptyChart from '@assets/svgs/empty-chart-3.svg';

import { Dimensions, RefreshControl } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import FinancialCard from '@components/FinancialCard';
import Loading from '@components/Loading';
import Overview from '@components/Overview';

const { height } = Dimensions.get('window');

export const FinancialSpending = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [spendingFilteredByMonth, setSpendingFilteredByMonth] = useState<
    PurchaseModel[][] | null
  >(null);

  const dispatch = useReduxDispatch();

  const { allPurchases, isLoading } = useReduxSelector(state => state.purchase);

  const isFocused = useIsFocused();

  const { goBack } = useNavigation();

  const { t } = useTranslation();

  const theme = useTheme();

  const heightList = useMemo(
    () => height - 120 - 32 - RFValue(24) - 8 - 220 - 16 - 72 - 120,
    [],
  );

  const getPurchases = useCallback(() => {
    dispatch(GET_PURCHASES());
  }, [dispatch]);

  const handleDataOverview = useCallback(() => {
    const result = spendingFilteredByMonth?.map(spendingMonth => {
      return {
        months: spendingMonth.length
          ? new Date(spendingMonth[0].createdAt).toLocaleDateString('pt-br', {
              month: 'long',
            })
          : new Date().toLocaleDateString('pt-br', {
              month: 'long',
            }),
        earnings: spendingMonth.reduce(
          (prev, curr) => prev + curr.totalPrice * -1,
          0,
        ),
      };
    });

    return result || [];
  }, [spendingFilteredByMonth]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getPurchases();

    setTimeout(() => setRefreshing(false), 1000);
  }, [getPurchases]);

  useEffect(() => {
    getPurchases();
  }, [getPurchases, isFocused, isLoading]);

  useEffect(() => {
    if (allPurchases?.length) {
      const data = filterAllByMonth({
        data: allPurchases,
      }) as unknown as PurchaseModel[][];

      setSpendingFilteredByMonth(data);
    }
  }, [allPurchases]);

  useLayoutEffect(() => {
    if (allPurchases) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allPurchases]);

  const renderListPurchase = () =>
    allPurchases &&
    [...allPurchases].reverse().map(item => (
      <FinancialCard
        key={item.id}
        item={{
          title: item.product?.name || item.expanse,
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
        title={t('components.header.financialSpending')}
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
          {spendingFilteredByMonth ? (
            <>
              <StyledTitleOverview>
                {t('screens.financialSpending.overview')}
              </StyledTitleOverview>
              <Overview data={handleDataOverview()} type="spending" />

              <StyledContainerCardFinancial style={{ minHeight: heightList }}>
                {renderListPurchase()}
              </StyledContainerCardFinancial>
            </>
          ) : (
            <StyledContainerEmptySpending
              style={{ height: heightList + 220 + RFValue(24) + 8 }}
            >
              <EmptyChart width={132} height={132} />
              <StyledTextEmptySpending>
                {t('screens.financialSpending.textEmptySpending')}
              </StyledTextEmptySpending>
            </StyledContainerEmptySpending>
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

const StyledContainerEmptySpending = styled.View`
  justify-content: center;
  align-items: center;

  margin: 16px 0;
`;

const StyledTextEmptySpending = styled.Text`
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
