import { Router } from "express";
import { processImageController } from "../controllers/processImage.controller.js";

const router = Router();

router.route("/").post(processImageController);

export const processImageRouter = router;