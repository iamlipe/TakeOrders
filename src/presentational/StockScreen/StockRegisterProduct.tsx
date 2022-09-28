import React, { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StockStackParamList } from '@routes/stacks/StockStack';

import { CREATE_PRODUCT, NewProduct } from '@store/slices/productSlice';
import {
  CREATE_PRODUCT_PURCHASE,
  NewProductPurchase,
} from '@store/slices/purchaseSlice';

import {
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import ImagePicker from '@components/ImagePicker';
import Header from '@components/Header';
import Input from '@components/Input';
import Button from '@components/Button';
import Loading from '@components/Loading';
import { useTranslation } from 'react-i18next';

interface FormReisterNewProduct {
  name: string;
  type: string;
  quantity: string;
  totalPrice: string;
  price: string;
  image?: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Preenchimento obrigatório'),
  type: Yup.string().required('Preenchimento obrigatório'),
  image: Yup.string(),
  quantity: Yup.string()
    .min(1, 'minimo 1')
    .required('Preenchimento obrigatório'),
  totalPrice: Yup.string()
    .min(1, 'minimo 1')
    .required('Preenchimento obrigatório'),
  price: Yup.string().min(1, 'minimo 1').required('Preenchimento obrigatório'),
});

type NavProps = NativeStackNavigationProp<StockStackParamList, 'StockHome'>;

const { height } = Dimensions.get('window');

export const StockRegisterProduct = () => {
  const [showContent, setShowContent] = useState(false);
  const [loadingRegisterProduct, setLoadingRegisterProduct] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const dispatch = useReduxDispatch();
  const { spentId } = useReduxSelector(state => state.spent);
  const { stockId } = useReduxSelector(state => state.stock);
  const { latestProductCreated, isLoading } = useReduxSelector(
    state => state.product,
  );

  const { navigate } = useNavigation<NavProps>();
  const { goBack } = useNavigation();

  const { t } = useTranslation();

  const theme = useTheme();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<FormReisterNewProduct>({
    resolver: yupResolver(schema),
  });

  const createProduct = useCallback(
    (product: NewProduct) => {
      dispatch(CREATE_PRODUCT(product));
    },
    [dispatch],
  );

  const createPurchase = useCallback(
    (purchase: NewProductPurchase) => {
      dispatch(CREATE_PRODUCT_PURCHASE(purchase));
    },
    [dispatch],
  );

  const onSubmit = (data: FormReisterNewProduct) => {
    if (stockId) {
      setLoadingRegisterProduct(true);

      createProduct({
        name: data.name,
        price: Number(data.price.substring(2).replace(/[^0-9]/g, '')),
        quantity: Number(data.quantity.substring(2).replace(/[^0-9]/g, '')),
        stockId,
        type: data.type,
        image: data.image,
      });

      setTimeout(
        () =>
          setTotalPrice(
            Number(data.totalPrice.substring(2).replace(/[^0-9]/g, '')),
          ),
        1000,
      );
    }
  };

  useEffect(() => {
    if (latestProductCreated && !isLoading && spentId && totalPrice) {
      createPurchase({
        productId: latestProductCreated.id,
        spentId,
        totalPrice,
        description: '',
      });

      setTotalPrice(0);
      setLoadingRegisterProduct(false);
      navigate('StockHome');
    }
  }, [
    createPurchase,
    navigate,
    isLoading,
    latestProductCreated,
    spentId,
    totalPrice,
  ]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        image: '',
        name: '',
        price: undefined,
        quantity: undefined,
        totalPrice: undefined,
        type: '',
      });
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (spentId && stockId) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [spentId, stockId]);

  return (
    <StyledContainer
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
    >
      <Header
        title={t('components.header.stockRegisterProduct')}
        onPress={goBack}
      />

      {showContent ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <StyledContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 32 }}
          >
            <StyledContainerForm>
              <ImagePicker
                name="image"
                label={t('components.input.image')}
                control={control}
              />

              <Input
                name="name"
                control={control}
                label={t('components.input.name')}
                error={isSubmitted ? errors.name?.message : ''}
              />
              <Input
                name="type"
                control={control}
                label={t('components.input.type')}
                error={isSubmitted ? errors.type?.message : ''}
              />
              <Input
                name="quantity"
                control={control}
                label={t('components.input.quantity')}
                error={isSubmitted ? errors.quantity?.message : ''}
                type="custom"
                options={{ mask: '9999' }}
              />
              <Input
                name="totalPrice"
                control={control}
                label={t('components.input.totalPrice')}
                error={isSubmitted ? errors.totalPrice?.message : ''}
                type="money"
              />
              <Input
                name="price"
                control={control}
                label={t('components.input.price')}
                error={isSubmitted ? errors.price?.message : ''}
                type="money"
              />
            </StyledContainerForm>

            <Button
              title={t('components.button.register')}
              onPress={handleSubmit(onSubmit)}
              loading={loadingRegisterProduct}
            />
          </StyledContent>
        </KeyboardAvoidingView>
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
  height: ${StatusBar.currentHeight
    ? height - StatusBar.currentHeight - 120 - 72
    : height - 120 - 72}px;
`;

const StyledContainerForm = styled.View`
  margin-bottom: 40px;
`;
