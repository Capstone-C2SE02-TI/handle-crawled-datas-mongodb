import CoinsController from "../controllers/Coins.js";
import express from "express";

const router = express.Router();

router.post("/update", CoinsController.updateCoins);

export default router;
