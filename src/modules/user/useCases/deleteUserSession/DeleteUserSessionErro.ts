import { AppError } from "@shared/errors/AppError";

export namespace DeleteUserSessionErro {
  export class SessionNotFound extends AppError {
    constructor() {
      super("A sessão informada não existe!");
    }
  }
}
