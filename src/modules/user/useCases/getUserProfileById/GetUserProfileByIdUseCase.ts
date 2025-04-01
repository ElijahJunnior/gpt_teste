import { inject, injectable } from "tsyringe";

import { IUserDTO } from "@modules/user/dtos/IUserDTO";
import { UserError } from "@modules/user/errors/UserError";
import { UserMap } from "@modules/user/mappers/UserMap";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";

@injectable()
export class GetUserProfileByIdUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute(user_id: string): Promise<IUserDTO> {
    const user_base = await this.usersRepository.findById(user_id);

    if (user_base === undefined) {
      throw new UserError.UserNotFound();
    }

    const user = UserMap.toUserDTO(user_base);

    return user;
  }
}
