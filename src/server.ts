import app from "./app.ts";

async function bootstrap() {

  app.listen(3000);
}

await bootstrap();

process.on('SIGINT', function () {
  process.exit();
});
