import { inject, injectable } from "tsyringe";

import { ExampleErro } from "@modules/example/errors/ExampleErro";
import { IExamplesRepository } from "@modules/example/repositories/IExamplesRepository";

@injectable()
export class DeleteExampleUseCase {
  constructor(
    @inject("ExamplesRepository")
    private readonly examplesRepository: IExamplesRepository
  ) {}

  async execute(id: string): Promise<void> {
    const example = await this.examplesRepository.findById(id);

    if (example === undefined) {
      throw new ExampleErro.ExampleNotExists();
    }

    await this.examplesRepository.delete(id);
  }
}
