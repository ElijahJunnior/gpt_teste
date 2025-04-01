import { AppError } from "@shared/errors/AppError";

export namespace UserError {
  export class UserEmailAlreadyExists extends AppError {
    constructor() {
      super("O e-mail informado já está em uso!");
    }
  }

  export class UserNotFound extends AppError {
    constructor() {
      super("O usuário informado não existe!");
    }
  }
}
