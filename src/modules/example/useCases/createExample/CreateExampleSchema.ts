import * as yup from "yup";

export const createExampleSchema = yup
  .object({
    name: yup
      .string()
      .required("O nome do exemplo é obrigatório!")
      .trim()
      .max(50, "O nome do exemplo deve ter no máximo 50 carácteres!"),
    email: yup
      .string()
      .required("O e-mail do exemplo é obrigatório!")
      .trim()
      .email("O nome do exemplo é inválido!"),
  })
  .required();
