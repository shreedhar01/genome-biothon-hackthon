import { Router } from "express";
import { sentEmailController } from "../controllers/processImage.controller.js";

const router = Router();

router.route("/").post(sentEmailController)

export const sentEmailRouter = router;