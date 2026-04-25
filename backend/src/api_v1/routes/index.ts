import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { processImageRouter } from "./processImage.routes.js"

const router = Router();

router.use("/health", healthRouter);
router.use("/process-img", processImageRouter);
router.get("/test", (req, res) => res.send("test ok"));

export const apiV1Router = router;
