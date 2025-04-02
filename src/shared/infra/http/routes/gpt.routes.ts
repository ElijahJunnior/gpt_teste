import { Router } from "express";
import fs from "fs";
import { loadEsm } from "load-esm";
import multer from "multer";
import OpenAI from "openai";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

import { mainConfig } from "@config/mainConfig";
import multerImageUpload from "@config/multerImageUpload";

const uploadImage = multer(multerImageUpload);

// import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const gptRoutes = Router();

// POST
gptRoutes.post("/image/edit", uploadImage.single("img"), async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "", // Defina sua chave no .env
  });

  let pngPath = "";

  if (req.file != null) {
    try {
      const imagePath = req.file.path;

      const bufferInput = fs.readFileSync(imagePath);

      const bufferGBA = await sharp(bufferInput)
        .resize(1024, 1024, {
          fit: "cover",
        })
        .ensureAlpha()
        .toFormat("png")
        .toBuffer();

      const { fileTypeFromBuffer } = await loadEsm<typeof import("file-type")>(
        "file-type"
      );

      const fileType = await fileTypeFromBuffer(bufferGBA);

      const [, file_extension] = (fileType?.mime ?? "/").split("/");

      pngPath = `${mainConfig.temp_folder}/${uuid()}.${file_extension}`;

      fs.writeFileSync(pngPath, bufferGBA);

      const buffer = fs.createReadStream(pngPath);

      // prompt: "Transforme essa imagem em um estilo cyberpunk vibrante",

      const response = await openai.images.edit({
        image: buffer,
        prompt: "Transforme essa foto em ghibli",
        // model: "dall-e-2",
        // n: 1,
        size: "1024x1024",
      });

      const stylizedImageUrl = response.data[0].url;

      // Remove a imagem original do servidor
      try {
        // await fs.promises.unlink(imagePath);
      } catch {
        console.log("Error deleting original image 1");
      }

      try {
        // await fs.promises.unlink(pngPath);
      } catch {
        console.log("Error deleting original image 2");
      }

      // return res.status(201).json({});
      res.status(201).json({ stylizedImageUrl });

      // res.setHeader("Content-Type", "image/png");
      // return res.send(bufferGBA);
    } catch (error) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch {
        console.log("Error deleting original image 3");
      }

      if (pngPath.length > 0) {
        try {
          // await fs.promises.unlink(pngPath);
        } catch {
          console.log("Error deleting original image 4");
        }
      }

      throw error;
    }
  }

  res.status(400).json({ error: "Image not found" });
});

gptRoutes.post("/image/create", async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "", // Defina sua chave no .env
  });

  const { prompt } = req.body as { prompt: string };

  if (prompt == null) {
    throw new Error("Prompt not found");
  }

  const response = await openai.images.generate({
    prompt,
    model: "dall-e-3",
    // n: 1,
    // size: "1024x1024",
  });

  // const response = await openai.images.generate({
  //   model: "dall-e-3",
  //   prompt: "Transforme essa imagem em um estilo cyberpunk vibrante",
  //   n: 1,
  //   size: "1024x1024",
  // });

  // Obtém a URL da imagem gerada
  const stylizedImageUrl = response.data[0].url;

  res.status(201).json({ stylizedImageUrl });
});

// GET

// PATCH

// PUT

// DELETE

export { gptRoutes };
