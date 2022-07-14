import { Router } from "express";
import {
  getChoiceOption,
  getPoll,
  getPollResult,
  postPoll,
} from "../controllers/pollController.js";
import { pollValidation } from "../middlewares/pollValidation.js";

const router = Router();

router.post("/poll", pollValidation, postPoll);
router.get("/poll", getPoll);
router.get("/poll/:id/choice", getChoiceOption);
router.get("/poll/:id/result", getPollResult);

export default router;
