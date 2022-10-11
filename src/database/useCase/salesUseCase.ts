import { database } from '@database/index';
import { Sales as SalesModel } from '@database/models/salesModel';
import { Q } from '@nozbe/watermelondb';
import { GetSales, NewSale } from '@store/slices/saleSlice';

export class SalesUseCase {
  public static async get({ userId }: GetSales): Promise<SalesModel[]> {
    const data = await database
      .get<SalesModel>('sales')
      .query(Q.where('userId', userId))
      .fetch();

    return data;
  }

  public static async create({
    userId,
    name,
    totalPrice,
  }: NewSale): Promise<void> {
    await database.write(async () => {
      await database.get<SalesModel>('sales').create(data => {
        (data.userId = userId),
          (data.name = name),
          (data.totalPrice = totalPrice),
          (data.createdAt = Date.now()),
          (data.updatedAt = Date.now());
      });
    });
  }
}
