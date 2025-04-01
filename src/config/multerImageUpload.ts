import { Request } from "express";
import { diskStorage, FileFilterCallback } from "multer";
import { v4 as uuid } from "uuid";

import { mainConfig } from "@config/mainConfig";
import { AppError } from "@shared/errors/AppError";

export default {
  storage: diskStorage({
    destination: mainConfig.temp_folder,
    filename: (req, file, cb) => {
      const [, file_extension] = file.mimetype.split("/");

      const file_name = uuid() + ("." + file_extension ?? "");

      return cb(null, file_name);
    },
  }),
  limits: {
    fieldNameSize: 250,
    fieldSize: 20000,
    fileSize: 2000000,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new AppError("Only .png, .jpg and .jpeg format allowed!", 400));
    }
  },
};
