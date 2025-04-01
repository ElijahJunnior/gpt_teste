import { container } from "tsyringe";

import { IMailProvider } from "./IMailProvider";
import { SMTPMailProvider } from "./implementations/SMTPMailProvider";

container.registerInstance<IMailProvider>(
  "MailProvider",
  container.resolve(SMTPMailProvider)
);
