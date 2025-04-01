import { inject, injectable } from "tsyringe";

import { IExampleDTO } from "@modules/example/dtos/IExampleDTO";
import { ExampleErro } from "@modules/example/errors/ExampleErro";
import { ExampleMap } from "@modules/example/mappers/ExampleMap";
import { IExamplesRepository } from "@modules/example/repositories/IExamplesRepository";

@injectable()
export class FindExampleByIdUseCase {
  constructor(
    @inject("ExamplesRepository")
    private readonly examplesRepository: IExamplesRepository
  ) {}

  async execute(id: string): Promise<IExampleDTO> {
    const example = await this.examplesRepository.findById(id);

    if (example === undefined) {
      throw new ExampleErro.ExampleNotExists();
    }

    const mappedExample = ExampleMap.toExampleDTO(example);

    return mappedExample;
  }
}
