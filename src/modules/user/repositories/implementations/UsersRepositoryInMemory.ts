import { IUserCreateDTO } from "@modules/user/dtos/IUserCreateDTO";
import { IUserUpdateDTO } from "@modules/user/dtos/IUserUpdateDTO";
import { User } from "@modules/user/entities/User";

import { IUsersRepository } from "../IUsersRepository";

export class UsersRepositoryInMemory implements IUsersRepository {
  private readonly users: User[];

  private cloneUser(user: User): User {
    const user_clone = {
      ...user,
    };

    return user_clone;
  }

  constructor() {
    this.users = [];
  }

  async create({ email, name, password }: IUserCreateDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      email,
      name,
      password,
    });

    this.users.push(user);

    return this.cloneUser(user);
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);

    return user !== undefined ? this.cloneUser(user) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);

    return user !== undefined ? this.cloneUser(user) : undefined;
  }

  async update(data: IUserUpdateDTO): Promise<void> {
    const user = this.users.find((user) => user.id === data.user_id);

    if (user != null) {
      user.name = data.name;
    }
  }

  async updatePassword(user_id: string, new_password: string): Promise<void> {
    const user = this.users.find((user) => user.id === user_id);

    if (user != null) {
      user.password = new_password;
    }
  }

  async updateForgotPasswordKey(
    user_id: string,
    new_reset_password_key: string
  ): Promise<void> {
    const user = this.users.find((user) => user.id === user_id);

    if (user != null) {
      user.reset_password_key = new_reset_password_key;
    }
  }

  async updateValidationKey(
    user_id: string,
    new_validation_key: string
  ): Promise<void> {
    const user = this.users.find((user) => user.id === user_id);

    if (user != null) {
      user.validation_key = new_validation_key;
    }
  }

  async setValidatedAndClearValidationKey(user_id: string): Promise<void> {
    const user = this.users.find((user) => user.id === user_id);

    if (user != null) {
      user.validated = true;
      user.validation_key = "";
    }
  }

  async updatedPasswordAndClearForgotKey(
    user_id: string,
    new_password: string
  ): Promise<void> {
    const user = this.users.find((user) => user.id === user_id);

    if (user != null) {
      user.password = new_password;
      user.reset_password_key = "";
    }
  }
}
