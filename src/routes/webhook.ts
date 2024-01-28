import express from "express";
import handler from "@controllers/seam";

const router = express.Router();

router.post("/webhook", handler);

export default router;
