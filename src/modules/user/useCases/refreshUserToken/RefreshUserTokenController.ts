import { Request, Response } from "express";
import { container } from "tsyringe";

import { refreshUserTokenSchema } from "./RefreshUserTokenSchema";
import { RefreshUserTokenUseCase } from "./RefreshUserTokenUseCase";

export class RefreshUserTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { refresh_token } = refreshUserTokenSchema.validateSync(req.body, {
      stripUnknown: true,
    });

    const use_case = container.resolve(RefreshUserTokenUseCase);

    const session = await use_case.execute(refresh_token);

    return res.json(session);
  }
}
