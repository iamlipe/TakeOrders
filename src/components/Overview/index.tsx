import React, { memo, useCallback, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';

import { VictoryChart, VictoryBar, VictoryTheme } from 'victory-native';

import formatedCurrency from '@utils/formatedCurrency';

interface SwiperDotProps {
  active: boolean;
}

interface OverviewProps {
  data: {
    months: string;
    earnings: number;
  }[];

  type: 'invoicing' | 'spending' | 'profit';
}

const { width } = Dimensions.get('window');

const Overview = ({ data, type }: OverviewProps) => {
  const [pageActive, setPageActive] = useState(0);

  const average = formatedCurrency(
    data.reduce((prev, curr) => prev + curr.earnings, 0) / data.length,
  );
  const prevMonth =
    data.length >= 2
      ? formatedCurrency(data[data.length - 2].earnings)
      : 'R$ 0.00';
  const currMonth = formatedCurrency(data[data.length - 1].earnings);

  const theme = useTheme();

  const onChange = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );

      if (slide !== pageActive) setPageActive(slide);
    }
  };

  const returnTitleText = useCallback(() => {
    switch (type) {
      case 'invoicing':
        return 'Faturamento';
      case 'spending':
        return 'Gastos';
      case 'profit':
        return 'Lucro';
    }
  }, [type]);

  const renderChart = () => {
    return (
      <VictoryChart
        width={width - 64}
        height={220}
        domainPadding={30}
        theme={{
          ...VictoryTheme.material,
          axis: {
            style: {
              axis: {
                fill: 'transparent',
                stroke: theme.colors.GRAY_600,
                strokeWidth: 0.8,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              },
              grid: {
                fill: 'none',
                stroke: 'transparent',
                strokeDasharray: '10, 5',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                pointerEvents: 'painted',
              },
              ticks: {
                fill: 'transparent',
                size: 5,
                stroke: 'transparent',
                strokeWidth: 1,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              },
              tickLabels: {
                fill: theme.colors.GRAY_600,
                fontFamily: theme.fonts.HEEBO_MEDIUM,
                fontSize: theme.sizing.MINOR,
                letterSpacing: 'normal',
                padding: 0,
                stroke: 'transparent',
                strokeWidth: 0,
              },
            },
          },
        }}
      >
        <VictoryBar
          data={data}
          x="months"
          y="earnings"
          alignment="middle"
          barWidth={24}
          cornerRadius={4}
          animate={{ duration: 100, easing: 'elastic' }}
          style={{
            data: { fill: theme.colors.PRIMARY_500 },
            labels: {
              fill: theme.colors.GRAY_600,
              fontFamily: theme.fonts.HEEBO_MEDIUM,
              fontSize: theme.sizing.MINOR,
            },
          }}
          labels={({ datum }) => `R$ ${datum.earnings.toLocaleString('pt-br')}`}
        />
      </VictoryChart>
    );
  };

  const renderReport = () => {
    return (
      <StyledContainerReport>
        <StyledColumn>
          <StyledTitleReport>{`${returnTitleText()} mêdio`}</StyledTitleReport>
          <StyledDescriptionReport>{average}</StyledDescriptionReport>
        </StyledColumn>

        <StyledColumn>
          <StyledTitleReport>{`${returnTitleText()} mês anterior`}</StyledTitleReport>
          <StyledDescriptionReport>{prevMonth}</StyledDescriptionReport>
        </StyledColumn>

        <StyledColumn>
          <StyledTitleReport>{`${returnTitleText()} mês`}</StyledTitleReport>
          <StyledDescriptionReport>{currMonth}</StyledDescriptionReport>
        </StyledColumn>
      </StyledContainerReport>
    );
  };

  return (
    <StyledContainer style={{ elevation: 3 }}>
      <>
        <StyledSwiper
          onScroll={({
            nativeEvent,
          }: NativeSyntheticEvent<NativeScrollEvent>) => onChange(nativeEvent)}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
        >
          {useMemo(renderReport, [
            average,
            currMonth,
            prevMonth,
            returnTitleText,
          ])}

          {useMemo(renderChart, [
            data,
            theme.colors.GRAY_600,
            theme.colors.PRIMARY_500,
            theme.fonts.HEEBO_MEDIUM,
            theme.sizing.MINOR,
          ])}
        </StyledSwiper>
        <StyledContainerSwiperDot>
          <StyledSwiperDot active={pageActive === 0}>●</StyledSwiperDot>
          <StyledSwiperDot active={pageActive === 1}>●</StyledSwiperDot>
        </StyledContainerSwiperDot>
      </>
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  height: 220px;

  align-items: center;
  justify-content: center;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.WHITE};

  margin: 0 32px;
`;

const StyledContainerReport = styled.View`
  width: ${width - 64}px;

  justify-content: space-between;

  padding: 40px 32px;
`;

const StyledSwiper = styled(ScrollView)``;

const StyledContainerSwiperDot = styled.View`
  position: absolute;
  bottom: 5px;

  flex-direction: row;
  align-self: center;
`;

const StyledSwiperDot = styled.Text<SwiperDotProps>`
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme, active }) =>
    active ? theme.colors.GRAY_800 : theme.colors.GRAY_600};
`;

const StyledColumn = styled.View``;

const StyledTitleReport = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};
`;

const StyledDescriptionReport = styled(StyledTitleReport)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};

  color: ${({ theme }) => theme.colors.PRIMARY_600};
`;

export default memo(Overview);
