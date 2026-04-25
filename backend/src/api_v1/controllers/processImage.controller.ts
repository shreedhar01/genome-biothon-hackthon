import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { processImageSchema } from "../../validators/processImage.validation";
import { processImageService } from "../../services/processImage.service";

export const processImageController = asyncHandler(async (req: Request, res: Response)=>{
    // console.log("FILE:", req.file);

    const isValid = processImageSchema.safeParse({ image: req.file })

    if (!isValid.success) {
        throw new ApiError(400, "Invalid image", isValid.error.errors);
    }

    const result = await processImageService(isValid.data)

    res.status(200).json(
        new ApiResponse(200, [result], "image process successfully")
    )
})