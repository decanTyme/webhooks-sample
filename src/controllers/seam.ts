import Constants from "@constants";
import SeamService from "@services/seam";
import type { DeepPartial, Maybe, Reservation } from "@types";
import type { RequestHandler } from "express";

const controller: RequestHandler<
  undefined,
  string,
  Maybe<DeepPartial<Reservation>>
> = async (req, res) => {
  const payload = req.body;

  if (!payload?.device?.id || payload.device.lock == null) {
    res.status(400).send("Missing webhook data.");
  } else {
    try {
      await SeamService.setLock(payload.device.id, payload.device.lock);

      res.status(200).send("OK");
    } catch (error) {
      console.error(error);

      if (
        error instanceof Error &&
        error.cause === Constants.DEVICE_NOT_ONLINE
      ) {
        res.status(403).send("Device offline.");
      } else {
        res.status(400).send("Internal server error. Please try again later.");
      }
    }
  }
};

export default controller;
