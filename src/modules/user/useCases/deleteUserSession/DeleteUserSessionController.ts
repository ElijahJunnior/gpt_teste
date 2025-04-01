import { Request, Response } from "express";
import { container } from "tsyringe";

import yupValidateOptions from "@config/yupValidateOptions";

import { deleteUserSessionSchema as Schema } from "./DeleteUserSessionSchema";
import { DeleteUserSessionUseCase as UseCase } from "./DeleteUserSessionUseCase";

export class DeleteUserSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = Schema.validateSync(req.body, yupValidateOptions);

    const use_case = container.resolve(UseCase);

    await use_case.execute(id);

    return res.send();
  }
}
