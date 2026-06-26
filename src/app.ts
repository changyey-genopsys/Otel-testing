import express, { type Express } from 'express';

import { logger } from "./logger.js";

const app: Express = express();

app.get("/health", (_req, res) => {
  logger.info(
    {
      module: "health",
    },
    "Health Check"
  );

  res.json({
    status: "ok",
  });
});

const intervalId = setInterval(() => {
  logger.info("This message repeats every 3 seconds." + String(Date.now()));
}, 3000);


export default app;