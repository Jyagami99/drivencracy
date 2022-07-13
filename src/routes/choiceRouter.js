import { Router } from "express";
import { setChoice, setVote } from "../controllers/choiceController.js";

const router = Router();

router.post("/choice", setChoice);
router.post("/choite:id/vote", setVote);

export default router;
