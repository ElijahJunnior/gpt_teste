import { Router } from "express";

import { ensureRecaptchaIsValid } from "@middlewares/ensureRecaptchaIsValid";
import { CreateUserController } from "@modules/user/useCases/createUser/CreateUserController";
import { CreateUserSessionController } from "@modules/user/useCases/createUserSession/CreateUserSessionController";
import { GetUserProfileByIdController } from "@modules/user/useCases/getUserProfileById/GetUserProfileByIdController";
import { GetUserProfileByTokenController } from "@modules/user/useCases/getUserProfileByToken/GetUserProfileByTokenController";
import { RefreshUserTokenController } from "@modules/user/useCases/refreshUserToken/RefreshUserTokenController";
import { ReplaceUserPasswordController } from "@modules/user/useCases/replaceUserPassword/ReplaceUserPasswordController";
import { SendUserForgotPasswordMailController } from "@modules/user/useCases/sendUserForgotPasswordMail/SendUserForgotPasswordMailController";
import { SendUserValidationMailController } from "@modules/user/useCases/sendUserValidationMail/SendUserValidationMailController";
import { UpdateUserController } from "@modules/user/useCases/updateUser/UpdateUserController";
import { UpdateUserPasswordController } from "@modules/user/useCases/updateUserPassword/UpdateUserPasswordController";
import { ValidateUserAccountController } from "@modules/user/useCases/validateUserAccount/ValidateUserAccountController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();

// POST
const create_user = new CreateUserController();
usersRoutes.post("/", ensureRecaptchaIsValid, create_user.handle);

const send_validation_mail = new SendUserValidationMailController();
usersRoutes.post(
  "/send-validation-message",
  ensureAuthenticated,
  send_validation_mail.handle
);

const send_forgot_password_mail = new SendUserForgotPasswordMailController();
usersRoutes.post(
  "/send-forgot-pass-message",
  ensureRecaptchaIsValid,
  send_forgot_password_mail.handle
);

const create_session = new CreateUserSessionController();
usersRoutes.post("/sessions", ensureRecaptchaIsValid, create_session.handle);

const refresh_token = new RefreshUserTokenController();
usersRoutes.post("/sessions/refresh-token", refresh_token.handle);

// GET
const get_user_by_id = new GetUserProfileByIdController();
usersRoutes.get("/:user_id", get_user_by_id.handle);

const get_user_by_token = new GetUserProfileByTokenController();
usersRoutes.get("/", ensureAuthenticated, get_user_by_token.handle);

// PUT
const update_user = new UpdateUserController();
usersRoutes.put("/", ensureAuthenticated, update_user.handle);

// PATCH
const update_user_password = new UpdateUserPasswordController();
usersRoutes.patch(
  "/password",
  ensureAuthenticated,
  update_user_password.handle
);

const validate_user_account = new ValidateUserAccountController();
usersRoutes.patch(
  "/validate-account",
  ensureRecaptchaIsValid,
  validate_user_account.handle
);

const replace_password = new ReplaceUserPasswordController();
usersRoutes.patch(
  "/replace-password",
  ensureRecaptchaIsValid,
  replace_password.handle
);

export { usersRoutes };
