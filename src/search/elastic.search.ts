import { Client } from "@elastic/elasticsearch";
import { QueryBuilder } from "./query.builder.ts";
import { type SearchRequest } from "./search.type.ts"

const elasticClient = new Client({
    node: `http://${process.env.ES_HOST}:${process.env.ES_PORT}`,
});

const DATA_STREAM = process.env.SYSTEM_INDEX;

export class LogSearchService {
    private readonly client: Client = elasticClient;
    private readonly queryBuilder;

    constructor() {
        this.queryBuilder = new QueryBuilder();
    }

    async search(
        index: string = DATA_STREAM as string,
        request: SearchRequest
    ) {
        const body = this.queryBuilder.build(request);
        return this.client.search({
            index,
            body
        });
    }
}
