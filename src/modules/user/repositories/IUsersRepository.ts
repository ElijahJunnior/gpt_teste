import { IUserCreateDTO } from "../dtos/IUserCreateDTO";
import { IUserUpdateDTO } from "../dtos/IUserUpdateDTO";
import { User } from "../entities/User";

export interface IUsersRepository {
  create(data: IUserCreateDTO): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  update(date: IUserUpdateDTO): Promise<void>;
  updatePassword(user_id: string, new_password: string): Promise<void>;
  updateValidationKey(
    user_id: string,
    new_validation_key: string
  ): Promise<void>;
  updateForgotPasswordKey(
    user_id: string,
    new_reset_password_key: string
  ): Promise<void>;
  setValidatedAndClearValidationKey(user_id: string): Promise<void>;
  updatedPasswordAndClearForgotKey(
    user_id: string,
    new_password: string
  ): Promise<void>;
}
