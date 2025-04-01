import { Request, Response } from "express";
import { container } from "tsyringe";

import validateOptions from "@config/yupValidateOptions";

import {
  updateExampleBodySchema,
  updateExampleParamsSchema,
} from "./UpdateExampleSchema";
import { UpdateExampleUseCase } from "./UpdateExampleUseCase";

export class UpdateExampleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = updateExampleParamsSchema.validateSync(
      req.params,
      validateOptions
    );

    const { email, name } = updateExampleBodySchema.validateSync(
      req.body,
      validateOptions
    );

    const use_case = container.resolve(UpdateExampleUseCase);

    const example = await use_case.execute({
      id,
      name,
      email,
    });

    return res.json(example);
  }
}
