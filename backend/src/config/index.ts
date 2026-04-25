import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  MODEL_API: process.env.MODEL_API || "http://localhost:8000/predict"
};
