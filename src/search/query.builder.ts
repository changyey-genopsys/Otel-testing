import * as esb from "elastic-builder";
import { EcsFields, SearchFields } from "./search.field.ts"

export interface KeywordSearch {
    field: string;
    keyword: string;
    searchMode?: "fullText" | "exact";
    searchOptions?: {
        operator?: "and" | "or";
        fuzziness?: "AUTO" | number;
        boost?: number;
        minimumShouldMatch?: string;
    };

}

export interface SearchRequest {
    keywordSearches?: KeywordSearch[];

    startTime?: Date;
    endTime?: Date;

    level?: string[];
    service?: string[];

    traceId?: string;
    spanId?: string;

    host?: string[];

    /** 
    * elasticsearch return field.
    */
    fields?: string[];
    sortField?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}

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
        body.source(request.fields ?? SearchFields.defaultSource);

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
        // console.log(body.toJSON().query)
        // console.log(body.toJSON().query.bool.must)
        console.log(body.query(bool).toJSON());
        return body.query(bool).toJSON();
    }
}