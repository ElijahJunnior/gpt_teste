import * as yup from "yup";

export const sendNotificationByMailBodySchema = yup.object({
  recipients_email: yup
    .string()
    .required("O e-mail do destinatário não foi informado!")
    .trim()
    .email("O e-mail do destinatário informado é inválido!"),
});

export const sendNotificationByMailParamsSchema = yup.object({
  id: yup
    .string()
    .required("O ID do usuário não foi informado!")
    .trim()
    .uuid("O ID do usuário informado é inválido!"),
});
