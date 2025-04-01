import { inject, injectable } from "tsyringe";

import { IExampleDTO } from "@modules/example/dtos/IExampleDTO";
import { ExampleErro } from "@modules/example/errors/ExampleErro";
import { ExampleMap } from "@modules/example/mappers/ExampleMap";
import { IExamplesRepository } from "@modules/example/repositories/IExamplesRepository";

import { UpdateExampleError } from "./UpdateExampleError";

interface IUpdateExampleProps {
  id: string;
  name: string;
  email: string;
}

@injectable()
export class UpdateExampleUseCase {
  constructor(
    @inject("ExamplesRepository")
    private readonly examplesRepository: IExamplesRepository
  ) {}

  async execute({
    id,
    name,
    email,
  }: IUpdateExampleProps): Promise<IExampleDTO> {
    const example = await this.examplesRepository.findById(id);

    if (example === undefined) {
      throw new ExampleErro.ExampleNotExists();
    }

    const name_exists = await this.examplesRepository.findByName(name);

    if (name_exists !== undefined) {
      throw new UpdateExampleError.NameAlreadyExists();
    }

    const email_exists = await this.examplesRepository.findByEmail(email);

    if (email_exists !== undefined) {
      throw new UpdateExampleError.EmailAlreadyExists();
    }

    await this.examplesRepository.update(id, name, email);

    return ExampleMap.toExampleDTO({
      ...example,
      name,
      email,
    });
  }
}
