import { Request, Response } from "express";
import { container } from "tsyringe";

import {
  sendNotificationByMailBodySchema,
  sendNotificationByMailParamsSchema,
} from "./SendNotificationByMailSchema";
import { SendNotificationByMailUseCase } from "./SendNotificationByMailUseCase";

export class SendNotificationByMailController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = sendNotificationByMailParamsSchema.validateSync(req.params, {
      stripUnknown: true,
    });

    const { recipients_email } = sendNotificationByMailBodySchema.validateSync(
      req.body,
      {
        stripUnknown: true,
      }
    );

    const use_case = container.resolve(SendNotificationByMailUseCase);

    await use_case.execute({
      id,
      recipients_email,
    });

    return res.send();
  }
}
