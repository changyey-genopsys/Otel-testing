import build from "pino-abstract-transport";
import { Client } from '@elastic/elasticsearch'
import { ElasticBulkBuffer, DATA_STREAM } from "./elastic.bulk.buffer.ts"

const elasticClient = new Client({
  node: "http://elasticsearch:9200"
})

const INDEX = "app-log";
// const DATA_STREAM = "logs-ts-app-default";

const buffer = new ElasticBulkBuffer({
  client: elasticClient,
  index: DATA_STREAM
});


export default async function () {
  return build(async (source) => {

    for await (const log of source) {
      const doc = {
        "@timestamp": new Date(log.time).toISOString(),
        ...log
      };
      await buffer.add(doc);
    }
  });
}