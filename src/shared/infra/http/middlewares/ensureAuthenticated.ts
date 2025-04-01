import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";

import { mainConfig } from "@config/mainConfig";
import { AuthError } from "@shared/errors/AuthError";
import { IPayloadJwt } from "@shared/types/IPayloadJwt";

async function ensureAuthenticated(
  req: Request,
  res: Response,
  nxt: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader == null || authHeader === "") {
    throw new AuthError.TokenNotProvided();
  }

  const [, token] = authHeader.split(" ");

  if (token === mainConfig.system_auth_key) {
    req.auth = {
      roles: ["system"],
    };

    nxt();
  } else {
    try {
      const auth = verify(token, mainConfig.jwt_token_secret) as IPayloadJwt;

      req.auth = auth;

      nxt();

      return;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new AuthError.ExpiredToken();
      }

      throw new AuthError.InvalidToken();
    }
  }
}

export { ensureAuthenticated };
