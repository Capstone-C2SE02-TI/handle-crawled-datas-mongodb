import TagsController from "../controllers/Tags.js";
import express from "express";

const router = express.Router();

router.post("/update", TagsController.updateTags);

export default router;
