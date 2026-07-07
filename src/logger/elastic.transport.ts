import build from "pino-abstract-transport";
import { Client } from '@elastic/elasticsearch'
import { ElasticBulkBuffer } from "./elastic.bulk.buffer.ts"

const elasticClient = new Client({
  node: `http://${process.env.ES_HOST}:${process.env.ES_PORT}`
})

const DATA_STREAM = process.env.SYSTEM_INDEX;

const buffer = new ElasticBulkBuffer({
  client: elasticClient,
  // index: DATA_STREAM as string
});

/**
  * receive log from pino, add @timestamp and send to buffer
*/
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