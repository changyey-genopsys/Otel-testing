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

  res.json({
    status: "ok",
  });
});


import { Client } from "@elastic/elasticsearch";
import { LogSearchService, } from "./search/elastic.search.ts"
import { type SearchRequest } from "./search/query.builder.ts"

const DATA_STREAM = "logs-ts-app-default";

export const elasticClient = new Client({
  node: "http://elasticsearch:9200",
});



// app.get("/searchtt", async (_req, res) => {
//   const result = await elasticClient.search({
//     index: DATA_STREAM,
//     query: {
//       match: {
//         level: 30
//       }
//     }
//   });

//   console.log(result.hits.hits);
//   res.json({
//     status: "ok",
//   });
// });


app.get("/search", async (_req, res) => {
  const options: SearchRequest = {
    keywordSearches:[{
        field: "level",
        keyword: "30",
    }]
  };

  const result = await new LogSearchService().search(DATA_STREAM, options);

  console.log(result);
  // console.log(result.hits);
  res.json({
    status: "ok",
  });
});

async function service(args: String) {
  logger.info(args);
}

export default app;