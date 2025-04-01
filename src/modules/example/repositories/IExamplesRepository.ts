import { IExampleCreateDTO } from "../dtos/IExampleCreateDTO";
import { Example } from "../entities/Example";

export interface IExamplesRepository {
  create(data: IExampleCreateDTO): Promise<Example>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Example | undefined>;
  findByName(name: string): Promise<Example | undefined>;
  findByEmail(email: string): Promise<Example | undefined>;
  findAll(): Promise<Example[]>;
  updateActivation(id: string, activation: boolean): Promise<void>;
  update(id: string, new_name: string, new_email: string): Promise<void>;
}
