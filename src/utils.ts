import { cleanEnv, port, str } from "envalid";

export function validateEnv(): void {
  cleanEnv(process.env, {
    PORT: port({ default: 8080 }),
    SEAM_API_KEY: str({
      docs: "https://docs.seam.co/latest/quickstart#step-2-get-an-api-key-and-sdk",
      example: "seam_test2bMS_94SrGUXuNR2JmJkjtvBQDg5c",
    }),
  });
}
