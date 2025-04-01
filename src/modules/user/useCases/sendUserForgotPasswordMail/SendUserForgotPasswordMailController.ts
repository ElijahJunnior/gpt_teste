import { Request, Response } from "express";
import { container } from "tsyringe";

import { sendUserForgotPasswordMailSchema } from "./SendUserForgotPasswordMailSchema";
import { SendUserForgotPasswordMailUseCase } from "./SendUserForgotPasswordMailUseCase";

export class SendUserForgotPasswordMailController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email } = sendUserForgotPasswordMailSchema.validateSync(req.body, {
      stripUnknown: true,
    });

    const use_case = container.resolve(SendUserForgotPasswordMailUseCase);

    await use_case.execute(email);

    return res.send();
  }
}
