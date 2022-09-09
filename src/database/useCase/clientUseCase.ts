import { Q } from '@nozbe/watermelondb';
import { database } from '@database/index';
import { Client as ClientModel } from '@database/models/clientModal';
import {
  NewClient,
  RemovedClient,
  UpdatedClient,
} from '@store/slices/clientSlice';

export class ClientUseCase {
  public static async create({ userId, name, email, phone }: NewClient) {
    await database.write(async () => {
      await database.get<ClientModel>('clients').create(data => {
        (data.userId = userId),
          (data.name = name),
          (data.email = email),
          (data.phone = phone);
      });
    });
  }

  public static async get({
    userId,
  }: {
    userId: string;
  }): Promise<ClientModel[]> {
    return database
      .get<ClientModel>('clients')
      .query(Q.where('userId', userId))
      .fetch();
  }

  public static async update({
    updatedClient: { userId, email, name, phone },
    client,
  }: UpdatedClient): Promise<void> {
    await database.write(async () => {
      await client.update(data => {
        (data.userId = userId || client.userId),
          (data.name = name || client.name),
          (data.email = email || client.email),
          (data.phone = phone || client.phone);
      });
    });
  }

  public static async remove({ client }: RemovedClient): Promise<void> {
    await database.write(async () => {
      await client.destroyPermanently();
    });
  }
}
