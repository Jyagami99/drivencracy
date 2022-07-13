import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import choiceController from "./routes/choiceRouter.js";
import pollController from "./routes/pollRouter.js";

async function main() {
  dotenv.config();

  const app = express();

  app.use(cors());
  app.use(json());
  app.use(choiceController);
  app.use(pollController);

  const PORT = process.env.PORT || 3333;

  app.listen(() => {
    console.log(`O servidor subiu na porta ${PORT}.`);
  });
}
main().catch(console.error);
