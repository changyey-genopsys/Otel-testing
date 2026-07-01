import { logger } from "./logger/logger.js";
import app from "./app.js";

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
