import Background from '@components/Background';
import FinancialCard from '@components/FinancialCard';
import Header from '@components/Header';
import { Sales } from '@database/models/salesModel';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import date from '@nozbe/watermelondb/decorators/date';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { GET_PROFIT, ProfitResponse } from '@store/slices/profitSlice';
import { GET_PURCHASES, PurchaseResponse } from '@store/slices/purchaseSlice';
import { GET_SALES } from '@store/slices/saleSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

type StackParamsList = {
  Info: {
    data: {
      month: string;
      x: string;
      y: number;
    };

    type: 'invoicing' | 'spending' | 'profit';
  };
};

export const OverviewExtract = () => {
  const [extractDataSpending, setExtractDateSpending] = useState<
    PurchaseResponse[]
  >([]);
  const [extractDataInvoicing, setExtractDateInvoicing] = useState<
    ProfitResponse[]
  >([]);
  const [extractDataProfit, setExtractDateProfit] = useState<Sales[]>([]);

  const { allPurchases } = useReduxSelector(state => state.purchase);
  const { allProfit } = useReduxSelector(state => state.profit);
  const { allSales } = useReduxSelector(state => state.sale);

  const { goBack } = useNavigation();

  const { data, type } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const { t } = useTranslation();

  const handleExtractSpending = ({
    selectMonth,
    selectYear,
  }: {
    selectMonth: number;
    selectYear: number;
  }) => {
    return allPurchases?.filter(item => {
      const itemDate = new Date(item.createdAt);

      const currMonth = itemDate.getMonth();
      const currYear = itemDate.getFullYear();

      return currMonth === selectMonth && currYear === selectYear;
    });
  };

  const handleExtractInvoicing = ({
    selectMonth,
    selectYear,
  }: {
    selectMonth: number;
    selectYear: number;
  }) => {
    return allProfit?.filter(item => {
      const itemDate = new Date(item.createdAt);

      const currMonth = itemDate.getMonth();
      const currYear = itemDate.getFullYear();

      return currMonth === selectMonth && currYear === selectYear;
    });
  };

  const handleExtractProfit = ({
    selectMonth,
    selectYear,
  }: {
    selectMonth: number;
    selectYear: number;
  }) => {
    return allSales?.filter(item => {
      const itemDate = new Date(item.createdAt);

      const currMonth = itemDate.getMonth();
      const currYear = itemDate.getFullYear();

      return currMonth === selectMonth && currYear === selectYear;
    });
  };

  const handleSetExtract = () => {
    const selectDate = data.month.split('/');

    const selectMonth = Number(selectDate[0]) - 1;
    const selectYear = Number(selectDate[1]);

    if (type === 'spending') {
      const extract = handleExtractSpending({ selectMonth, selectYear });

      if (extract) return setExtractDateSpending(extract.reverse());
    }

    if (type === 'invoicing') {
      const extract = handleExtractInvoicing({ selectMonth, selectYear });

      if (extract) return setExtractDateInvoicing(extract.reverse());
    }

    if (type === 'profit') {
      const extract = handleExtractProfit({ selectMonth, selectYear });

      if (extract) return setExtractDateProfit(extract.reverse());
    }
  };

  useEffect(() => {
    handleSetExtract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCards = () => {
    if (type === 'spending')
      return extractDataSpending.map(item => (
        <FinancialCard
          key={item.id}
          item={{
            date: item.createdAt,
            price: item.totalPrice,
            title: item.description,
          }}
        />
      ));

    if (type === 'invoicing')
      return extractDataInvoicing.map(item => (
        <FinancialCard
          key={item.id}
          item={{
            date: item.createdAt,
            price: item.price,
            title: item.name,
          }}
        />
      ));

    if (type === 'profit')
      return extractDataProfit.map(item => (
        <FinancialCard
          key={item.id}
          item={{
            date: item.createdAt,
            price: item.totalPrice,
            title: item.name,
          }}
        />
      ));
  };

  return (
    <Background>
      <Header
        title={t(`components.header.overview`)}
        onPress={goBack}
        type="small"
      />

      <StyledContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 32 }}
      >
        <StyledTitle>
          {t(`screens.overviewDetails.extract.title.${type}`)}
        </StyledTitle>

        {renderCards()}
      </StyledContent>
    </Background>
  );
};

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  margin: 0 32px 16px;
`;

const StyledContent = styled.ScrollView``;
