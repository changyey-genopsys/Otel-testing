import { logger } from "./logger/logger.ts";
import app from "./app.ts";

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
