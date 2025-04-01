import { AppError } from "@shared/errors/AppError";

export namespace GetUserProfileByTokenErro {
  export class InvalidRefreshToken extends AppError {
    constructor() {
      super("O Token informado é invalido!", 400);
    }
  }
}
