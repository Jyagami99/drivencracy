import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import pollRouter from "./routes/pollRouter.js";
import choiceRouter from "./routes/choiceRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use(pollRouter);
app.use(choiceRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Now listening on ${PORT}`);
});
