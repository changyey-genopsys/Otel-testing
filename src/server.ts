import { startTelemetry } from "./telemetry.js";
await startTelemetry();

import app from "./app.js";
import { logger } from "./logger.js";

async function bootstrap() {

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

process.on('SIGINT', function () {
  process.exit();
});
