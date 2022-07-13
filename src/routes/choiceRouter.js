import { Router } from "express";
import { setChoice, setVote } from "../controllers/choiceController.js";
import { choiceValidation } from "../middlewares/choiceValidation.js";

const router = Router();

router.post("/choice", choiceValidation, setChoice);
router.post("/choite:id/vote", setVote);

export default router;
