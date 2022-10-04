import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { StockStackParamList } from '@routes/stacks/StockStack';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useTranslation } from 'react-i18next';

import { GET_ALL_PRODUCTS } from '@store/slices/productSlice';

import EmptyProduct from '@assets/svgs/empty-products.svg';

import { FlatList } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Dimensions, StatusBar } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import BigButton from '@components/BigButton';
import Card from '@components/Card';
import AddProductBottomSheetModal from './AddProductBottomSheetModal';
import Loading from '@components/Loading';

interface ContainerEmptyProduct {
  height: number;
}

type NavProps = NativeStackNavigationProp<
  StockStackParamList,
  'StockRegisterProduct'
>;

const { height } = Dimensions.get('window');

export const StockHome = () => {
  const [showContent, setShowContent] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const dispatch = useReduxDispatch();
  const { allProducts, isLoading } = useReduxSelector(state => state.product);

  const isFocused = useIsFocused();

  const { navigate } = useNavigation<NavProps>();

  const theme = useTheme();

  const { t } = useTranslation();

  const heightList = useMemo(
    () => height - 120 - 32 - 100 - 24 - 24 - 32 - 72,
    [],
  );

  const addProductBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleShowAddProductBottomSheet = useCallback(() => {
    addProductBottomSheetModalRef.current?.present();
  }, []);

  const handleDismissAddProductBottomSheet = useCallback(() => {
    addProductBottomSheetModalRef.current?.dismiss();
  }, []);

  const getProducts = useCallback(() => {
    dispatch(GET_ALL_PRODUCTS());
  }, [dispatch]);

  useEffect(() => {
    getProducts();
  }, [getProducts, isFocused]);

  useEffect(() => {
    if (allProducts && !isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [allProducts, isLoading]);

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title={t('components.header.stockHome')} />

      {showContent ? (
        <StyledContent>
          <BigButton
            title={t('components.bigButton.registerNewProduct')}
            icon={{ name: 'add-circle-outline', color: 'WHITE' }}
            onPress={() => navigate('StockRegisterProduct')}
          />

          <StyledTitleList>
            {t('screens.stockHome.titleListProductsInStock')}
          </StyledTitleList>
          {allProducts?.length ? (
            <>
              <FlatList
                data={allProducts}
                renderItem={({ item }) => (
                  <Card
                    key={item.id}
                    type="normal"
                    cardSize="large"
                    item={{
                      title:
                        item.name[0].toUpperCase() +
                        item.name.substring(1).toLowerCase(),
                      image: item.image,
                      description: `${t('components.card.quantity')}: ${String(
                        item.quantity,
                      )}`,
                      link: () => {
                        setSelectedProduct(item.id);
                        handleShowAddProductBottomSheet();
                      },
                    }}
                    onPress={() =>
                      navigate('StockDetailsProduct', { productId: item.id })
                    }
                  />
                )}
                keyExtractor={item => item.id}
                style={{
                  height: StatusBar.currentHeight
                    ? heightList - StatusBar.currentHeight
                    : heightList,
                }}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <StyledContainerEmptyProduct
              height={
                StatusBar.currentHeight
                  ? heightList - StatusBar.currentHeight
                  : heightList
              }
            >
              <EmptyProduct width={120} height={120} />

              <StyledTextEmptyProduct>
                Você ainda não tem nenhum produto cadastrado em seu estoque,
                clique em cadastrar produto
              </StyledTextEmptyProduct>
            </StyledContainerEmptyProduct>
          )}

          <AddProductBottomSheetModal
            ref={addProductBottomSheetModalRef}
            productId={selectedProduct}
            closeBottomSheet={handleDismissAddProductBottomSheet}
          />
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

const StyledContent = styled.View`
  padding: 32px 0;
`;

const StyledTitleList = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: 24px;

  padding: 0 32px;
  margin-top: 24px;
`;

const StyledContainerEmptyProduct = styled.View<ContainerEmptyProduct>`
  height: ${({ height }) => height}px;

  align-items: center;
  justify-content: center;
`;

const StyledTextEmptyProduct = styled.Text`
  width: 80%;

  text-align: center;
`;
