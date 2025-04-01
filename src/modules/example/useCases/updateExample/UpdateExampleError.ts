import { AppError } from "@shared/errors/AppError";

export namespace UpdateExampleError {
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
