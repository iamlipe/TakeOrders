import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components/native';

import { ProductStackParamList } from '@routes/stacks/ProductStack';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useTranslation } from 'react-i18next';

import { GET_ALL_PRODUCTS } from '@store/slices/productSlice';

import formatedCurrency from '@utils/formatedCurrency';

import EmptyProduct from '@assets/svgs/empty-products.svg';

import { FlatList } from 'react-native-gesture-handler';
import { Dimensions, RefreshControl } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import LinearGradient from 'react-native-linear-gradient';

import Header from '@components/Header';
import BigButton from '@components/BigButton';
import Card from '@components/Card';
import Loading from '@components/Loading';

type NavProps = NativeStackNavigationProp<
  ProductStackParamList,
  'ProductRegister' | 'ProductDetails'
>;

const { height } = Dimensions.get('window');

export const ProductHome = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const dispatch = useReduxDispatch();
  const { allProducts } = useReduxSelector(state => state.product);

  const isFocused = useIsFocused();

  const { navigate } = useNavigation<NavProps>();

  const theme = useTheme();

  const { t } = useTranslation();

  const heightList = useMemo(
    () => height - 120 - 32 - 100 - RFValue(24) - 24 - 32 - 32 - 72,
    [],
  );

  const getProducts = useCallback(() => {
    dispatch(GET_ALL_PRODUCTS());
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getProducts();

    setTimeout(() => setRefreshing(false), 1000);
  }, [getProducts]);

  useEffect(() => {
    getProducts();
  }, [getProducts, isFocused]);

  useLayoutEffect(() => {
    if (allProducts) {
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [allProducts]);

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header title={t('components.header.stockHome')} />

      {showContent ? (
        <StyledContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <BigButton
            title={t('components.bigButton.registerNewProduct')}
            icon={{ name: 'add-circle-outline', color: 'WHITE' }}
            onPress={() => navigate('ProductRegister')}
          />

          <StyledTitleList>
            {t('screens.stockHome.titleListProductsInStock')}
          </StyledTitleList>

          <StyledContainerCardProducts style={{ minHeight: heightList }}>
            {allProducts?.length ? (
              allProducts.map(item => {
                return (
                  <Card
                    key={item.id}
                    type="normal"
                    cardSize="large"
                    item={{
                      title:
                        item.name[0].toUpperCase() +
                        item.name.substring(1).toLowerCase(),
                      image: item.image,
                      description: formatedCurrency(item.price),
                    }}
                    onPress={() =>
                      navigate('ProductDetails', { productId: item.id })
                    }
                  />
                );
              })
            ) : (
              <StyledContainerEmptyProduct style={{ height: heightList }}>
                <EmptyProduct width={120} height={120} />

                <StyledTextEmptyProduct>
                  {t('screens.stockHome.textEmptyProductInStock')}
                </StyledTextEmptyProduct>
              </StyledContainerEmptyProduct>
            )}
          </StyledContainerCardProducts>
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

const StyledTitleList = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.MEDIUM};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(24)}px;

  padding: 0 32px;
  margin-top: 24px;
`;

const StyledContainerEmptyProduct = styled.View`
  align-items: center;
  justify-content: center;
`;

const StyledTextEmptyProduct = styled.Text`
  width: 60%;

  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.GRAY_800};

  text-align: center;

  margin-top: 16px;
`;

const StyledContainerCardProducts = styled.View`
  margin: 16px 0;
`;
