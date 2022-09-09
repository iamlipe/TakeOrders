/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users';

  @field('name') name!: string;

  @field('password') password!: string;

  @field('email') email!: string;

  @field('phone') phone?: string;
}
