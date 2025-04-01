import { AppError } from "@shared/errors/AppError";

export namespace ReplaceUserPasswordErro {
  export class GenericError extends AppError {
    constructor() {
      super("Erro ao tentar efetuar a troca da senha!");
    }
  }

  export class ExpiredResetPasswordKey extends AppError {
    constructor() {
      super("O prazo para redefinir a senha expirou!");
    }
  }
}
