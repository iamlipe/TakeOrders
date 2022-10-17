import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';

import { GET_INVOICE, InvoiceResponse } from '@store/slices/invoiceSlice';

import { filterAllByMonth } from '@utils/filterByDate';

import EmptyChart from '@assets/svgs/empty-chart-1.svg';

import { Dimensions, FlatList } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import FinancialCard from '@components/FinancialCard';
import Loading from '@components/Loading';
import Overview from '@components/Overview';

const { height } = Dimensions.get('window');

export const FinancialInvoicing = () => {
  const [showContent, setShowContent] = useState(false);
  const [invoicingFilteredByMonth, setInvoicingFilteredByMonth] = useState<
    InvoiceResponse[][] | null
  >(null);

  const dispatch = useReduxDispatch();

  const { auth } = useReduxSelector(state => state.user);
  const { allInvoicies } = useReduxSelector(state => state.invoice);

  const isFocused = useIsFocused();

  const { goBack } = useNavigation();

  const { t } = useTranslation();

  const theme = useTheme();

  const heightList = useMemo(
    () => height - 120 - 32 - RFValue(24) - 8 - 220 - 32 - 32 - 72,
    [],
  );

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

  useEffect(() => {
    if (allInvoicies?.length) {
      const data = filterAllByMonth({
        data: allInvoicies,
      }) as unknown as InvoiceResponse[][];

      setInvoicingFilteredByMonth(data);
    }
  }, [allInvoicies]);

  const renderContent = () => {
    if (showContent) {
      return (
        <StyledContent>
          {invoicingFilteredByMonth ? (
            <>
              <StyledTitleOverview>
                {t('screens.financialInvoicing.overview')}
              </StyledTitleOverview>

              {invoicingFilteredByMonth && (
                <Overview
                  data={invoicingFilteredByMonth?.map(invoicingMonth => {
                    return {
                      months: invoicingMonth.length
                        ? new Date(
                            invoicingMonth[0].createdAt,
                          ).toLocaleDateString('pt-br', { month: 'long' })
                        : new Date().toLocaleDateString('pt-br', {
                            month: 'long',
                          }),
                      earnings: invoicingMonth.reduce(
                        (prev, curr) => prev + curr.price,
                        0,
                      ),
                    };
                  })}
                  type="invoicing"
                />
              )}

              <FlatList
                data={allInvoicies}
                renderItem={({ item }) => (
                  <FinancialCard
                    key={item.id}
                    item={{
                      title: item.name,
                      price: item.price,
                      date: item.createdAt,
                    }}
                  />
                )}
                style={{
                  height: heightList,
                  marginVertical: 16,
                  paddingHorizontal: 32,
                }}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <StyledContainerEmptyInvoicing style={{ height: heightList }}>
              <EmptyChart width={132} height={132} />
              <StyledTextEmptyInvoicing>
                {t('screens.financialInvoicing.textEmptyInvoicing')}
              </StyledTextEmptyInvoicing>
            </StyledContainerEmptyInvoicing>
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
        allInvoicies,
        heightList,
        invoicingFilteredByMonth,
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

const StyledContainerEmptyInvoicing = styled.View`
  justify-content: center;
  align-items: center;

  margin-top: -32px;
`;

const StyledTextEmptyInvoicing = styled.Text`
  width: 80%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-top: 16px;
`;
