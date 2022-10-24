import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillStackParamList } from '@routes/stacks/BillStack';

import { GET_BILLS } from '@store/slices/billSlice';
import { GET_INVOICE_ID } from '@store/slices/invoiceSlice';
import { GET_STOCK } from '@store/slices/stockSlice';
import { GET_SPENT } from '@store/slices/spentSlice';
import { Bill } from '@database/models/billModel';

import { Dimensions, RefreshControl } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import EmptyBills from '@assets/svgs/empty-bills.svg';

import LinearGradient from 'react-native-linear-gradient';

import AddBillBottomSheetModal from '@presentational/BillScreen/AddBillBottomSheetModal';

import Header from '@components/Header';
import SearchInput from '@components/SearchInput';
import Button from '@components/Button';
import Card from '@components/Card';
import Loading from '@components/Loading';
import { CREATE_CATEGORY } from '@store/slices/categorySlice';

type NavProps = NativeStackNavigationProp<BillStackParamList, 'BillDetails'>;

const { height } = Dimensions.get('window');

export const BillHome = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [dataBills, setDataBills] = useState<Bill[] | null>(null);

  const addBillBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const dispatch = useReduxDispatch();
  const { auth } = useReduxSelector(state => state.user);
  const { allBills, foundBills, isLoading } = useReduxSelector(
    state => state.bill,
  );

  const isFocused = useIsFocused();

  const { navigate } = useNavigation<NavProps>();

  const { t } = useTranslation();

  const theme = useTheme();

  const heightList = useMemo(
    () => height - 120 - 32 - 56 - 16 - 16 - 44 - 32 - 72,
    [],
  );

  const getBills = useCallback(() => {
    dispatch(GET_BILLS());
  }, [dispatch]);

  const getInvoiceId = useCallback(() => {
    if (auth?.id) {
      dispatch(GET_INVOICE_ID({ userId: auth?.id }));
    }
  }, [auth?.id, dispatch]);

  const getStockId = useCallback(() => {
    if (auth?.id) dispatch(GET_STOCK({ userId: auth?.id }));
  }, [auth?.id, dispatch]);

  const getSpentId = useCallback(() => {
    if (auth?.id) dispatch(GET_SPENT({ userId: auth?.id }));
  }, [auth?.id, dispatch]);

  const handleShowAddBillBottomSheet = useCallback(() => {
    addBillBottomSheetModalRef.current?.present();
  }, []);

  const handleCloseAddBillBottomSheet = useCallback(() => {
    addBillBottomSheetModalRef.current?.dismiss();

    getBills();
  }, [getBills]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getBills();

    setTimeout(() => setRefreshing(false), 1000);
  }, [getBills]);

  useEffect(() => {
    getInvoiceId();
    getStockId();
    getSpentId();
  }, [getInvoiceId, getSpentId, getStockId]);

  useEffect(() => {
    getBills();
  }, [getBills, isFocused, isLoading]);

  useEffect(() => {
    if (allBills || foundBills) {
      if (foundBills?.length) return setDataBills(foundBills);

      if (allBills?.length) return setDataBills([...allBills].reverse());

      return setDataBills([]);
    }
  }, [allBills, foundBills]);

  useLayoutEffect(() => {
    if (dataBills) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [dataBills]);

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title={t('components.header.billHome')} />

      {showContent ? (
        <StyledContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SearchInput
            placeholder={t('components.searchInput.bill')}
            type="bills"
          />

          {dataBills?.length ? (
            <StyledContainerCardBill style={{ minHeight: heightList }}>
              {dataBills.slice(0, 10).map(item => {
                return (
                  <Card
                    key={item.id}
                    type="clients"
                    cardSize="large"
                    item={{
                      title:
                        item.name[0].toUpperCase() +
                        item.name.substring(1).toLowerCase(),
                      description: item.id,
                      linkTitle: t('components.card.links.details'),
                      image: item.image,
                      link: () => navigate('BillDetails', { bill: item }),
                    }}
                    onPress={() => navigate('BillDetails', { bill: item })}
                    personCard
                  />
                );
              })}
            </StyledContainerCardBill>
          ) : (
            <StyledContainerEmptyBills style={{ height: heightList }}>
              <EmptyBills width={132} height={132} />
              <StyledTextEmptyBills>
                {t('screens.billHome.listBillEmpty')}
              </StyledTextEmptyBills>
            </StyledContainerEmptyBills>
          )}

          <Button
            title={t('components.button.addBill')}
            onPress={handleShowAddBillBottomSheet}
          />
        </StyledContent>
      ) : (
        <Loading />
      )}

      <AddBillBottomSheetModal
        ref={addBillBottomSheetModalRef}
        closeBottomSheet={handleCloseAddBillBottomSheet}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContent = styled.ScrollView`
  margin-bottom: 120px;
`;

const StyledContainerCardBill = styled.View`
  margin: 16px 0;
`;

const StyledContainerEmptyBills = styled.View`
  justify-content: center;
  align-items: center;

  margin: 16px 0;
`;

const StyledTextEmptyBills = styled.Text`
  width: 80%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-top: 16px;
`;
