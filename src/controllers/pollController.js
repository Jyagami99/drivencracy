import { db } from "../db/database.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function setPoll(req, res) {
  const poll = {
    title: req.body.title,
    expiredAt: req.body.expiredAt,
  };

  if (poll.expiredAt === "") {
    poll.expiredAt = dayjs().add(30, "day").format("YYYY-MM-DD HH:MM");
  }

  try {
    await db.collection("poll").insertOne(poll);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

export async function getPoll(req, res) {
  try {
    const poll = await db.collection("poll").find().toArray();
    res.send(poll);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

export async function getChoiceOption(req, res) {
  const id = req.params.id;
  try {
    const listChoice = await db
      .collection("choice")
      .find({ pollId: id })
      .toArray();

    if (listChoice.length === 0) {
      return res.status(404).send("Enquete não encontrada");
    }

    res.send(listChoice);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

export async function countVotes(req, res) {
  const id = req.params.id;

  try {
    const choice = await db.collection("choice").find({ pollId: id }).toArray();
    const vote = await db.collection("vote").find({}).toArray;
    const counter = [];
    let position = 0;
    let maior = 0;

    for (let i = 0; i < choice.length; i++) {
      for (let j = 0; j < vote.length; j++) {
        if (choice[i]._id === new ObjectId(vote[j].choiceId).toString()) {
          counter[i]++;
          if (counter[i] > maior) {
            position = i;
            maior = counter[i];
          }
        }
      }
    }

    const poll = await db.collection("poll").findOne({ _id: new ObjectId(id) });

    res.send({
      ...poll,
      result: {
        title: choice[position].title,
        votes: Math.max(...counter),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}
