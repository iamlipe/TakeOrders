import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useReduxDispatch } from '@hooks/useReduxDispatch';
import { useReduxSelector } from '@hooks/useReduxSelector';
import { useTranslation } from 'react-i18next';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductStackParamList } from '@routes/stacks/ProductStack';

import {
  CREATE_PRODUCT,
  NewProduct,
  ProductResponse,
  UPDATE_PRODUCT,
} from '@store/slices/productSlice';

import { Dimensions, KeyboardAvoidingView, Platform } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import ImagePicker from '@components/ImagePicker';
import Header from '@components/Header';
import Input from '@components/Input';
import Button from '@components/Button';
import Loading from '@components/Loading';
import Select from '@components/Select';
import { GET_CATEGORIES } from '@store/slices/categorySlice';
import formatedCurrency from '@utils/formatedCurrency';

interface FormReisterOrEditProduct {
  name: string;
  categoryId: string;
  price: string;
  image?: string;
}

type StackParamsList = {
  Info: {
    product: ProductResponse;
  };
};

type NavProps = NativeStackNavigationProp<ProductStackParamList, 'ProductHome'>;

const { height } = Dimensions.get('window');

export const ProductRegister = () => {
  const [showContent, setShowContent] = useState(false);
  const [loadingRegisterProduct, setLoadingRegisterProduct] = useState(false);

  const dispatch = useReduxDispatch();
  const { spentId } = useReduxSelector(state => state.spent);
  const { stockId } = useReduxSelector(state => state.stock);
  const { allCategories } = useReduxSelector(state => state.category);

  const { navigate, goBack } = useNavigation<NavProps>();

  const { product } = useRoute<RouteProp<StackParamsList, 'Info'>>().params;

  const { t } = useTranslation();

  const theme = useTheme();

  const schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('errors.required.')),
        categoryId: Yup.string().required(t('errors.required.')),
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
    setValue,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<FormReisterOrEditProduct>({
    resolver: yupResolver(schema),
  });

  const getCategories = useCallback(() => {
    dispatch(GET_CATEGORIES());
  }, [dispatch]);

  const createProduct = useCallback(
    (product: NewProduct) => {
      dispatch(CREATE_PRODUCT(product));
    },
    [dispatch],
  );

  const updateProduct = useCallback(
    (updatedProduct: FormReisterOrEditProduct) => {
      if (product) {
        dispatch(
          UPDATE_PRODUCT({
            productId: product.id,
            updatedProduct: {
              name: updatedProduct.name,
              categoryId: updatedProduct.categoryId,
              price:
                Number(
                  updatedProduct.price.substring(2).replace(/[^0-9]/g, ''),
                ) / 100,
              image: updatedProduct.image,
            },
          }),
        );
      }
    },
    [dispatch, product],
  );

  const handleOptionsCategory = useCallback(() => {
    const data = allCategories?.map(category => {
      return {
        id: category.id,
        name: category.name,
      };
    });

    if (data) return data;

    return [];
  }, [allCategories]);

  const onSubmit = useCallback(
    (data: FormReisterOrEditProduct) => {
      if (stockId) {
        setLoadingRegisterProduct(true);

        if (!product) {
          createProduct({
            name: data.name,
            price: Number(data.price.substring(2).replace(/[^0-9]/g, '')) / 100,
            quantitySold: 0,
            stockId,
            categoryId: data.categoryId,
            image: data.image,
          });
        } else {
          updateProduct({
            name: data.name,
            categoryId: data.categoryId,
            price: data.price,
            image: data.image,
          });
        }

        setTimeout(() => {
          setLoadingRegisterProduct(false);
          navigate('ProductHome');
        }, 1000);
      }
    },
    [createProduct, navigate, product, stockId, updateProduct],
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        image: '',
        name: '',
        price: undefined,
        categoryId: '',
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

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (product) {
      setValue('name', product?.name);
      setValue('categoryId', product.categoryId);
      setValue('image', product.image);
      setValue('price', formatedCurrency(product.price));
    }
  }, [product, setValue]);

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

              <Select
                name="categoryId"
                control={control}
                label={t('components.input.type')}
                options={handleOptionsCategory()}
              />

              <Input
                name="price"
                control={control}
                label={t('components.input.price')}
                error={isSubmitted ? errors.price?.message : ''}
                type="money"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            </StyledContainerForm>

            <Button
              title={
                product
                  ? t('components.button.edit')
                  : t('components.button.register')
              }
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
        title={
          product
            ? t('components.header.stockEditProduct')
            : t('components.header.stockRegisterProduct')
        }
        onPress={goBack}
      />

      {useMemo(renderContent, [
        control,
        errors.name?.message,
        errors.price?.message,
        handleOptionsCategory,
        handleSubmit,
        isSubmitted,
        loadingRegisterProduct,
        onSubmit,
        product,
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
