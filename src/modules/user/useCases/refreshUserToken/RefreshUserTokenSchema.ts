import * as yup from "yup";

export const refreshUserTokenSchema = yup.object({
  refresh_token: yup.string().required("O Refresh Token não foi informado!"),
});
