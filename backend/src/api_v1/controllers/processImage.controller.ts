import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { processAudioTextSchema, processImageSchema, sendEmailSchema } from "../../validators/processImage.validation";
import { processAudioService, processImageService, sendEmailService } from "../../services/processImage.service";

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

export const processAudioController = asyncHandler(async (req: Request, res: Response) => {
    const isValid = processAudioTextSchema.safeParse(req.body);

    if (!isValid.success) {
        throw new ApiError(400, "Invalid audio input", isValid.error.errors);
    }

    const audioBuffer = await processAudioService(isValid.data);

    res.setHeader("Content-Type", "audio/mpeg"); 
    // or "audio/wav" depending on API

    res.setHeader("Content-Disposition", "inline; filename=output.mp3");

    res.status(200).send(audioBuffer);
});

export const sentEmailController = asyncHandler(async (req: Request, res: Response)=>{
    const isValid = sendEmailSchema.safeParse(req.body)
    if (!isValid.success) {
        throw new ApiError(400, "Invalid audio input", isValid.error.errors);
    }
    const result = await sendEmailService(isValid.data)
    res.status(200).json(
        new ApiResponse(200, [result], "Email sent successfully")
    )
})