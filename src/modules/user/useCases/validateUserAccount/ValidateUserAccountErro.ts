import { AppError } from "@shared/errors/AppError";

export namespace ValidateUserAccountErro {
  export class InvalidActivationKey extends AppError {
    constructor() {
      super("A Chave de Validação informada é inválida!");
    }
  }

  export class ExpiredActivationKey extends AppError {
    constructor() {
      super("A Chave de Validação informada está expirada!");
    }
  }
}
