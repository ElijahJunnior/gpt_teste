interface ISendMailVariables {
  name: string;
  value: string;
}

interface IMailProvider {
  sendMail<T>(
    to: string,
    subject: string,
    view_path: string,
    variables: ISendMailVariables[] | T
  ): Promise<void>;
}

export { IMailProvider, ISendMailVariables };
