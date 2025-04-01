import { AppError } from "@shared/errors/AppError";

export namespace CreateExampleError {
  export class NameAlreadyExists extends AppError {
    constructor() {
      super("Já existe um exemplo com o nome informado!", 400);
    }
  }

  export class EmailAlreadyExists extends AppError {
    constructor() {
      super("Já existe um exemplo com o e-mail informado!", 400);
    }
  }
}
