import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FinancialStackParamList } from '@routes/stacks/FinancialStack';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';

import { GET_PROFIT } from '@store/slices/profitSlice';

import EmptyExtract from '@assets/svgs/empty-extract.svg';

import { Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import LinearGradient from 'react-native-linear-gradient';

import AddPurchaseBottomSheetModal from './AddPurchaseBottomSheetModal';
import Header from '@components/Header';
import ScrollableButton from '@components/ScrollableButton';
import Loading from '@components/Loading';
import FinancialCard from '@components/FinancialCard';
import Button from '@components/Button';

type NavProps = NativeStackNavigationProp<
  FinancialStackParamList,
  'FinancialInvoicing' | 'FinancialProfit' | 'FinancialSpending'
>;

const { height } = Dimensions.get('window');

export const FinancialHome = () => {
  const [showContent, setShowContent] = useState(false);

  const dispatch = useReduxDispatch();

  const { auth } = useReduxSelector(state => state.user);
  const { allProfit } = useReduxSelector(state => state.profit);

  const isFocused = useIsFocused();

  const { navigate } = useNavigation<NavProps>();

  const { t } = useTranslation();

  const heightList = useMemo(
    () =>
      height -
      120 -
      32 -
      height * 0.1 -
      16 -
      RFValue(24) -
      14 -
      16 -
      44 -
      32 -
      72,
    [],
  );

  const theme = useTheme();

  const addPurchaseBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const getInvoicies = useCallback(() => {
    if (auth) {
      dispatch(GET_PROFIT({ userId: auth.id }));
    }
  }, [auth, dispatch]);

  const handleShowAddPurchaseBottomSheet = useCallback(() => {
    addPurchaseBottomSheetModalRef.current?.present();
  }, []);

  const handleColseAddPurchaseBottomSheet = useCallback(() => {
    addPurchaseBottomSheetModalRef.current?.dismiss();
  }, []);

  useEffect(() => {
    getInvoicies();
  }, [getInvoicies, isFocused]);

  useEffect(() => {
    if (allProfit) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allProfit]);

  const renderContent = () => {
    if (showContent) {
      return (
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
                  iconName: 'attach-money',
                  onPress: () => navigate('FinancialInvoicing'),
                  title: t('components.scrollableButton.invoicing'),
                },
                {
                  iconName: 'local-offer',
                  onPress: () => navigate('FinancialProfit'),
                  title: t('components.scrollableButton.profit'),
                },
              ]}
            />
          </StyledContainerButtons>

          <StyledTitleExtract>
            {t('screens.financialHome.extract')}
          </StyledTitleExtract>

          {allProfit?.length ? (
            <FlatList
              data={allProfit}
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
                height: heightList,
                marginVertical: 16,
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <StyledContainerEmptyExtract style={{ height: heightList }}>
              <EmptyExtract width={132} height={132} />
              <StyledTextEmptyExtract>
                {t('screens.financialHome.textEmptyExtract')}
              </StyledTextEmptyExtract>
            </StyledContainerEmptyExtract>
          )}

          <Button
            title={t('components.button.addExpense')}
            onPress={handleShowAddPurchaseBottomSheet}
          />
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
      <Header title={t('components.header.financialHome')} />
      {useMemo(renderContent, [
        allProfit,
        handleShowAddPurchaseBottomSheet,
        heightList,
        navigate,
        showContent,
        t,
      ])}

      <AddPurchaseBottomSheetModal
        ref={addPurchaseBottomSheetModalRef}
        closeBottomSheet={handleColseAddPurchaseBottomSheet}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContent = styled.View`
  padding: 32px 0;
`;

const StyledContainerButtons = styled.View`
  height: ${height * 0.1}px;

  padding: 0 32px;

  margin-bottom: 16px;
`;

const StyledTitleExtract = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(24)}px;

  padding: 0 32px;
`;

const StyledContainerEmptyExtract = styled.View`
  justify-content: center;
  align-items: center;

  margin: 16px 0;
`;

const StyledTextEmptyExtract = styled.Text`
  width: 60%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-top: 16px;
`;
