import React, { forwardRef, memo, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { RFValue } from 'react-native-responsive-fontsize';
import { ProductBag } from '../BillAddProducts';

import formatedCurrency from '@utils/formatedCurrency';

import EmptyBag from '@assets/svgs/empty-bag.svg';

import { Dimensions } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Counter from '@components/Counter';
import Button from '@components/Button';

interface AddOrderBottomSheetModalProps {
  products: ProductBag[] | null;
  closeBottomSheet: (products: ProductBag[]) => void;
  removeProduct: (id: string) => void;
}

const { width } = Dimensions.get('window');

const AddOrderBottomSheetModal = forwardRef<
  BottomSheetModal,
  AddOrderBottomSheetModalProps
>(({ products, closeBottomSheet, removeProduct }, ref) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const theme = useTheme();

  const { goBack } = useNavigation();

  const { control, handleSubmit } = useForm();

  const snapPointHeigth = useMemo(
    () => [16 + 32 + RFValue(32) + 24 + 16 + 240 + 16 + 44 + 48],
    [],
  );

  const onSubmit = (data: any) => {
    const productsWithQuantityCorrect = products?.map(item => {
      return {
        product: item.product,
        quantity: data[item.product.id] || item.quantity,
      };
    });

    setLoading(true);

    setTimeout(
      () =>
        productsWithQuantityCorrect &&
        closeBottomSheet(productsWithQuantityCorrect),
      1000,
    );

    setTimeout(() => {
      setLoading(false);
      goBack();
    }, 1500);
  };

  const renderCardWithCounter = ({ product, quantity }: ProductBag) => (
    <StyledContainerCard key={product.id}>
      {product.image ? (
        <StyledImage source={{ uri: product.image }} resizeMode="contain" />
      ) : (
        <StyledDefaultImage />
      )}

      <StyledContainerInfoProduct>
        <StyledTitleProduct>{product.name}</StyledTitleProduct>
        <StyledPriceProduct>
          {formatedCurrency(product.price)}
        </StyledPriceProduct>
      </StyledContainerInfoProduct>

      <StyledContainerEdit>
        <StyledBaseButton onPress={() => removeProduct(product.id)}>
          <Icon
            name="delete-outline"
            color={theme.colors.ERROR_500}
            size={RFValue(14)}
          />
        </StyledBaseButton>

        <Counter name={product.id} control={control} quantity={quantity} />
      </StyledContainerEdit>
    </StyledContainerCard>
  );

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPointHeigth}>
      <StyledContainer>
        <StyledTitle>
          {t('screens.billAddProducts.addOrderBottomSheet.title')}
        </StyledTitle>

        <StyledScrollBottomSheetModal>
          {products?.length ? (
            products.map(item => renderCardWithCounter(item))
          ) : (
            <StyledContainerEmptyBag>
              <EmptyBag width={100} height={100} />
              <StyledTitleEmptyBag>
                {t('screens.billAddProducts.addOrderBottomSheet.titleEmptyBag')}
              </StyledTitleEmptyBag>
              <StyledDecribeEmptyBag>
                {t(
                  'screens.billAddProducts.addOrderBottomSheet.descriptionEmptyBag',
                )}
              </StyledDecribeEmptyBag>
            </StyledContainerEmptyBag>
          )}
        </StyledScrollBottomSheetModal>
        <StyledContainerButton>
          <Button
            title={t('components.button.add')}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />
        </StyledContainerButton>
      </StyledContainer>
    </BottomSheetModal>
  );
});

const StyledContainer = styled(BottomSheetScrollView)`
  margin: 16px 0 48px;

  min-height: 300px;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.LARGE};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(32)}px;

  text-align: center;

  margin-bottom: 24px;
`;

const StyledScrollBottomSheetModal = styled.View`
  min-height: 240px;
`;

const StyledTitleProduct = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};

  color: ${({ theme }) => theme.colors.GRAY_800};

  line-height: ${RFValue(16)}px;

  margin-left: 4px;
`;

const StyledPriceProduct = styled(StyledTitleProduct)`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
`;

const StyledImage = styled.Image`
  width: 60px;
  height: 60px;

  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.WHITE};
`;

const StyledDefaultImage = styled.View`
  width: 60px;
  height: 60px;

  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.SECUNDARY_200};
`;

const StyledContainerCard = styled.View`
  height: 80px;

  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.GRAY_300};

  margin: 0 32px;
`;

const StyledContainerInfoProduct = styled.View`
  width: ${width - 64 - 80 - 60}px;
  height: 56px;

  justify-content: space-evenly;
`;

const StyledContainerEdit = styled.View`
  width: 80px;
  height: 100%;

  justify-content: space-around;
  align-items: flex-end;
`;

const StyledBaseButton = styled.TouchableOpacity``;

const StyledContainerButton = styled.View`
  margin-top: 32px;
`;

const StyledContainerEmptyBag = styled.View`
  height: 240px;

  align-items: center;
  justify-content: center;
`;

const StyledTitleEmptyBag = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};
  font-size: ${({ theme }) => theme.sizing.SMALLER};
  color: ${({ theme }) => theme.colors.GRAY_800};

  margin-top: 16px;
`;

const StyledDecribeEmptyBag = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};
  color: ${({ theme }) => theme.colors.GRAY_600};

  margin-top: 8px;
`;

export default memo(AddOrderBottomSheetModal);
