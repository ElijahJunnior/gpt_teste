import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindAllExamplesUseCase } from "./FindAllExamplesUseCase";

export class FindAllExamplesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const use_case = container.resolve(FindAllExamplesUseCase);

    const examples = await use_case.execute();

    return res.json(examples);
  }
}
