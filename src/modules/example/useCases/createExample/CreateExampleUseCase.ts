import { inject, injectable } from "tsyringe";

import { IExampleCreateDTO } from "@modules/example/dtos/IExampleCreateDTO";
import { IExampleDTO } from "@modules/example/dtos/IExampleDTO";
import { ExampleMap } from "@modules/example/mappers/ExampleMap";
import { IExamplesRepository } from "@modules/example/repositories/IExamplesRepository";

import { CreateExampleError } from "./CreateExampleError";

@injectable()
export class CreateExampleUseCase {
  constructor(
    @inject("ExamplesRepository")
    private readonly examplesRepository: IExamplesRepository
  ) {}

  async execute({ name, email }: IExampleCreateDTO): Promise<IExampleDTO> {
    const name_exists = await this.examplesRepository.findByName(name);

    if (name_exists !== undefined) {
      throw new CreateExampleError.NameAlreadyExists();
    }

    const email_exists = await this.examplesRepository.findByEmail(email);

    if (email_exists !== undefined) {
      throw new CreateExampleError.EmailAlreadyExists();
    }

    const example = await this.examplesRepository.create({ name, email });

    return ExampleMap.toExampleDTO(example);
  }
}
