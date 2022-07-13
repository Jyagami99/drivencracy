import { Router } from "express";
import {
  countVotes,
  getChoiceOption,
  getPoll,
  setPoll,
} from "../controllers/pollController.js";

const router = Router();

router.post("/poll", setPoll);
router.get("/poll", getPoll);
router.get("/poll:id/choice", getChoiceOption);
router.get("/poll:id/result", countVotes);

export default router;
