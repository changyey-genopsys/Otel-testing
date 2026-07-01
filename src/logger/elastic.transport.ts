import build from "pino-abstract-transport";
import { Client } from '@elastic/elasticsearch'
import { ElasticBulkBuffer } from "./elastic.bulk.buffer.ts"

const elasticClient = new Client({
  node: "http://elasticsearch:9200"
})

const buffer = new ElasticBulkBuffer({
  client: elasticClient,
  index: "application-log"
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