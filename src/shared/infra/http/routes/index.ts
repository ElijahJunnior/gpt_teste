import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { examplesRoutes } from "./examples.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use("/examples", examplesRoutes);
router.use("/users", usersRoutes);
router.post("/teste", ensureAuthenticated, (req, res) => {
  res.status(201).send("Success!");
});

export { router };
