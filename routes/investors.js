import InvestorsController from "../controllers/Investors.js";
import express from "express";

const router = express.Router();

router.post("/update", InvestorsController.updateInvestors);

export default router;
