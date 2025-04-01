import * as yup from "yup";

export const deleteUserSessionSchema = yup.object({
  id: yup
    .string()
    .required("O ID da Sessão não foi informado!")
    .trim()
    .uuid("O ID da Sessão informado é inválido."),
});
