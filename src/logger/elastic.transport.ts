import build from "pino-abstract-transport";
import { Client } from '@elastic/elasticsearch'

const elasticClient = new Client({
  node: "http://elasticsearch:9200"
})

export default async function () {
  return build(async function (source) {
    for await (const obj of source) {
      try {
        const doc = {
          "@timestamp": new Date(obj.time).toISOString(),
          ...obj
        };
        // console.log(doc);
        await elasticClient.index({
          index: "application-log",
          document: doc,
        });
      } catch (err) {
        console.error(err);
      }
    }
  });
}