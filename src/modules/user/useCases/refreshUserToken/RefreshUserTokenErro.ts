import { AppError } from "@shared/errors/AppError";

export namespace RefreshUserTokenErro {
  export class InvalidRefreshToken extends AppError {
    constructor() {
      super("O Refresh Token informado é invalido!", 401);
    }
  }

  export class ExpiredRefreshToken extends AppError {
    constructor() {
      super("O Refresh Token está vencido!", 401);
    }
  }
}
