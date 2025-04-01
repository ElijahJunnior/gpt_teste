import { Request, Response } from "express";
import { container } from "tsyringe";

import yupValidateOptions from "@config/yupValidateOptions";

import { deleteExampleSchema } from "./DeleteExampleSchema";
import { DeleteExampleUseCase } from "./DeleteExampleUseCase";

export class DeleteExampleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = deleteExampleSchema.validateSync(
      req.params,
      yupValidateOptions
    );

    const use_case = container.resolve(DeleteExampleUseCase);

    await use_case.execute(id);

    return res.send();
  }
}
