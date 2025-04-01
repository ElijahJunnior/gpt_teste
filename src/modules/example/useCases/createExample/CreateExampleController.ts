import { Request, Response } from "express";
import { container } from "tsyringe";

import validateOptions from "@config/yupValidateOptions";

import { createExampleSchema } from "./CreateExampleSchema";
import { CreateExampleUseCase } from "./CreateExampleUseCase";

class CreateExampleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email } = createExampleSchema.validateSync(
      req.body,
      validateOptions
    );

    const use_case = container.resolve(CreateExampleUseCase);

    const example = await use_case.execute({ name, email });

    return res.status(201).json(example);
  }
}

export { CreateExampleController };
