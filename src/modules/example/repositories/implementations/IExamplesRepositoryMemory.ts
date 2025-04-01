import { IExampleCreateDTO } from "@modules/example/dtos/IExampleCreateDTO";
import { Example } from "@modules/example/entities/Example";

import { IExamplesRepository } from "../IExamplesRepository";

export class IExamplesRepositoryMemory implements IExamplesRepository {
  private readonly examples: Example[];

  constructor() {
    this.examples = [];
  }

  async create({ email, name }: IExampleCreateDTO): Promise<Example> {
    const example = new Example();

    Object.assign(example, {
      email,
      name,
    });

    this.examples.push(example);

    return example;
  }

  async delete(id: string): Promise<void> {
    const example_index = this.examples.findIndex(
      (example) => example.id === id
    );

    this.examples.splice(example_index, 1);
  }

  async findById(id: string): Promise<Example | undefined> {
    const example = this.examples.find((example) => example.id === id);

    return example;
  }

  async findByName(name: string): Promise<Example | undefined> {
    const example = this.examples.find((example) => example.name === name);

    return example;
  }

  async findByEmail(email: string): Promise<Example | undefined> {
    const example = this.examples.find((example) => example.email === email);

    return example;
  }

  async findAll(): Promise<Example[]> {
    return this.examples;
  }

  async updateActivation(id: string, activation: boolean): Promise<void> {
    const example_index = this.examples.findIndex(
      (example) => example.id === id
    );

    const example = this.examples[example_index];

    example.active = activation;
  }

  async update(id: string, new_name: string, new_email: string): Promise<void> {
    const example_index = this.examples.findIndex(
      (example) => example.id === id
    );

    const example = this.examples[example_index];

    example.name = new_name;
    example.email = new_email;
  }
}
