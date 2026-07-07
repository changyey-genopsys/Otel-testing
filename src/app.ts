import express, { type Express } from 'express';

import { createLogger } from "./logger/logger.ts";

const app: Express = express();

app.get("/health", async (_req, res) => {
  const logger = createLogger({
    serviceName: "system",
  });

  logger.info(
    {
      "service.name": "health",
    },
    "Health Check"
  );

  res.json({ status: "ok" });
});

app.get("/testrun", async (_req, res) => {
  const logger = createLogger({
    serviceName: "testrun",
  });

  for (let index = 0; index < 5; index++) {
    logger.info(
      {
        "service.name": "testrun",
      },
      "Test for test"
    );
  }
  res.json({ status: "ok" });
});


// import { Client } from "@elastic/elasticsearch";
import { LogSearchService, } from "./search/elastic.search.ts"
import { type SearchRequest } from "./search/search.type.ts"

const DATA_STREAM = process.env.TEST_INDEX;//TEST_INDEX SYSTEM_INDEX

// export const elasticClient = new Client({
//   node: `http://${process.env.ES_HOST}:${process.env.ES_PORT}`,
// });



app.get("/none", async (_req, res) => {
  service("none test");

  res.json({ status: "ok" });
});



app.get("/search", async (_req, res) => {
  const options: SearchRequest = {
    keywordSearches: [{
      field: "msg",
      keyword: "test",
      searchMode: "fullText"
    }],
    filters: [{ field: "level", value: "30" }],
    fields: ['@timestamp', "msg", "hostname"],
    startTime: new Date('2026-07-06T00:00:00.000Z',),
    endTime: new Date()
  };

  const result = await new LogSearchService().search("logs-*", options);

  // console.log(result.hits);
  console.log(result.hits.hits);
  res.json({ status: "ok" });
});

async function service(args: String) {
  const logger = createLogger({
    serviceName: "none",
  });
  logger.info(args);
}

export default app;