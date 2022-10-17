import { database } from '@database/index';
import { Purchase as PurchaseModel } from '@database/models/purchaseModel';

import {
  NewExpansePurchase,
  NewProductPurchase,
  PurchaseResponse,
  RemovedPurchase,
  UpdatedExpansePurchase,
  UpdatedProductPurchase,
} from '@store/slices/purchaseSlice';

export class PurchaseUseCase {
  public static async createProduct({
    spentId,
    productId,
    description,
    totalPrice,
  }: NewProductPurchase): Promise<void> {
    await database.write(async () => {
      await database.get<PurchaseModel>('purchases').create(data => {
        (data.spentId = spentId),
          (data.productId = productId),
          (data.expanse = undefined),
          (data.description = description),
          (data.totalPrice = totalPrice),
          (data.createdAt = Date.now()),
          (data.updatedAt = Date.now());
      });
    });
  }

  public static async createExpanse({
    spentId,
    expanse,
    description,
    totalPrice,
  }: NewExpansePurchase): Promise<void> {
    await database.write(async () => {
      await database.get<PurchaseModel>('purchases').create(data => {
        (data.spentId = spentId),
          (data.productId = undefined),
          (data.expanse = expanse),
          (data.description = description),
          (data.totalPrice = totalPrice),
          (data.createdAt = Date.now()),
          (data.updatedAt = Date.now());
      });
    });
  }

  public static async get(): Promise<PurchaseResponse[]> {
    const data = await database.get<PurchaseModel>('purchases').query().fetch();

    const allPurchases = data.map(async purchase => {
      return {
        id: purchase.id,
        spentId: purchase.spentId,
        productId: purchase.productId,
        expanse: purchase.expanse,
        description: purchase.description,
        totalPrice: purchase.totalPrice,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,

        product: await purchase.product,
      };
    });

    return Promise.all(allPurchases);
  }

  public static async updateProduct({
    updatedPurchase: { description, productId, spentId, totalPrice },
    purchase,
  }: UpdatedProductPurchase): Promise<void> {
    await database.write(async () => {
      await purchase.update(data => {
        (data.spentId = spentId || purchase.spentId),
          (data.productId = productId || purchase.productId),
          (data.expanse = undefined),
          (data.description = description || purchase.description),
          (data.totalPrice = totalPrice || purchase.totalPrice);
      });
    });
  }

  public static async updateExpanse({
    updatedPurchase: { spentId, expanse, description, totalPrice },
    purchase,
  }: UpdatedExpansePurchase): Promise<void> {
    await database.write(async () => {
      await purchase.update(data => {
        (data.spentId = spentId || purchase.spentId),
          (data.productId = undefined),
          (data.expanse = expanse || purchase.expanse),
          (data.description = description || purchase.description),
          (data.totalPrice = totalPrice || purchase.totalPrice);
      });
    });
  }

  public static async remove({ purchase }: RemovedPurchase) {
    await database.write(async () => {
      await purchase.destroyPermanently();
    });
  }
}
