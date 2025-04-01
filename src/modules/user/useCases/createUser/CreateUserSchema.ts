import * as yup from "yup";
export const createUserSchema = yup.object({
  name: yup
    .string()
    .required("O nome não foi informado!")
    .min(4, "O nome precisar ter no mínimo 4 caracteres!")
    .max(50, "O nome deve ter no máximo 50 caracteres!")
    .trim(),
  email: yup
    .string()
    .required("O de e-mail não foi informado!")
    .email("O e-mail informado é inválido!")
    .trim(),
  password: yup
    .string()
    .required("A senha não foi informada!")
    .min(8, "A senha precisa tre no mínimo 8 caracteres!")
    .trim(),
});
