import { Request, Response } from "express";
import { container } from "tsyringe";

import validateOptions from "@config/yupValidateOptions";

import { updateExampleActivationSchema } from "./UpdateExampleActivationSchama";
import { UpdateExampleActivationUseCase } from "./UpdateExampleActivationUseCase";

export class UpdateExampleActivationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = updateExampleActivationSchema.validateSync(
      req.params,
      validateOptions
    );

    const use_case = container.resolve(UpdateExampleActivationUseCase);

    const example = await use_case.execute(id);

    return res.json(example);
  }
}
