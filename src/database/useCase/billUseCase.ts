import { database } from '@database/index';
import { Bill as BillModel } from '@database/models/billModel';
import {
  BillResponse,
  NewBill,
  RemovedBill,
  UpdatedBill,
} from '@store/slices/billSlice';

export class BillUseCase {
  public static async create({ invoiceId, clientId }: NewBill) {
    await database.write(async () => {
      await database.get<BillModel>('bills').create(data => {
        (data.status = true),
          (data.invoiceId = invoiceId),
          (data.clientId = clientId);
      });
    });
  }

  public static async get(): Promise<BillResponse[]> {
    const data = await database.get<BillModel>('bills').query().fetch();

    const allBills = data.map(async bill => {
      return {
        id: bill.id,
        invoiceId: bill.id,
        clientId: bill.clientId,
        status: bill.status,

        client: await bill.client,
      };
    });

    return Promise.all(allBills);
  }

  public static async update({
    updatedBill: { invoiceId, clientId },
    bill,
  }: UpdatedBill): Promise<void> {
    await database.write(async () => {
      await bill.update(data => {
        (data.status = true),
          (data.invoiceId = invoiceId ? invoiceId : bill.invoiceId),
          (data.clientId = clientId ? clientId : bill.clientId);
      });
    });
  }

  public static async remove({ bill }: RemovedBill): Promise<void> {
    await database.write(async () => {
      await bill.destroyPermanently();
    });
  }
}
