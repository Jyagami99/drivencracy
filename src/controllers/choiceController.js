import { db } from "../db/database.js";
import { ObjectId } from "mongodb";

export async function setChoice(req, res) {
  const choice = {
    title: req.body.title,
    pollId: req.body.pollId,
  };

  try {
    const searchPoll = await db
      .collection("poll")
      .findOne({ _id: new ObjectId(choice.pollId) });

    if (!searchPoll) {
      return res.status(404).send("Enquete não encontrada!");
    }

    const expiredDate = searchPoll.expiredAt;
    const isExpired = dayjs().isAfter(expiredDate, "days");

    if (isExpired) {
      return res.status(403).send("Enquete expirada!");
    }

    const searchChoice = await db
      .collection("choice")
      .findOne({ title: choice.title });

    if (searchChoice) {
      return res.status(409).send("Titulo repetido, por favor escolha outro!");
    }

    await db.collection("choice").insertOne({ ...choice, votes: 0 });

    return res.status(201).send(choice);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function setVote(req, res) {
  const id = req.params.id;
  // const vote = {
  //   createAt: dayjs().format("YYYY-MM-DD HH:MM"),
  //   choiceId: id,
  // };

  try {
    const isChoice = await db
      .collection("choice")
      .findOne({ _id: new ObjectId(id) });

    if (!isChoice) {
      return res.status(404).send("Opção de voto não existente!");
    }

    const searchPoll = await db
      .collection("poll")
      .findOne({ _id: new ObjectId(isChoice.pollId) });

    if (!searchPoll) {
      return res.status(404).send("Enquete não encontrada!");
    }
    const expiredDate = searchPoll.expiredAt;
    const isExpired = dayjs().isAfter(expiredDate, "days");

    if (isExpired) {
      return res.status(403).send("Enquete expirada");
    }

    await db
      .collection("choice")
      .findOneAndUpdate({ _id: ObjectId(choiceId) }, { $inc: { votes: 1 } });

    return res.status(201).send(isChoice);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}
