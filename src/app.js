import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import choiceRouter from "./routes/choiceRouter.js";
import pollRouter from "./routes/pollRouter.js";

async function main() {
  dotenv.config();

  const app = express();

  app.use(cors());
  app.use(json());
  app.use(choiceRouter);
  app.use(pollRouter);

  const PORT = process.env.PORT || 3333;

  app.listen(() => {
    console.log(`O servidor subiu na porta ${PORT}.`);
  });
}
main().catch(console.error);
