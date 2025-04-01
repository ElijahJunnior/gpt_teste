import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import "@shared/container";

import cors from "cors";
import express from "express";
import { resolve } from "path";

import { errorHandleMiddleware } from "@middlewares/errorHandleMiddleware";

import { router } from "./routes";

const app = express();

app.use(express.json());

app.use(cors());

const public_path = resolve(__dirname, "..", "..", "..", "..", "public");

console.log(public_path);

router.use("/images/", express.static(`${public_path}/images`));

app.use(router);

app.use(errorHandleMiddleware);

export { app };
