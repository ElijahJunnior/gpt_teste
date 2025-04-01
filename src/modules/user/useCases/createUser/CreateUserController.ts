import { Request, Response } from "express";
import { container } from "tsyringe";

import { createUserSchema } from "./CreateUserSchema";
import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, name, password } = createUserSchema.validateSync(req.body, {
      stripUnknown: true,
    });

    const use_case = container.resolve(CreateUserUseCase);

    const user = await use_case.execute({ email, name, password });

    return res.json(user);
  }
}
