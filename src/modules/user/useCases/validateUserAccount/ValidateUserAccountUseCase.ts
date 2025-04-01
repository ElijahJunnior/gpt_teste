import { decode, TokenExpiredError, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { UserError } from "@modules/user/errors/UserError";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";

import { ValidateUserAccountErro } from "./ValidateUserAccountErro";

interface IPayload {
  sub: string;
}

@injectable()
export class ValidateUserAccountUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute(activation_key: string): Promise<void> {
    const { sub: user_id } = decode(activation_key) as IPayload;

    const user = await this.usersRepository.findById(user_id);

    if (user === undefined) {
      throw new UserError.UserNotFound();
    }

    if (user.validation_key !== activation_key) {
      throw new ValidateUserAccountErro.InvalidActivationKey();
    }

    try {
      verify(activation_key, process.env.JWT_VERIFY_SECRET as string);
    } catch (err) {
      await this.usersRepository.updateValidationKey(user.id, "");

      if (err instanceof TokenExpiredError) {
        throw new ValidateUserAccountErro.ExpiredActivationKey();
      }

      throw new ValidateUserAccountErro.InvalidActivationKey();
    }

    await this.usersRepository.setValidatedAndClearValidationKey(user_id);
  }
}
