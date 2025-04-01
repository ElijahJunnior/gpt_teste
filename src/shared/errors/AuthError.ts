import { AppError } from "./AppError";

export namespace AuthError {
  export class InvalidToken extends AppError {
    constructor() {
      super("Token inválido!", 401);
    }
  }

  export class ExpiredToken extends AppError {
    constructor() {
      super("Token expirado!", 401);
    }
  }

  export class TokenNotProvided extends AppError {
    constructor() {
      super("Token não informado!", 401);
    }
  }

  export class InvalidRole extends AppError {
    constructor() {
      super("Você não tem permissão para acessar essa rota!", 403);
    }
  }
}
