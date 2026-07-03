import { Client } from "@elastic/elasticsearch";
import { QueryBuilder, type SearchRequest } from "./query.builder.ts";

const elasticClient = new Client({
    node: "http://elasticsearch:9200",
});

const DATA_STREAM = "logs-ts-app-default";

export class LogSearchService {
    private readonly client: Client = elasticClient;
    private readonly queryBuilder;

    constructor() {
        this.queryBuilder = new QueryBuilder();
    }

    async search(
        index: string = DATA_STREAM,
        request: SearchRequest
    ) {
        const body = this.queryBuilder.build(request);
        return this.client.search({
            index,
            body
        });
    }
}
