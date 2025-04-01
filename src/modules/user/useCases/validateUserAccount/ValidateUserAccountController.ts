import { Request, Response } from "express";
import { container } from "tsyringe";

import { validateUserAccountSchema } from "./ValidateUserAccountSchema";
import { ValidateUserAccountUseCase } from "./ValidateUserAccountUseCase";

export class ValidateUserAccountController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { validation_key } = validateUserAccountSchema.validateSync(
      req.body,
      {
        stripUnknown: true,
      }
    );

    const use_case = container.resolve(ValidateUserAccountUseCase);

    await use_case.execute(validation_key);

    return res.send();
  }
}
