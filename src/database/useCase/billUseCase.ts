import { database } from '@database/index';
import { Bill as BillModel } from '@database/models/billModel';
import { Q } from '@nozbe/watermelondb';
import {
  GetBillById,
  GetBillByName,
  NewBill,
  RemovedBill,
  UpdatedBill,
} from '@store/slices/billSlice';

export class BillUseCase {
  public static async create({
    invoiceId,
    userId,
    client: { name, email, phone },
  }: NewBill) {
    await database.write(async () => {
      await database.get<BillModel>('bills').create(data => {
        (data.status = true),
          (data.invoiceId = invoiceId),
          (data.userId = userId),
          (data.image = Math.floor(Math.random() * 20 + 1)),
          (data.name = name),
          (data.email = email),
          (data.phone = phone);
      });
    });
  }

  public static async getOpenBills(): Promise<BillModel[]> {
    const data = await database
      .get<BillModel>('bills')
      .query(Q.where('status', true))
      .fetch();

    return data;
  }

  public static async getClosedBills(): Promise<BillModel[]> {
    const data = await database
      .get<BillModel>('bills')
      .query(Q.where('status', false))
      .fetch();

    return data;
  }

  public static async getByName({
    billName,
  }: GetBillByName): Promise<BillModel[] | undefined> {
    const data = await database
      .get<BillModel>('bills')
      .query(Q.where('status', true))
      .fetch();

    if (billName) {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(billName.toLowerCase()),
      );

      return filtered;
    }
  }

  public static async getById({ billId }: GetBillById): Promise<BillModel> {
    return await database.get<BillModel>('bills').find(billId);
  }

  public static async update({
    updatedBill: {
      invoiceId,
      userId,
      status,
      client: { name, email, phone },
    },
    bill,
  }: UpdatedBill): Promise<void> {
    await database.write(async () => {
      await bill.update(data => {
        (data.status = status ? status : bill.status),
          (data.invoiceId = invoiceId ? invoiceId : bill.invoiceId),
          (data.userId = userId ? userId : bill.userId),
          (data.name = name ? name : bill.name),
          (data.email = email ? email : bill.email),
          (data.phone = phone ? phone : bill.phone);
      });
    });
  }

  public static async closeBill({ bill }: { bill: BillModel }): Promise<void> {
    await database.write(async () => {
      await bill.update(data => {
        (data.status = false),
          (data.invoiceId = bill.invoiceId),
          (data.userId = bill.userId),
          (data.name = bill.name),
          (data.email = bill.email),
          (data.phone = bill.phone);
      });
    });
  }

  public static async remove({ bill }: RemovedBill): Promise<void> {
    await database.write(async () => {
      await bill.destroyPermanently();
    });
  }
}
