import * as yup from "yup";

export const updateUserPasswordSchema = yup.object({
  old_password: yup.string().required("A senha anterior não foi informada!"),
  new_password: yup
    .string()
    .required("A nova senha não foi informada!")
    .trim()
    .min(8, "A senha precisa tre no mínimo 8 caracteres!"),
});
