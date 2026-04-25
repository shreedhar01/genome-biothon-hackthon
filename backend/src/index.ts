import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/index.js";
import { apiV1Router } from "./api_v1/routes/index.js";
import { errorHandler } from "./api_v1/middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", apiV1Router);

app.use(errorHandler);

const port = config.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
