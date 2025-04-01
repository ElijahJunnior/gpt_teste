import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IUserCreateDTO } from "@modules/user/dtos/IUserCreateDTO";
import { IUserDTO } from "@modules/user/dtos/IUserDTO";
import { UserError } from "@modules/user/errors/UserError";
import { UserMap } from "@modules/user/mappers/UserMap";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({ email, name, password }: IUserCreateDTO): Promise<IUserDTO> {
    const user_exists = await this.usersRepository.findByEmail(email);

    if (user_exists !== undefined) {
      throw new UserError.UserEmailAlreadyExists();
    }

    const password_hash = await hash(password, 8);

    const user = await this.usersRepository.create({
      email,
      name,
      password: password_hash,
    });

    const user_mapped = UserMap.toUserDTO(user);

    return user_mapped;
  }
}
