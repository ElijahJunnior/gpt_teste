import { resolve } from "path";

interface IMainConfig {
  api_port: number;
  frontend_url: string;
  system_auth_key: string;
  re_captcha_secret_key: string;
  jwt_token_secret: string;
  jwt_token_expires_in: string;
  jwt_refresh_token_secret: string;
  jwt_refresh_token_expires_in: string;
  jwt_forgot_password_secret: string;
  jwt_forgot_password_expires_in: string;
  jwt_verify_secret: string;
  jwt_verify_expires_in: string;
  temp_folder: string;
  puppeteer_use_external_browser: boolean;
  re_captcha_enabled: boolean;
}

export const mainConfig: IMainConfig = {
  api_port: Number(process.env.API_PORT ?? "3001"),
  frontend_url: process.env.FRONTEND_URL ?? "",
  system_auth_key: process.env.SYSTEM_AUTH_KEY ?? "",
  re_captcha_secret_key: process.env.RE_CAPTCHA_SECRET_KEY ?? "",
  jwt_token_secret: process.env.JWT_TOKEN_SECRET ?? "",
  jwt_token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN ?? "",
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET ?? "",
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? "",
  jwt_forgot_password_secret: process.env.JWT_FORGOT_PASSWORD_SECRET ?? "",
  jwt_forgot_password_expires_in:
    process.env.JWT_FORGOT_PASSWORD_EXPIRES_IN ?? "",
  jwt_verify_secret: process.env.JWT_VERIFY_SECRET ?? "",
  jwt_verify_expires_in: process.env.JWT_VERIFY_EXPIRES_IN ?? "",
  temp_folder: resolve(__dirname, "..", "..", "tmp"),
  puppeteer_use_external_browser:
    (process.env.PUPPETEER_USE_EXTERNAL_BROWSER ?? "S").toUpperCase() === "S",
  re_captcha_enabled:
    (process.env.RE_CAPTCHA_ENABLED ?? "S").toUpperCase() === "S",
};
