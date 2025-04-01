import { IPayloadJwt } from "@shared/types/IPayloadJwt";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Request {
      auth?: IPayloadJwt;
    }

    namespace Multer {
      /** Object containing file metadata and access information. */
      // eslint-disable-next-line @typescript-eslint/naming-convention
      export interface File {
        url?: string;
      }
    }
  }
}
