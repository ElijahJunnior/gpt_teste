import { Router } from "express";
import fs from "fs";
import { loadEsm } from "load-esm";
import multer from "multer";
import OpenAI from "openai";
import sharp from "sharp";
import Stream from "stream";
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
  } else {
    res.status(400).json({ error: "Image not found" });
  }
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

// teste 1
gptRoutes.get("/image/teste-1", async (req, res) => {
  const { temp_folder } = mainConfig;

  // cria um stream para ler o arquivo parte por parte
  const read_stream = fs.createReadStream(temp_folder + "/mica.png");

  // cria um PassThrough Stream, que age como um "tubo" para os dados
  // permite monitorar e manipular os dados antes de enviá-los.
  // ajuda no tratamento de erros e pode ser útil para modificar o fluxo de dados, se necessário.
  const pass_through = new Stream.PassThrough();

  // define o Content-Type baseado na extensão do arquivo
  res.setHeader("Content-Type", "image/png");

  // usa o stream.pipeline() para conecta no streams tratar erros
  // o pipeline lê o read_stream passa os dados pelo pass_through e chama a callback err caso necessário

  Stream.pipeline(read_stream, pass_through, (err) => {
    if (err != null) {
      console.error("Erro ao carregar imagem:", err);
      // retorna erro 404 se o arquivo não existir
      return res.sendStatus(404);
    }
  });

  // o stream pass_through (que contém os dados do arquivo) é enviado diretamente para o cliente.
  // o arquivo é transmitido diretamente para a resposta (res).
  // o cliente começa a receber os dados imediatamente, sem precisar esperar o arquivo inteiro ser lido.
  return pass_through.pipe(res);
});

// teste 2
gptRoutes.post(
  "/image/teste-2",
  uploadImage.single("img"),
  async (req, res) => {
    if (req.file == null) {
      return res.status(400).json({ error: "Image not found" });
    }

    let path_nova_imagem = "";

    try {
      const buffer_input = fs.readFileSync(req.file.path);

      const buffer_gba = await sharp(buffer_input)
        .resize(1024, 1024, {
          fit: "cover",
        })
        .ensureAlpha()
        .toFormat("png")
        .toBuffer();

      const { fileTypeFromBuffer } = await loadEsm<typeof import("file-type")>(
        "file-type"
      );

      const file_type = await fileTypeFromBuffer(buffer_gba);

      const [, file_extension] = (file_type?.mime ?? "/").split("/");

      path_nova_imagem = `${
        mainConfig.temp_folder
      }/${uuid()}.${file_extension}`;

      fs.writeFileSync(path_nova_imagem, buffer_gba);

      const read_stream = fs.createReadStream(path_nova_imagem);

      const pass_through = new Stream.PassThrough();

      res.setHeader("Content-Type", file_type?.mime ?? "");
      // image/jpeg

      Stream.pipeline(read_stream, pass_through, (err) => {
        if (err != null) {
          console.error("Erro ao carregar imagem:", err);
          return res.sendStatus(404);
        }
      });

      return pass_through.pipe(res);
    } catch (error) {
      throw error;
    } finally {
      try {
        await fs.promises.unlink(req.file.path);
      } catch {
        console.log("Error deleting original image 1");
      }

      try {
        if (path_nova_imagem.length > 0) {
          // await fs.promises.unlink(path_nova_imagem);
        }
      } catch {
        console.log("Error deleting original image 2");
      }
    }
  }
);

// teste 3
gptRoutes.get("/image/teste-3", async (req, res) => {
  const { temp_folder } = mainConfig;

  let path_nova_imagem = "";

  try {
    // cria um stream para ler o arquivo parte por parte
    const buffer_input = fs.readFileSync(temp_folder + "/mica.jpg");

    const buffer_gba = await sharp(buffer_input)
      .resize(1024, 1024, {
        fit: "cover",
      })
      .ensureAlpha()
      .toFormat("png")
      .toBuffer();

    const { fileTypeFromBuffer } = await loadEsm<typeof import("file-type")>(
      "file-type"
    );

    const file_type = await fileTypeFromBuffer(buffer_gba);

    const [, file_extension] = (file_type?.mime ?? "/").split("/");

    path_nova_imagem = `${mainConfig.temp_folder}/${uuid()}.${file_extension}`;

    fs.writeFileSync(path_nova_imagem, buffer_gba);

    const read_stream = fs.createReadStream(path_nova_imagem);

    const pass_through = new Stream.PassThrough();

    res.setHeader("Content-Type", file_type?.mime ?? "");
    // image/jpeg

    Stream.pipeline(read_stream, pass_through, (err) => {
      if (err != null) {
        console.error("Erro ao carregar imagem:", err);
        return res.sendStatus(404);
      }
    });

    return pass_through.pipe(res);
  } catch (error) {
    throw error;
  } finally {
    try {
      if (path_nova_imagem.length > 0) {
        // await fs.promises.unlink(path_nova_imagem);
      }
    } catch {
      console.log("Error deleting original image 2");
    }
  }
});

// GET

// PATCH

// PUT

// DELETE

export { gptRoutes };
