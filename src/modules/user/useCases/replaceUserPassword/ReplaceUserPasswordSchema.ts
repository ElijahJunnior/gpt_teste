import * as yup from "yup";

export const replaceUserPasswordSchema = yup.object({
  reset_password_key: yup
    .string()
    .required("A chave para redefinir a senha não foi informada!")
    .trim(),
  new_password: yup.string().required("A senha não foi informada!").trim(),
});
