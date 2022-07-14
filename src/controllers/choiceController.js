import { db } from "../db/database.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function postChoice(req, res) {
  const { title, pollId } = req.body;
  const choice = req.body;

  try {
    const findPoll = await db
      .collection("poll")
      .findOne({ _id: new ObjectId(pollId) });

    if (!findPoll) {
      return res.status(404).send("Enquete não encontrada!");
    }

    const expiredDate = findPoll.expiredAt;
    const isExpired = dayjs().isAfter(expiredDate, "days");

    if (isExpired) {
      return res.status(403).send("Enquete expirada!");
    }

    const findChoice = await db
      .collection("choice")
      .findOne({ title: title });

    if (findChoice) {
      return res.status(409).send("Titulo repetido, por favor escolha outro!");
    }

    await db.collection("choice").insertOne({ ...choice, votes: 0 });

    return res.status(201).send(choice);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function postChoiceVote(req, res) {
  const id = req.params.id;

  try {
    const isChoice = await db
      .collection("choice")
      .findOne({ _id: new ObjectId(id) });

    if (!isChoice) {
      return res.status(404).send("Opção de voto não existente!");
    }

    const findPoll = await db
      .collection("poll")
      .findOne({ _id: new ObjectId(isChoice.pollId) });

    if (!findPoll) {
      return res.status(404).send("Enquete não encontrada!");
    }
    const expiredDate = findPoll.expiredAt;
    const isExpired = dayjs().isAfter(expiredDate, "days");

    if (isExpired) {
      return res.status(403).send("Enquete expirada");
    }

    await db
      .collection("choice")
      .findOneAndUpdate({ _id: ObjectId(id) }, { $inc: { votes: 1 } });

    return res.status(201).send(isChoice);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}
