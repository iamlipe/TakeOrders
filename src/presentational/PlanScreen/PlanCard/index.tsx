import React, { memo, useCallback } from 'react';
import styled, { css } from 'styled-components/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlanStackParamList } from '@routes/stacks/PlanStack';

import { useNavigation } from '@react-navigation/native';

import formatedCurrency from '@utils/formatedCurrency';

const containerCardPlanType = {
  light: css`
    background-color: transparent;

    border-width: 2px;
    border-color: ${({ theme }) => theme.colors.GRAY_800};
  `,

  dark: css`
    background-color: ${({ theme }) => theme.colors.GRAY_800};

    border-width: 2px;
    border-color: ${({ theme }) => theme.colors.GRAY_800};
  `,
};

const textCardPlanType = {
  light: css`
    color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  `,

  dark: css`
    color: ${({ theme }) => theme.colors.WHITE};
  `,
};

interface ContainerCardPlanTypeProps {
  background: keyof typeof containerCardPlanType;
}

interface TextCardPlanProps {
  color: keyof typeof textCardPlanType;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  benefits: { id: number; name: string }[];
}

const plans: Plan[] = [
  {
    id: 1,
    name: 'Plano 1',
    price: 29.9,
    benefits: [
      { id: 1, name: 'Lorem Ipsum is simply' },
      { id: 2, name: 'Lorem Ipsum is simply dummy text of the' },
      { id: 3, name: 'Lorem Ipsum dummy text of the' },
      { id: 4, name: 'Lorem Ipsum is' },
    ],
  },
  {
    id: 2,
    name: 'Plano 2',
    price: 49.9,
    benefits: [
      { id: 1, name: 'Lorem Ipsum is simply' },
      { id: 2, name: 'Lorem Ipsum is simply dummy text of the' },
      { id: 3, name: 'Lorem Ipsum dummy text of the' },
      { id: 4, name: 'Lorem Ipsum is' },
    ],
  },
];

type NavPropsPlanStack = NativeStackNavigationProp<PlanStackParamList>;

const PlanCard = () => {
  const { navigate: navigatePlanStack } = useNavigation<NavPropsPlanStack>();

  const navigateToPayment = useCallback(() => {
    navigatePlanStack('Payment');
  }, [navigatePlanStack]);

  const renderCardPlan = ({ plan, index }: { plan: Plan; index: number }) => {
    return (
      <StyledContainerCardPlan
        key={plan.id}
        background={index % 2 === 0 ? 'light' : 'dark'}
        onPress={navigateToPayment}
      >
        <StyledRow>
          <StyledTextName color={index % 2 === 0 ? 'light' : 'dark'}>
            {plan.name}
          </StyledTextName>
          <StyledColumn>
            <StyledTextPrice color={index % 2 === 0 ? 'light' : 'dark'}>
              {`${formatedCurrency(plan.price)}`}
            </StyledTextPrice>
            <StyledTextPricePeriod color={index % 2 === 0 ? 'light' : 'dark'}>
              /mês
            </StyledTextPricePeriod>
          </StyledColumn>
        </StyledRow>

        {plan.benefits.map(benefit => (
          <StyledTextBenefit
            key={benefit.id}
            color={index % 2 === 0 ? 'light' : 'dark'}
          >
            {benefit.name}
          </StyledTextBenefit>
        ))}
      </StyledContainerCardPlan>
    );
  };

  return (
    <StyledContainer>
      {plans.map((plan, index) => renderCardPlan({ plan, index }))}
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  margin: 32px;
`;

const StyledContainerCardPlan = styled.TouchableOpacity<ContainerCardPlanTypeProps>`
  ${({ background }) =>
    css`
      ${containerCardPlanType[background]},
    `};

  width: 100%;
  min-height: 192px;

  border-radius: 8px;

  padding: 16px;
  margin-bottom: 16px;
`;

const StyledTextName = styled.Text<TextCardPlanProps>`
  ${({ color }) =>
    css`
      ${textCardPlanType[color]},
    `};

  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};
`;

const StyledTextPrice = styled.Text<TextCardPlanProps>`
  ${({ color }) =>
    css`
      ${textCardPlanType[color]},
    `};

  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  align-self: flex-end;
`;

const StyledTextPricePeriod = styled(StyledTextPrice)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};
`;

const StyledTextBenefit = styled.Text<TextCardPlanProps>`
  ${({ color }) =>
    css`
      ${textCardPlanType[color]},
    `};

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  margin: 2px 0;
`;

const StyledRow = styled.View`
  flex-direction: row;

  justify-content: space-between;
`;

const StyledColumn = styled.View``;

export default memo(PlanCard);
