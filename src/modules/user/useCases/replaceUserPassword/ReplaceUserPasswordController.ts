import { Request, Response } from "express";
import { container } from "tsyringe";

import { replaceUserPasswordSchema } from "./ReplaceUserPasswordSchema";
import { ReplaceUserPasswordUseCase } from "./ReplaceUserPasswordUseCase";

export class ReplaceUserPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { new_password, reset_password_key } =
      replaceUserPasswordSchema.validateSync(req.body, {
        stripUnknown: true,
      });

    const use_case = container.resolve(ReplaceUserPasswordUseCase);

    await use_case.execute(reset_password_key, new_password);

    return res.send();
  }
}
