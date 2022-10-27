import { database } from '@database/index';
import { Category as CategoryModel } from '@database/models/categoryModel';

import {
  RemovedCategory,
  UpdatedCategory,
  NewCategory,
} from '@store/slices/categorySlice';

export class CategoryUseCase {
  public static async get() {
    const data = await database
      .get<CategoryModel>('categories')
      .query()
      .fetch();

    return data;
  }

  public static async create({ name }: NewCategory): Promise<void> {
    await database.write(async () => {
      await database.get<CategoryModel>('categories').create(data => {
        data.name = name;
      });
    });
  }

  public static async update({ updatedCategory, category }: UpdatedCategory) {
    await database.write(async () => {
      await category.update(data => {
        data.name = updatedCategory.name || category.name;
      });
    });
  }

  public static async remove({ category }: RemovedCategory) {
    await database.write(async () => {
      await category.destroyPermanently();
    });
  }
}
