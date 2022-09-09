import { Q } from '@nozbe/watermelondb';
import { database } from '@database/index';
import { Order as OrderModel } from '@database/models/orderModel';
import {
  NewOrder,
  OrdersResponse,
  RemovedOrder,
  UpdatedOrder,
} from '@store/slices/orderSlice';

export class OrderUseCase {
  public static async create({ quantity, productId, billId }: NewOrder) {
    await database.write(async () => {
      await database.get<OrderModel>('orders').create(data => {
        (data.quantity = quantity),
          (data.productId = productId),
          (data.billId = billId);
      });
    });
  }

  public static async get({
    billId,
  }: {
    billId: string;
  }): Promise<OrdersResponse[]> {
    const data = await database
      .get<OrderModel>('orders')
      .query(Q.where('billId', billId))
      .fetch();

    const orders = data.map(async order => {
      return {
        id: order.id,
        productId: order.productId,
        billId: order.billId,
        quantity: order.quantity,
        product: await order.product,
        bill: await order.bill,
      };
    });

    return Promise.all(orders);
  }

  public static async update({
    updatedOrder: { quantity, productId, billId },
    order,
  }: UpdatedOrder): Promise<void> {
    await database.write(async () => {
      await order.update(data => {
        (data.quantity = quantity || order.quantity),
          (data.productId = productId || order.productId),
          (data.billId = billId || order.billId);
      });
    });
  }

  public static async remove({ order }: RemovedOrder): Promise<void> {
    await database.write(async () => {
      await order.destroyPermanently();
    });
  }
}
