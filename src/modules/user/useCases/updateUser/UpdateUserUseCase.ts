import { inject, injectable } from "tsyringe";

import { IUserUpdateDTO } from "@modules/user/dtos/IUserUpdateDTO";
import { UserError } from "@modules/user/errors/UserError";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async handle(data: IUserUpdateDTO): Promise<void> {
    const user = await this.usersRepository.findById(data.user_id);

    if (user === undefined) {
      throw new UserError.UserNotFound();
    }

    await this.usersRepository.update(data);
  }
}
