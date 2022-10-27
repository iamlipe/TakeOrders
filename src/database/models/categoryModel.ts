import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Category extends Model {
  static table = 'categories';

  @field('name') name!: string;

  @field('categoryId') categoryId!: string;
}
