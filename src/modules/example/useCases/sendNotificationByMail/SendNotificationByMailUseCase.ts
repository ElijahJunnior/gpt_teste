import { resolve } from "path";
import { inject, injectable } from "tsyringe";

import { ExampleErro } from "@modules/example/errors/ExampleErro";
import { IExamplesRepository } from "@modules/example/repositories/IExamplesRepository";
import { IMailProvider } from "@shared/providers/MailProvider/IMailProvider";

import { SendNotificationByMailErro } from "./SendNotificationByMailErro";

interface IExampleMailVariables {
  user_name: string;
}

interface ISendNotificationProps {
  id: string;
  recipients_email: string;
}

@injectable()
export class SendNotificationByMailUseCase {
  constructor(
    @inject("ExamplesRepository")
    private readonly examplesRepository: IExamplesRepository,
    @inject("MailProvider")
    private readonly mailProvider: IMailProvider
  ) {}

  async execute({
    id,
    recipients_email,
  }: ISendNotificationProps): Promise<void> {
    const example = await this.examplesRepository.findById(id);

    if (example == null) {
      throw new ExampleErro.ExampleNotExists();
    }

    const view_path = resolve(
      __dirname,
      "../../views/email/example_notification.html"
    );

    const variables: IExampleMailVariables = {
      user_name: example.name,
    };

    try {
      await this.mailProvider.sendMail(
        recipients_email,
        "Notificação de exemplo",
        view_path,
        variables
      );
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      throw new SendNotificationByMailErro.ErroToSendMail();
    }
  }
}
