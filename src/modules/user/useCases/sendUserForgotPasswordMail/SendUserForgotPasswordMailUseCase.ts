import { sign } from "jsonwebtoken";
import { resolve } from "path";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";
import { IMailProvider } from "@shared/providers/MailProvider/IMailProvider";

interface IVariables {
  user_name: string;
  forgot_password_url: string;
}

@injectable()
export class SendUserForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("MailProvider")
    private readonly mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (user != null) {
      const forgot_secret = process.env.JWT_FORGOT_PASSWORD_SECRET as string;

      const reset_password_key = sign({}, forgot_secret, {
        subject: user.id,
        expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRES_IN,
      });

      await this.usersRepository.updateForgotPasswordKey(
        user.id,
        reset_password_key
      );

      const view_path = resolve(
        __dirname,
        "../../views/email/forgot_password.html"
      );

      const front_end_url = process.env.FRONTEND_URL ?? "";

      const variables: IVariables = {
        user_name: user.name,
        forgot_password_url:
          front_end_url + `/users/refresh-password?t=${reset_password_key}`,
      };

      try {
        await this.mailProvider.sendMail(
          user.email,
          "Redefina sua senha!",
          view_path,
          variables
        );
      } catch {}
    }
  }
}
