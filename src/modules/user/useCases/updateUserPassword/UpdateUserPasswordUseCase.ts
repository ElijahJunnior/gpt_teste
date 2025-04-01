import { compare, hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { UserError } from "@modules/user/errors/UserError";
import { ISessionsRepository } from "@modules/user/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";

import { UpdateUserPasswordErro } from "./UpdateUserPasswordErro";

interface IUpdatePasswordProps {
  user_id: string;
  old_password: string;
  new_password: string;
}
@injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("SessionsRepository")
    private readonly sessionsRepository: ISessionsRepository
  ) {}

  async execute({
    user_id,
    new_password,
    old_password,
  }: IUpdatePasswordProps): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (user == null) {
      throw new UserError.UserNotFound();
    }

    const password_valid = await compare(old_password, user.password);

    if (!password_valid) {
      throw new UpdateUserPasswordErro.InvalidPassword();
    }

    const password_hash = await hash(new_password, 8);

    await this.usersRepository.updatePassword(user_id, password_hash);

    await this.sessionsRepository.deleteByUser(user_id);
  }
}
