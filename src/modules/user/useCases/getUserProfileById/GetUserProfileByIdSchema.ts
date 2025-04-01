import * as yup from "yup";

export const getUserProfileByIdSchema = yup.object({
  user_id: yup
    .string()
    .required("O ID de Usuário não foi informado!")
    .trim()
    .uuid("O ID de Usuário informado é inválido!"),
});
