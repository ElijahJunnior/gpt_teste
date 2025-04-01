import * as yup from "yup";

export const findExampleByIdSchema = yup.object({
  id: yup
    .string()
    .required("O ID não foi informado!")
    .trim()
    .uuid("O ID de exemplo informado é inválido."),
});
