import { db } from "../db/database.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function setPoll(req, res) {
  const poll = {
    title: req.body.title,
    expiredAt: req.body.expiredAt,
  };

  try {
    const checkPoll = await db.collection("poll").findOne(poll.title);

    if (!!checkPoll) {
      return res.status(409).send("Já existe uma enquete com este nome!");
    }

    if (poll.expiredAt === "") {
      poll.expiredAt = dayjs().add(30, "day").format("YYYY-MM-DD HH:MM");
    }

    await db.collection("poll").insertOne(poll);
    return res.status(201).send(poll.title);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

export async function getPoll(req, res) {
  try {
    const poll = await db.collection("poll").find().toArray();

    if (poll.length === 0) {
      return res.status(204).send("Não há enquetes cadastradas!");
    }
    return res.status(200).send(poll);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
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

    return res.status(200).send(listChoice);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

export async function countVotes(req, res) {
  const id = req.params.id;

  try {
    const choice = await db.collection("choice").find({ pollId: id }).toArray();
    // const vote = await db.collection("vote").find({}).toArray();
    // const counter = [];
    // let position = 0;
    // let maior = 0;

    // for (let i = 0; i < choice.length; i++) {
    //   for (let j = 0; j < vote.length; j++) {
    //     if (choice[i]._id === new ObjectId(vote[j].choiceId).toString()) {
    //       counter[i]++;
    //       if (counter[i] > maior) {
    //         position = i;
    //         maior = counter[i];
    //       }
    //     }
    //   }
    // }

    // const poll = await db.collection("poll").findOne({ _id: new ObjectId(id) });

    // return res.send({
    //   ...poll,
    //   result: {
    //     title: choice[position].title,
    //     votes: Math.max(...counter),
    //   },
    // });

    let votesNumber = 0;
    let votesName = "";

    for (let i = 0; i < choice.length; i++) {
      const choiceVotes = choice[i].votes;

      if (choiceVotes > votesNumber) {
        votesNumber = choiceVotes;
        votesName = choice[i].title;
      }
    }

    const checkRepetition = await db
      .collection("choice")
      .find({ votes: votesNumber })
      .toArray();
    const result = {};

    if (checkRepetition.length === 1) {
      result = {
        title: votesName,
        votes: votesNumber,
      };
    }

    if (checkRepetition.length > 1 && checkRepetition.length < 3) {
      result = {
        title: [checkRepetition[0].title, checkRepetition[1].title],
        votes: [checkRepetition[0].votes, checkRepetition[1].votes],
      };
    }

    if (checkRepetition.length >= 3) {
      return res.status(207).send("Há 2 opções com o mesmo resultado!");
    }

    const poll = await db.collection("poll").findOne({ _id: ObjectId(id) });
    const pollResults = { ...poll, result };

    return res.status(200).send(pollResults);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}
