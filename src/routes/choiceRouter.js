import { Router } from "express";
import { postChoice, postChoiceVote } from "../controllers/choiceController.js";
import { choiceValidation } from "../middlewares/choiceValidation.js";

const router = Router();

router.post("/choice", choiceValidation, postChoice);
router.post("/choice/:id/vote", postChoiceVote);

export default router;
