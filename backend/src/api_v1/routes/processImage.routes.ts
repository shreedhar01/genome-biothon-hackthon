import { Router } from "express";
import { processImageController } from "../controllers/processImage.controller.js";
import { upload } from "../../config/multer.js";

const router = Router();

router.route("/").post(upload.single("image"),processImageController);

export const processImageRouter = router;