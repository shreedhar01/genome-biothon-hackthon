import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { processImageRouter } from "./processImage.routes.js"
import { processAudioRouter } from "./processAudio.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/process-img", processImageRouter);
router.use("/audio", processAudioRouter);
router.get("/test", (req, res) => res.send("test ok"));

export const apiV1Router = router;
