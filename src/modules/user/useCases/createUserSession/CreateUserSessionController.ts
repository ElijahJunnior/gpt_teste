import { Request, Response } from "express";
import { container } from "tsyringe";

import { createUserSessionSchema } from "./CreateUserSessionSchema";
import { CreateUserSessionUseCase } from "./CreateUserSessionUseCase";

export class CreateUserSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = createUserSessionSchema.validateSync(req.body, {
      stripUnknown: true,
    });

    const use_case = container.resolve(CreateUserSessionUseCase);

    const session = await use_case.execute({ email, password });

    return res.json(session);
  }
}
