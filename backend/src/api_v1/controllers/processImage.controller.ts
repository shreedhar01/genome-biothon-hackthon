import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";

export const processImageController = asyncHandler(async (req: Request, res: Response)=>{
    res.status(200).json(
        new ApiResponse(200,[],"image process successfully")
    )
})