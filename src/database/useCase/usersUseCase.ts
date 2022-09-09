import { Q } from '@nozbe/watermelondb';
import { database } from '@database/index';
import { User as UserModel } from '@database/models/userModel';

import { Login, Register } from '@store/slices/userSlice';

export class UserUseCase {
  public static async get({ email, password }: Login): Promise<UserModel[]> {
    const data = await database
      .get<UserModel>('users')
      .query(Q.and(Q.where('password', password), Q.where('email', email)))
      .fetch();

    return data;
  }

  public static async getByEmail({
    email,
  }: {
    email: string;
  }): Promise<UserModel[]> {
    const data = await database
      .get<UserModel>('users')
      .query(Q.where('email', email))
      .fetch();

    return data;
  }

  public static async create({
    name,
    email,
    phone,
    password,
  }: Register): Promise<UserModel[]> {
    const user: UserModel[] = [];

    await database.write(async () => {
      const data = await database.get<UserModel>('users').create(data => {
        (data.name = name),
          (data.email = email),
          (data.phone = phone),
          (data.password = password);
      });

      user.push(data);
    });

    return user;
  }
}
