import { AppError } from "@shared/errors/AppError";

export namespace SendUserValidationMailErro {
  export class UserAccountAlreadyValidated extends AppError {
    constructor() {
      super("A conta de usuário já foi validada!");
    }
  }

  export class UserAccountValidationError extends AppError {
    constructor() {
      super("Erro ao validar a conta de usuário!");
    }
  }

  export class UserAccountValidationTimeExceeded extends AppError {
    constructor() {
      super("O prazo da validação expirou!");
    }
  }
}
