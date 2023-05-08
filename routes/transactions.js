import TransactionsController from "../controllers/Transactions.js";
import express from "express";

const router = express.Router();

router.post("/update", TransactionsController.updateTransactions);

export default router;
