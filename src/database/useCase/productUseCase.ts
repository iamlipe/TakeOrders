import { Q } from '@nozbe/watermelondb';
import { database } from '@database/index';
import { Product as ProductModel } from '@database/models/productModel';
import {
  GetProductById,
  NewProduct,
  ProductResponse,
  RemovedProduct,
  UpdatedProduct,
} from '@store/slices/productSlice';

export class ProductUseCase {
  public static async create({
    stockId,
    name,
    categoryId,
    image,
    price,
    quantitySold,
  }: NewProduct): Promise<ProductModel | null> {
    let product: ProductModel | null = null;

    await database.write(async () => {
      const data = await database.get<ProductModel>('products').create(data => {
        (data.stockId = stockId),
          (data.name = name),
          (data.categoryId = categoryId),
          (data.image = image),
          (data.price = price),
          (data.quantitySold = quantitySold);
      });

      product = data;
    });

    return product;
  }

  public static async get(): Promise<ProductResponse[]> {
    const data = await database.get<ProductModel>('products').query().fetch();

    const products = data.map(async product => {
      return {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        image: product.image,
        price: product.price,
        quantitySold: product.quantitySold,
        category: await product.category,
      };
    });

    return Promise.all(products);
  }

  public static async getById({
    productId,
  }: GetProductById): Promise<ProductResponse> {
    const data = await database.get<ProductModel>('products').find(productId);

    const product: ProductResponse = {
      id: data.id,
      name: data.name,
      categoryId: data.categoryId,
      image: data.image,
      price: data.price,
      quantitySold: data.quantitySold,
      category: await data.category,
    };

    return product;
  }

  public static async getByName({
    name,
  }: {
    name: string;
  }): Promise<ProductResponse[] | undefined> {
    const data = await database.get<ProductModel>('products').query().fetch();

    if (name) {
      const filteredProducts = data.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase()),
      );

      const products = filteredProducts.map(async product => {
        return {
          id: product.id,
          name: product.name,
          categoryId: product.categoryId,
          image: product.image,
          price: product.price,
          quantitySold: product.quantitySold,
          category: await product.category,
        };
      });

      return Promise.all(products);
    }
  }

  public static async update({
    updatedProduct: { image, name, price, stockId, categoryId, quantitySold },
    productId,
  }: UpdatedProduct): Promise<void> {
    const product = await database
      .get<ProductModel>('products')
      .find(productId);

    await database.write(async () => {
      await product.update(data => {
        (data.stockId = stockId || product.stockId),
          (data.name = name || product.name),
          (data.categoryId = categoryId || product.categoryId),
          (data.image = image || product.image),
          (data.price =
            typeof price === 'number' ? price : price || product.price),
          (data.quantitySold =
            typeof quantitySold === 'number'
              ? quantitySold
              : quantitySold || product.quantitySold);
      });
    });
  }

  public static async remove({ productId }: RemovedProduct): Promise<void> {
    const product = await database
      .get<ProductModel>('products')
      .find(productId);

    await database.write(async () => {
      await product.destroyPermanently();
    });
  }
}
