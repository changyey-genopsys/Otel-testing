import { Client } from "@elastic/elasticsearch";

const DATA_STREAM = "logs-ts-app-default";

export interface SearchOptions {
    keyword?: string;
    phrase?: string;
    service?: string[];
    level?: string[];
    traceId?: string;
    spanId?: string;
    host?: string[];
    logger?: string[];
    hasException?: boolean;
    from?: Date;
    to?: Date;
    duration?: {
        gt?: number;
        gte?: number;
        lt?: number;
        lte?: number;
    };
    page?: number;
    pageSize?: number;
    sort?: "asc" | "desc";
}

class QueryBuilder {
    static build(options: SearchOptions) {
        const must: any[] = [];
        const filter: any[] = [];
        const should: any[] = [];
        const mustNot: any[] = [];

        // KeywordCriteria.build(options, must);
        if (options.keyword) {
            must.push({
                match: {
                    message: {
                        query: options.keyword,
                        operator: "and"
                    }
                }
            });
        }
        // PhraseCriteria.build(options, must);
        if (options.phrase) {
            must.push({
                match_phrase: {
                    message: options.phrase
                }
            });

        }
        // LevelCriteria.build(options, filter);
        if (options.level) {
            filter.push({
                terms: {
                    level: options.level
                }
            });

        }
        // ServiceCriteria.build(options, filter);
        if (options.service) {
            filter.push({
                terms: {
                    "service.name": options.service
                }
            });
        }

        // TraceCriteria.build(options, filter);
        if (options.traceId) {
            filter.push({
                term: {
                    trace_id: options.traceId
                }
            });
        }

        // SpanCriteria.build(options, filter);
        if (options.spanId) {
            filter.push({
                term: {
                    span_id: options.spanId
                }
            });
        }

        // TimeRangeCriteria.build(options, filter);
        if (options.from && options.to) {
            const range: Record<string, string> = {};

            if (options.from) {
                range.gte = options.from.toISOString();
            }

            if (options.to) {
                range.lte = options.to.toISOString();
            }

            filter.push({
                range: {
                    "@timestamp": range
                }
            });
        }

        // DurationCriteria.build(options, filter);
        if (options.duration) {
            filter.push({
                range: {
                    duration: {
                        ...(options.duration.gt && { gt: options.duration.gt }),
                        ...(options.duration.gte && { gte: options.duration.gte }),
                        ...(options.duration.lt && { lt: options.duration.lt }),
                        ...(options.duration.lte && { lte: options.duration.lte })
                    }
                }
            });
        }

        // ExistsCriteria.build(options, filter);
        if (options.hasException) {
            filter.push({
                exists: {
                    field: "exception"
                }
            });
        }

        const SortBuilder = [
            {
                "@timestamp": {
                    order: options.sort ?? "desc"
                }
            }
        ];


        return {
            query: {
                bool: {
                    ...(must.length && { must }),
                    ...(filter.length && { filter }),
                    ...(should.length && { should }),
                    ...(mustNot.length && { must_not: mustNot })
                }
            },
            sort: SortBuilder,
            from: ((options.page ?? 1) - 1) * (options.pageSize ?? 100),
            size: options.pageSize ?? 100
        };
    }
}

export class LogSearchService {
    private client = new Client({
        node: "http://elasticsearch:9200",
    });

    async search(options: SearchOptions) {
        const query = QueryBuilder.build(options);
        console.log(query.query.bool);
        return this.client.search(query);
    }
}
