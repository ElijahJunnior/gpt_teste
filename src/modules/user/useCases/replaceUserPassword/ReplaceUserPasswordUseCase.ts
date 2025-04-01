import { hash } from "bcryptjs";
import { decode, TokenExpiredError, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { ISessionsRepository } from "@modules/user/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";

import { ReplaceUserPasswordErro } from "./ReplaceUserPasswordErro";

interface IPayload {
  sub: string;
}

@injectable()
export class ReplaceUserPasswordUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("SessionsRepository")
    private readonly sessionsRepository: ISessionsRepository
  ) {}

  async execute(
    reset_password_key: string,
    new_password: string
  ): Promise<void> {
    const { sub: user_id } = decode(reset_password_key) as IPayload;

    const user = await this.usersRepository.findById(user_id);

    if (user == null) {
      throw new ReplaceUserPasswordErro.GenericError();
    }

    if (user.reset_password_key !== reset_password_key) {
      throw new ReplaceUserPasswordErro.GenericError();
    }

    try {
      verify(
        reset_password_key,
        process.env.JWT_FORGOT_PASSWORD_SECRET as string
      );
    } catch (err) {
      await this.usersRepository.updateValidationKey(user.id, "");

      if (err instanceof TokenExpiredError) {
        throw new ReplaceUserPasswordErro.ExpiredResetPasswordKey();
      }

      throw new ReplaceUserPasswordErro.GenericError();
    }

    const password_hash = await hash(new_password, 8);

    await this.usersRepository.updatedPasswordAndClearForgotKey(
      user.id,
      password_hash
    );

    await this.sessionsRepository.deleteByUser(user.id);
  }
}
