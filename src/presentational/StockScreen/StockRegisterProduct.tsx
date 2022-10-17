import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  price: string;
  image?: string;
}

type NavProps = NativeStackNavigationProp<StockStackParamList, 'StockHome'>;

const { height } = Dimensions.get('window');

export const StockRegisterProduct = () => {
  const [showContent, setShowContent] = useState(false);
  const [loadingRegisterProduct, setLoadingRegisterProduct] = useState(false);

  const dispatch = useReduxDispatch();
  const { spentId } = useReduxSelector(state => state.spent);
  const { stockId } = useReduxSelector(state => state.stock);

  const { navigate } = useNavigation<NavProps>();

  const { t } = useTranslation();

  const theme = useTheme();

  const schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('errors.required.')),
        type: Yup.string().required(t('errors.required.')),
        image: Yup.string(),
        price: Yup.string()
          .min(1, t('errors.minOne'))
          .required(t('errors.required.')),
      }),
    [t],
  );

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

  const onSubmit = useCallback(
    (data: FormReisterNewProduct) => {
      if (stockId) {
        setLoadingRegisterProduct(true);

        createProduct({
          name: data.name,
          price: Number(data.price.substring(2).replace(/[^0-9]/g, '')) / 100,
          quantity: 0,
          stockId,
          type: data.type,
          image: data.image,
        });

        setTimeout(() => {
          setLoadingRegisterProduct(false);
          navigate('StockHome');
        }, 1000);
      }
    },
    [createProduct, navigate, stockId],
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        image: '',
        name: '',
        price: undefined,
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

  const renderContent = () => {
    if (showContent) {
      return (
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
        title={t('components.header.stockRegisterProduct')}
        onPress={() => navigate('StockHome')}
      />

      {useMemo(renderContent, [
        control,
        errors.name?.message,
        errors.price?.message,
        errors.type?.message,
        handleSubmit,
        isSubmitted,
        loadingRegisterProduct,
        onSubmit,
        showContent,
        t,
      ])}
    </StyledContainer>
  );
};

const StyledContainer = styled(LinearGradient)`
  min-height: 100%;
`;

const StyledContent = styled.ScrollView``;

const StyledContainerForm = styled.View`
  height: ${height - 120 - 32 - 44 - 32 - 72}px;
`;
