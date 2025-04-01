import { Router } from "express";
// import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import multer from "multer";
import OpenAI from "openai";
// import { Uploadable } from "openai/uploads";
import sharp from "sharp";

import multerImageUpload from "@config/multerImageUpload";

const uploadImage = multer(multerImageUpload);

// import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const gptRoutes = Router();

// POST
gptRoutes.post("/image/edit", uploadImage.single("img"), async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "", // Defina sua chave no .env
  });

  if (req.file != null) {
    try {
      const imagePath = req.file.path;

      // const buffer = await fs.createReadStream(imagePath);

      // const buffer = await sharp(imagePath)
      //   .ensureAlpha()
      //   .toFormat("png")
      //   .toBuffer();

      // buffer.name = "image.png";

      // prompt: "Transforme essa imagem em um estilo cyberpunk vibrante",

      const bufferInput = fs.readFileSync(imagePath);

      const bufferGBA = await sharp(bufferInput)
        .ensureAlpha()
        .toFormat("png")
        .toBuffer();

      const { fileTypeFromBuffer } = await import("file-type");

      const fileType = await fileTypeFromBuffer(bufferGBA);

      const buffer = new File([bufferGBA], "image.png", {
        type: fileType?.mime,
      });

      const response = await openai.images.edit({
        image: buffer,
        prompt: "Transforme essa foto em Ghibli",
        model: "dall-e-2",
        n: 1,
        size: "1024x1024",
      });

      // const response = await openai.images.generate({
      //   model: "dall-e-3",
      //   prompt: "Transforme essa imagem em um estilo cyberpunk vibrante",
      //   n: 1,
      //   size: "1024x1024",
      // });

      // Obtém a URL da imagem gerada
      const stylizedImageUrl = response.data[0].url;

      // Remove a imagem original do servidor
      await fs.promises.unlink(imagePath);

      res.status(201).json({ stylizedImageUrl });
    } catch (error) {
      await fs.promises.unlink(req.file.path);

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
