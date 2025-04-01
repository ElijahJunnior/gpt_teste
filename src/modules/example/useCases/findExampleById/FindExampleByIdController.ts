import { Request, Response } from "express";
import { container } from "tsyringe";

import yupValidateOptions from "@config/yupValidateOptions";

import { findExampleByIdSchema } from "./FindExampleByIdSchema";
import { FindExampleByIdUseCase } from "./FindExampleByIdUseCase";

export class FindExampleByIdController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = findExampleByIdSchema.validateSync(
      req.params,
      yupValidateOptions
    );

    const use_case = container.resolve(FindExampleByIdUseCase);

    const example = await use_case.execute(id);

    return res.json(example);
  }
}
