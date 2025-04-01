import { AppError } from "@shared/errors/AppError";

export namespace CreateUserSessionError {
  export class InvalidAuthenticationData extends AppError {
    constructor() {
      super("O e-mail ou senha informado é inválido!");
    }
  }
}
