import * as yup from "yup";

export const updateExampleParamsSchema = yup.object({
  id: yup
    .string()
    .required("O ID não foi informado!")
    .trim()
    .uuid("O ID de exemplo informado é inválido."),
});

export const updateExampleBodySchema = yup.object({
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
});
