import { database } from '@database/index';
import { Spent as SpentModel } from '@database/models/spentModel';
import { Q } from '@nozbe/watermelondb';

import {
  GetSpent,
  NewSpent,
  RemovedSpent,
  UpdatedSpent,
} from '@store/slices/spentSlice';

export class SpentUseCase {
  public static async create({ userId }: NewSpent): Promise<void> {
    await database.write(async () => {
      await database.get<SpentModel>('spending').create(data => {
        data.userId = userId;
      });
    });
  }

  public static async get({ userId }: GetSpent): Promise<string> {
    const spent = await database
      .get<SpentModel>('spending')
      .query(Q.where('userId', userId))
      .fetchIds();

    return spent[0];
  }

  public static async update({
    updatedSpent: { userId },
    spent,
  }: UpdatedSpent): Promise<void> {
    await database.write(async () => {
      await spent.update(data => {
        data.userId = userId || spent.userId;
      });
    });
  }

  public static async remove({ spent }: RemovedSpent): Promise<void> {
    await database.write(async () => {
      await spent.destroyPermanently();
    });
  }
}
