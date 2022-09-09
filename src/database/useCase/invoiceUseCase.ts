import { database } from '@database/index';
import { Invoice as InvoiceModel } from '@database/models/invoiceModel';
import { Q } from '@nozbe/watermelondb';
import { RemovedInvoice, UpdatedInvoice } from '@store/slices/invoiceSlice';

export class InvoiceUseCase {
  public static async get({ userId }: { userId: string }): Promise<string> {
    const invoice = await database
      .get<InvoiceModel>('invoicing')
      .query(Q.where('userId', userId))
      .fetchIds();

    return invoice[0];
  }

  public static async create({ userId }: { userId: string }): Promise<void> {
    await database.write(async () => {
      await database.get<InvoiceModel>('invoicing').create(data => {
        data.userId = userId;
      });
    });
  }

  public static async update({
    updatedInvoice: { userId },
    invoice,
  }: UpdatedInvoice): Promise<void> {
    await database.write(async () => {
      await invoice.update(data => {
        data.userId = userId || invoice.userId;
      });
    });
  }

  public static async remove({ invoice }: RemovedInvoice) {
    await database.write(async () => {
      await invoice.destroyPermanently();
    });
  }
}
