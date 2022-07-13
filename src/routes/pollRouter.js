import { Router } from "express";
import {
  countVotes,
  getChoiceOption,
  getPoll,
  setPoll,
} from "../controllers/pollController.js";
import { pollValidation } from "../middlewares/pollValidation.js";

const router = Router();

router.post("/poll", pollValidation, setPoll);
router.get("/poll", getPoll);
router.get("/poll:id/choice", getChoiceOption);
router.get("/poll:id/result", countVotes);

export default router;
