import { JwtPayload } from "jsonwebtoken";

import { Role } from "./Role";

export interface IPayloadJwt extends Pick<JwtPayload, "sub" | "iat" | "exp"> {
  roles: Role[];
  session_id?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    validated: boolean;
  };
}
