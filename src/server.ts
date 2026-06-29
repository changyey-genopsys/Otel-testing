import app from "./app.js";
import { logger } from "./logger.js";
import { startTelemetry } from "./telemetry.js";

async function bootstrap() {

  await startTelemetry();

  app.listen(3000, () => {

    logger.info(
      {
        port: 3000,
      },
      "Server Started"
    );
  });
}

await bootstrap();

logger.info(
  {
    test: true,
  },
  "OTEL_TEST"
);