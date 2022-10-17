import { Q } from '@nozbe/watermelondb';
import { database } from '@database/index';
import { Order as OrderModel } from '@database/models/orderModel';
import {
  GetOrderById,
  GetOrderByProduct,
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
          (data.billId = billId),
          (data.createAt = Date.now()),
          (data.updateAt = Date.now());
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
        createAt: order.createAt,
        updateAt: order.updateAt,
        product: await order.product,
        bill: await order.bill,
      };
    });

    return Promise.all(orders);
  }

  public static async getById({
    billId,
    orderId,
  }: GetOrderById): Promise<OrderModel> {
    const data = await database
      .get<OrderModel>('orders')
      .query(Q.and(Q.where('billId', billId), Q.where('id', orderId)))
      .fetch();

    return data[0];
  }

  public static async getByProduct({ productId }: GetOrderByProduct) {
    const data = await database
      .get<OrderModel>('orders')
      .query(Q.where('productId', productId))
      .fetch();

    return data;
  }

  public static async update({
    updatedOrder: { quantity, productId, billId },
    order,
  }: UpdatedOrder): Promise<void> {
    await database.write(async () => {
      await order.update(data => {
        (data.quantity = quantity || order.quantity),
          (data.productId = productId || order.productId),
          (data.billId = billId || order.billId),
          (data.createAt = order.createAt),
          (data.updateAt = Date.now());
      });
    });
  }

  public static async remove({ order }: RemovedOrder): Promise<void> {
    await database.write(async () => {
      await order.destroyPermanently();
    });
  }
}
