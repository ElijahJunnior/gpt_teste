import { AppError } from "./AppError";

export namespace MulterFileError {
  export class FileNotFound extends AppError {
    constructor() {
      super("Arquivo não foi informado!", 422);
    }
  }
}
