import { Request, Response } from "express";
import { container } from "tsyringe";

import { getUserProfileByIdSchema } from "./GetUserProfileByIdSchema";
import { GetUserProfileByIdUseCase } from "./GetUserProfileByIdUseCase";

export class GetUserProfileByIdController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { user_id } = getUserProfileByIdSchema.validateSync(req.params, {
      stripUnknown: true,
    });

    const use_case = container.resolve(GetUserProfileByIdUseCase);

    const user = await use_case.execute(user_id);

    return res.json(user);
  }
}
