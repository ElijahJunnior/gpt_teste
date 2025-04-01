import axios from "axios";
import { Request, Response, NextFunction } from "express";

import { mainConfig } from "@config/mainConfig";
import { AppError } from "@shared/errors/AppError";

async function ensureRecaptchaIsValid(
  req: Request,
  res: Response,
  nxt: NextFunction
): Promise<void> {
  try {
    const { re_captcha_enabled, re_captcha_secret_key } = mainConfig;

    let recaptcha = req.body?.recaptcha_token as string | undefined;

    if (!re_captcha_enabled) {
      return nxt();
    }

    if (recaptcha == null) {
      const { "recaptcha-token": header_recaptcha } = req.headers;

      if (header_recaptcha != null) {
        recaptcha = header_recaptcha as string;
      } else {
        throw new AppError("A resposta do Google ReCAPTCHA não foi informada.");
      }
    }

    const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${re_captcha_secret_key}&response=${recaptcha}`;

    const { data } = await axios.post(VERIFY_URL);

    if (data == null || data.success !== true) {
      throw new AppError(
        "A resposta do Google ReCAPTCHA é inválido ou está incorreta.",
        400
      );
    }

    nxt();
  } catch (err) {
    throw err;
  }
}

export { ensureRecaptchaIsValid };
