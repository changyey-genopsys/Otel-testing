import * as esb from "elastic-builder";
import { EcsFields } from "./search.type.ts"
import type { KeywordSearch, SearchRequest, FieldFilter } from "./search.type.ts"
export class QueryBuilder {

    private buildCondition(condition: KeywordSearch): esb.Query {
        switch (condition.searchMode) {
            case "fullText": {
                const query = esb.matchQuery(
                    condition.field,
                    condition.keyword
                );

                const options = condition.searchOptions;

                if (options) {
                    if (options.operator) {
                        query.operator(options.operator);
                    }

                    if (options.fuzziness !== undefined) {
                        query.fuzziness(options.fuzziness);
                    }

                    if (options.minimumShouldMatch) {
                        query.minimumShouldMatch(
                            options.minimumShouldMatch
                        );
                    }

                    if (options.boost !== undefined) {
                        query.boost(options.boost);
                    }
                }

                return query;
            }

            case "exact":
            default:
                return esb.termQuery(
                    condition.field,
                    condition.keyword
                );
        }
    }

    private addFilters(
        boolQuery: esb.BoolQuery,
        filters?: FieldFilter[]
    ) {
        if (!filters?.length) {
            return;
        }
        for (const filter of filters) {
            const operator = filter.operator ?? "eq";

            switch (operator) {

                case "eq":
                    if (
                        typeof filter.value === "string" ||
                        typeof filter.value === "number" ||
                        typeof filter.value === "boolean" ||
                        filter.value === undefined
                    )
                        boolQuery.filter(esb.termQuery(filter.field, filter.value));
                    break;

                case "neq":
                    if (
                        typeof filter.value === "string" ||
                        typeof filter.value === "number" ||
                        typeof filter.value === "boolean" ||
                        filter.value === undefined
                    )
                        boolQuery.mustNot(esb.termQuery(filter.field, filter.value));
                    break;

                case "gt":
                case "gte":
                case "lt":
                case "lte":
                    boolQuery.filter(esb.rangeQuery(filter.field)[operator](filter.value as any));
                    break;

                case "in":
                    boolQuery.filter(
                        esb.termsQuery(
                            filter.field,
                            filter.value as string[]
                        )
                    );
                    break;

                case "notIn":
                    boolQuery.mustNot(
                        esb.termsQuery(
                            filter.field,
                            filter.value as string[]
                        )
                    );
                    break;

                case "exists":
                    boolQuery.filter(esb.existsQuery(filter.field));
                    break;

                case "notExists":
                    boolQuery.mustNot(esb.existsQuery(filter.field));
                    break;
            }
        }
    }

    /**
     * build the search query body
     */
    public build(request: SearchRequest): object {
        const bool = esb.boolQuery();

        //------------------------------------
        // Keyword or full-text search
        //------------------------------------
        if (request.keywordSearches?.length) {
            for (const item of request.keywordSearches) {
                bool.must(this.buildCondition(item));
            }
        }

        //------------------------------------
        // Time Range
        //------------------------------------
        if (request.startTime || request.endTime) {
            const range = esb.rangeQuery(EcsFields.timestamp);
            if (request.startTime) {
                range.gte(
                    request.startTime.toISOString()
                );
            }
            if (request.endTime) {
                range.lte(
                    request.endTime.toISOString()
                );
            }
            bool.filter(range);
        }

        //------------------------------------
        // General filters
        //------------------------------------
        this.addFilters(
            bool,
            request.filters
        );

        //------------------------------------
        // level !ECS
        //------------------------------------
        if (request.level?.length) {
            bool.filter(
                esb.termsQuery(
                    EcsFields.level,
                    request.level
                )
            );
        }

        //------------------------------------
        // service !ECS
        //------------------------------------
        if (request.service?.length) {
            bool.filter(
                esb.termsQuery(
                    EcsFields.serviceName,
                    request.service
                )
            );
        }

        //------------------------------------
        // host
        //------------------------------------
        if (request.host?.length) {
            bool.filter(
                esb.termsQuery(
                    EcsFields.hostName,
                    request.host
                )
            );
        }

        //------------------------------------
        // trace
        //------------------------------------
        if (request.traceId) {
            bool.filter(
                esb.termQuery(
                    EcsFields.traceId,
                    request.traceId
                )
            );
        }

        //------------------------------------
        // span
        //------------------------------------
        if (request.spanId) {
            bool.filter(
                esb.termQuery(
                    EcsFields.spanId,
                    request.spanId
                )
            );
        }

        //------------------------------------
        // Request Body
        //------------------------------------
        const body = esb.requestBodySearch();
        body.query(bool);

        //------------------------------------
        // source
        //------------------------------------
        if (request.fields)
            body.source(request.fields);

        //------------------------------------
        // paging
        //------------------------------------
        const page = request.page ?? 1;
        const pageSize = request.pageSize ?? 20;

        body.from((page - 1) * pageSize)
            .size(pageSize);

        //------------------------------------
        // sort
        //------------------------------------
        body.sort(esb.sort(
            request.sortField ?? "@timestamp",
            request.sortOrder ?? "desc"
        ));

        //------------------------------------
        // total hits
        //------------------------------------
        body.trackTotalHits(true);
        // console.log(body.query(bool).toJSON());
        return body.query(bool).toJSON();
    }
}