import { app } from "./app";

// eslint-disable-next-line import-helpers/order-imports
import { mainConfig } from "@config/mainConfig";

app.listen(mainConfig.api_port, () =>
  console.log(`Server is Running at port ${mainConfig.api_port}!!!`)
);
