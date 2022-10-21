import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Category } from './categoryModel';

export class Product extends Model {
  static table = 'products';

  @field('stockId') stockId!: string;

  @field('name') name!: string;

  @field('categoryId') categoryId!: string;

  @field('image') image?: string;

  @field('price') price!: number;

  @field('quantitySold') quantitySold!: number;

  @relation('categories', 'categoryId') category!: Category;
}
