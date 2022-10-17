import React, {
  useCallback,
  useEffect,
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

import emptyBillsImg from '@assets/imgs/empty-bills.png';

import { Dimensions, FlatList, StatusBar } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import EmptyBills from '@assets/svgs/empty-bills.svg';

import LinearGradient from 'react-native-linear-gradient';

import AddBillBottomSheetModal from '@presentational/BillScreen/AddBillBottomSheetModal';

import Header from '@components/Header';
import SearchInput from '@components/SearchInput';
import Button from '@components/Button';
import Card from '@components/Card';
import Loading from '@components/Loading';
import i18next from 'i18next';

type NavProps = NativeStackNavigationProp<BillStackParamList, 'BillDetails'>;

const { height } = Dimensions.get('window');

export const BillHome = () => {
  const [showContent, setShowContent] = useState(false);

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
    () => height - 120 - 32 - 56 - 16 - 16 - 44 - 16 - 72,
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

  useEffect(() => {
    getBills();
    getInvoiceId();
    getStockId();
    getSpentId();
  }, [getBills, getInvoiceId, getSpentId, getStockId, isFocused]);

  useEffect(() => {
    if (allBills && !isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [allBills, isLoading]);

  const renderContent = () => {
    return (
      <>
        {showContent ? (
          <StyledContent>
            <SearchInput
              placeholder={t('components.searchInput.bill')}
              type="bills"
            />

            {foundBills?.length || allBills?.length ? (
              <FlatList
                data={
                  foundBills && foundBills.length > 0 ? foundBills : allBills
                }
                renderItem={({ item }) => (
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
                      link: () => navigate('BillDetails', { bill: item }),
                    }}
                    onPress={() => navigate('BillDetails', { bill: item })}
                  />
                )}
                keyExtractor={item => item.id}
                style={{
                  height: StatusBar.currentHeight
                    ? heightList - StatusBar.currentHeight
                    : heightList,
                  marginVertical: 16,
                }}
                showsVerticalScrollIndicator={false}
              />
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
              backgroundColor="trasparent"
              fontColor="GRAY_800"
              onPress={handleShowAddBillBottomSheet}
            />
          </StyledContent>
        ) : (
          <Loading />
        )}
      </>
    );
  };

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title={t('components.header.billHome')} />

      {useMemo(renderContent, [
        allBills,
        foundBills,
        handleShowAddBillBottomSheet,
        heightList,
        navigate,
        showContent,
        t,
      ])}

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

const StyledContent = styled.View`
  justify-content: space-between;

  padding: 32px 0;
`;

const StyledContainerEmptyBills = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledTextEmptyBills = styled.Text`
  width: 80%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;
`;
