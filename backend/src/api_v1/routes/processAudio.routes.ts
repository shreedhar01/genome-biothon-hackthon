import { Router } from "express";
import { processAudioController } from "../controllers/processImage.controller.js";

const router = Router();

router.route("/").post(processAudioController)

export const processAudioRouter = router;