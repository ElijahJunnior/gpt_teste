import * as yup from "yup";

export const validateUserAccountSchema = yup.object({
  validation_key: yup
    .string()
    .required("A Chave de Validação não foi informada!")
    .trim(),
});
