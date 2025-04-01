import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";

import { IMailProvider, ISendMailVariables } from "../IMailProvider";

class SMTPMailProvider implements IMailProvider {
  private readonly client: Transporter;

  constructor() {
    const transporter = {
      pool: process.env.MAIL_POOL === "S",
      host: process.env.MAIL_SMTP_HOST ?? "",
      port: Number(process.env.MAIL_SMTP_PORT ?? 0),
      secure: process.env.MAIL_SMTP_USE_TLS === "S",
      auth: {
        user: process.env.MAIL_SMTP_AUTH_USER ?? "",
        pass: process.env.MAIL_SMTP_AUTH_PASSWORD ?? "",
      },
    };

    this.client = nodemailer.createTransport(transporter);
  }

  async sendMail<T>(
    to: string,
    subject: string,
    view_path: string,
    variables: T | ISendMailVariables[]
  ): Promise<void> {
    const view_content = fs.readFileSync(view_path).toString("utf-8");

    const viewParser = handlebars.compile(view_content);

    const view_HTML = viewParser(variables);

    const from = `${process.env.MAIL_SENDER_NAME ?? ""} <${
      process.env.MAIL_SENDER_ADDRESS ?? ""
    }>`;

    await this.client.sendMail({
      to,
      subject,
      from,
      html: view_HTML,
    });
  }
}

export { SMTPMailProvider };
