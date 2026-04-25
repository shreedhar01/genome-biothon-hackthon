import { Request, Response, NextFunction } from "express";
import { healthService } from "../../services/health.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getHealth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const health = await healthService.getHealthStatus();
    res.json(new ApiResponse(200, health));
});
