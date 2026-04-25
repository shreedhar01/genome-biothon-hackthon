import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/index.js";
import { apiV1Router } from "./api_v1/routes/index.js";
import { errorHandler } from "./api_v1/middleware/error.middleware.js";
import { ApiError } from "./utils/apiError.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", apiV1Router);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.error
  })
})

const port = config.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
