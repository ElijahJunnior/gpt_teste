import { Request, Response, NextFunction } from "express";

import { AuthError } from "@shared/errors/AuthError";
import { Role } from "@shared/types/Role";

export function ensureHaveRole(roles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { auth } = req;

    if (auth?.roles != null) {
      if (auth.roles.some((userRole) => roles.includes(userRole))) {
        return next();
      }
    }

    throw new AuthError.InvalidRole();
  };
}
