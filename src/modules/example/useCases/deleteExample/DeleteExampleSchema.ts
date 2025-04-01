import * as yup from "yup";

export const deleteExampleSchema = yup.object({
  id: yup
    .string()
    .required("O ID não foi informado!")
    .trim()
    .uuid("O ID de exemplo informado é inválido."),
});
