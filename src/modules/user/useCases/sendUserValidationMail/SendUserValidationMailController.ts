import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthError } from "@shared/errors/AuthError";

import { SendUserValidationMailUseCase } from "./SendUserValidationMailUseCase";

export class SendUserValidationMailController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { auth } = req;

    if (auth == null || auth.user == null) {
      throw new AuthError.InvalidToken();
    }

    const use_case = container.resolve(SendUserValidationMailUseCase);

    await use_case.execute(auth.user.id);

    return res.send();
  }
}
