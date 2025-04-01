import * as yup from "yup";

export const updateUserBodySchema = yup.object({
  name: yup
    .string()
    .required("O nome não foi informado!")
    .min(4, "O nome precisar ter no mínimo 4 caracteres!")
    .max(50, "O nome deve ter no máximo 50 caracteres!")
    .trim(),
});
