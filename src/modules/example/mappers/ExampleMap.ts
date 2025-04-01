import { instanceToInstance } from "class-transformer";

import { IExampleDTO } from "../dtos/IExampleDTO";
import { Example } from "../entities/Example";

class ExampleMap {
  static toExampleDTO({
    id,
    name,
    email,
    active,
    created_at,
  }: Example): IExampleDTO {
    const example = instanceToInstance({
      id,
      name,
      email,
      active,
      created_at,
    });

    return example;
  }
}

export { ExampleMap };
