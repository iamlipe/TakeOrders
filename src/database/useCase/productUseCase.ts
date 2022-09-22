import { Q } from '@nozbe/watermelondb';
import { database } from '@database/index';
import { Product as ProductModel } from '@database/models/productModel';
import {
  NewProduct,
  RemovedProduct,
  UpdatedProduct,
} from '@store/slices/productSlice';

export class ProductUseCase {
  public static async create({
    stockId,
    name,
    type,
    image,
    price,
  }: NewProduct): Promise<void> {
    await database.write(async () => {
      await database.get<ProductModel>('products').create(data => {
        (data.stockId = stockId),
          (data.name = name),
          (data.type = type),
          (data.image = image),
          (data.price = price);
      });
    });
  }

  public static async get(): Promise<ProductModel[]> {
    return database.get<ProductModel>('products').query().fetch();
  }

  public static async getById({ id }: { id: string }): Promise<ProductModel> {
    return database.get<ProductModel>('products').find(id);
  }

  public static async getByName({
    name,
  }: {
    name: string;
  }): Promise<ProductModel[]> {
    const data = await database
      .get<ProductModel>('products')
      .query(Q.where('name', name))
      .fetch();

    return data;
  }

  public static async update({
    updatedProduct: { image, name, price, stockId, type },
    product,
  }: UpdatedProduct): Promise<void> {
    await database.write(async () => {
      await product.update(data => {
        (data.stockId = stockId || product.stockId),
          (data.name = name || product.name),
          (data.type = type || product.type),
          (data.image = image || product.image),
          (data.price = price || product.price);
      });
    });
  }

  public static async remove({ product }: RemovedProduct): Promise<void> {
    await database.write(async () => {
      await product.destroyPermanently();
    });
  }
}
