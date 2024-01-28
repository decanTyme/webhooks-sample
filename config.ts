import dotenv from "dotenv";
import { validateEnv } from "@utils";

dotenv.config();

// Ensure variables are loaded correctly
validateEnv();

const config = {
  PORT: process.env.PORT ?? 8080,
  SEAM_API_KEY: process.env.SEAM_API_KEY,
};

export default config;
