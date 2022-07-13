import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();

promise
  .then(() => {
    db = mongoClient.db(process.env.MONGO_NAME);
    console.log("Connected to database!");
  })
  .catch((err) => console.error(err));

export { db };
