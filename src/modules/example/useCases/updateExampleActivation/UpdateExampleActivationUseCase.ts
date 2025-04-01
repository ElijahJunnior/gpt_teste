import { inject, injectable } from "tsyringe";

import { IExampleDTO } from "@modules/example/dtos/IExampleDTO";
import { ExampleErro } from "@modules/example/errors/ExampleErro";
import { ExampleMap } from "@modules/example/mappers/ExampleMap";
import { IExamplesRepository } from "@modules/example/repositories/IExamplesRepository";

@injectable()
export class UpdateExampleActivationUseCase {
  constructor(
    @inject("ExamplesRepository")
    private readonly examplesRepository: IExamplesRepository
  ) {}

  async execute(id: string): Promise<IExampleDTO> {
    const example = await this.examplesRepository.findById(id);

    if (example === undefined) {
      throw new ExampleErro.ExampleNotExists();
    }

    const activation = !example.active;

    await this.examplesRepository.updateActivation(id, activation);

    return ExampleMap.toExampleDTO({
      ...example,
      active: activation,
    });
  }
}
