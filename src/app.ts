import express, { type Express } from 'express';

import { logger } from "./logger/logger.ts";

const app: Express = express();

app.get("/health", async (_req, res) => {
  logger.info(
    {
      module: "health",
    },
    "Health Check"
  );
  service("testing");
  
  res.json({
    status: "ok",
  });
});

async function service(args: String) {
  logger.info(args);
}

export default app;