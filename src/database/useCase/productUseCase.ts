import { Q } from '@nozbe/watermelondb';
import { database } from '@database/index';
import { Product as ProductModel } from '@database/models/productModel';
import {
  GetProductById,
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
    quantity,
  }: NewProduct): Promise<ProductModel | null> {
    let product: ProductModel | null = null;

    await database.write(async () => {
      const data = await database.get<ProductModel>('products').create(data => {
        (data.stockId = stockId),
          (data.name = name),
          (data.type = type),
          (data.image = image),
          (data.price = price),
          (data.quantity = quantity);
      });

      product = data;
    });

    return product;
  }

  public static async get(): Promise<ProductModel[]> {
    return database.get<ProductModel>('products').query().fetch();
  }

  public static async getById({
    productId,
  }: GetProductById): Promise<ProductModel> {
    return database.get<ProductModel>('products').find(productId);
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
    updatedProduct: { image, name, price, stockId, type, quantity },
    product,
  }: UpdatedProduct): Promise<void> {
    await database.write(async () => {
      await product.update(data => {
        (data.stockId = stockId || product.stockId),
          (data.name = name || product.name),
          (data.type = type || product.type),
          (data.image = image || product.image),
          (data.price = price || product.price),
          (data.quantity = quantity || product.quantity);
      });
    });
  }

  public static async remove({ product }: RemovedProduct): Promise<void> {
    await database.write(async () => {
      await product.destroyPermanently();
    });
  }
}
