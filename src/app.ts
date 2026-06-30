import express, { type Express } from 'express';

import { logger } from "./logger.js";

import {
  context,
  trace
} from "@opentelemetry/api";

const app: Express = express();
const tracer = trace.getTracer('service');

app.get("/health", async (_req, res) => {
  logger.info(
    {
      module: "health",
    },
    "Health Check"
  );

  // manual trace test1
  await tracer.startActiveSpan("service", async (span) => {

    await service("health Test");

    // manual trace test2
    const childspan = tracer.startSpan("db");

    const ctx =
      trace.setSpan(
        context.active(),
        childspan
      );

    context.with(ctx, () => {
      logger.info("hello");
    });

    span.end();

  });

  res.json({
    status: "ok",
  });
});

async function service(args: String) {
  logger.info(args);
}

// const intervalId = setInterval(() => {
//   logger.info("This message repeats every 3 seconds." + String(Date.now()));
// }, 3000);


export default app;