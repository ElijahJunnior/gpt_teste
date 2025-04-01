import { container } from "tsyringe";

import { IExamplesRepository } from "@modules/example/repositories/IExamplesRepository";
import { IExamplesRepositoryMemory } from "@modules/example/repositories/implementations/IExamplesRepositoryMemory";
import { SessionsRepositoryDynamo } from "@modules/user/repositories/implementations/SessionsRepositoryDynamo";
import { UsersRepositoryDynamo } from "@modules/user/repositories/implementations/UsersRepositoryDynamo";
import { ISessionsRepository } from "@modules/user/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";

container.registerSingleton<IExamplesRepository>(
  "ExamplesRepository",
  IExamplesRepositoryMemory
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepositoryDynamo
);

container.registerSingleton<ISessionsRepository>(
  "SessionsRepository",
  SessionsRepositoryDynamo
);
