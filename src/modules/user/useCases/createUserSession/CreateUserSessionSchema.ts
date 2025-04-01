import * as yup from "yup";

export const createUserSessionSchema = yup.object({
  email: yup
    .string()
    .required("O e-mail não foi informado!")
    .trim()
    .email("O e-mail informado é inválido!"),
  password: yup.string().required("A senha não foi informada!").trim(),
});
