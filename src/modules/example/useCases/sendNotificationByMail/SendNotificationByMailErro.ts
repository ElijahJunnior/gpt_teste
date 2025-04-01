import { AppError } from "@shared/errors/AppError";

export namespace SendNotificationByMailErro {
  export class ErroToSendMail extends AppError {
    constructor() {
      super("Erro ao enviar o e-mail!");
    }
  }
}
