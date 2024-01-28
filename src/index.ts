import config from "@config";
import webhook from "@routes/webhook";
import SeamService from "@services/seam";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", webhook);

export default app.listen(config.PORT, async () => {
  await SeamService.init(["schlage"]);

  console.info(`Webhook receiver listening on port ${config.PORT}`);
});
