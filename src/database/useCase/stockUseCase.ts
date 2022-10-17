import { database } from '@database/index';
import { Stock as StockModel } from '@database/models/stockModel';
import { Q } from '@nozbe/watermelondb';

import {
  GetStock,
  NewStock,
  RemovedStock,
  UpdatedStock,
} from '@store/slices/stockSlice';

export class StockUseCase {
  public static async create({ userId }: NewStock): Promise<void> {
    await database.write(async () => {
      await database.get<StockModel>('stock').create(data => {
        data.userId = userId;
      });
    });
  }

  public static async get({ userId }: GetStock): Promise<string> {
    const stock = await database
      .get<StockModel>('stock')
      .query(Q.where('userId', userId))
      .fetchIds();

    return stock[0];
  }

  public static async update({
    updatedStock: { userId },
    stock,
  }: UpdatedStock): Promise<void> {
    await database.write(async () => {
      await stock.update(data => {
        data.userId = userId || stock.userId;
      });
    });
  }

  public static async remove({ stock }: RemovedStock): Promise<void> {
    await database.write(async () => {
      await stock.destroyPermanently();
    });
  }
}
