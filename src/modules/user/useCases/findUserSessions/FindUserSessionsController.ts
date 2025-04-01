import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthError } from "@shared/errors/AuthError";

import { FindUserSessionsUseCase as UseCase } from "./FindUserSessionsUseCase";

export class FindUserSessionsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { auth } = req;

    if (auth == null || auth.user == null) {
      throw new AuthError.InvalidToken();
    }

    const use_case = container.resolve(UseCase);

    const sessions = await use_case.execute(auth.user.id);

    return res.json(sessions);
  }
}
