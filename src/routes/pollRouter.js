import { Router } from "express";

const router = Router();

router.post("/poll");
router.get("/poll");
router.get("/poll:id/choice");
router.get("/poll:id/result");

export default router;
