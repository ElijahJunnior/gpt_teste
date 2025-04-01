import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { examplesRoutes } from "./examples.routes";
import { gptRoutes } from "./gpt.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use("/examples", examplesRoutes);
router.use("/users", usersRoutes);
router.use("/gpt", gptRoutes);

router.post("/teste", ensureAuthenticated, (req, res) => {
  res.status(201).send("Success!");
});

router.get("/teste", (req, res) => {
  res.status(200).send("Success!");
});

export { router };
