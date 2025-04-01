import * as yup from "yup";

export const sendUserForgotPasswordMailSchema = yup.object({
  email: yup
    .string()
    .required("O e-mail não foi informado!")
    .trim()
    .email("O e-mail informado é inválido!"),
});
