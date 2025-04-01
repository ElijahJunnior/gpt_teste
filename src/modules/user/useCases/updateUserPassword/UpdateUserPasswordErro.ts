import { AppError } from "@shared/errors/AppError";

export namespace UpdateUserPasswordErro {
  export class InvalidPassword extends AppError {
    constructor() {
      super("A senha antiga informada é inválida!", 400);
    }
  }
}
