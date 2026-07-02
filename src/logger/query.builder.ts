import * as esb from "elastic-builder";

export interface SearchRequest {
    keyword?: string;
    startTime?: Date;
    endTime?: Date;

    level?: string[];
    service?: string[];

    traceId?: string;
    spanId?: string;

    host?: string[];
    fields?: string[];
    sortField?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}

export class QueryBuilder {

    build(request: SearchRequest): object {
        const bool = esb.boolQuery();

        //------------------------------------
        // Keyword
        //------------------------------------
        if (request.keyword) {
            bool.must(
                esb.multiMatchQuery(
                    [
                        "message",
                        "service.name",
                        "host.name",
                        "trace.id"
                    ],
                    request.keyword
                )
                    .type("best_fields")
                    .operator("and")
            );
        }

        //------------------------------------
        // Time Range
        //------------------------------------
        if (request.startTime || request.endTime) {
            const range = esb.rangeQuery("@timestamp");
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
        // level
        //------------------------------------
        if (request.level?.length) {
            bool.filter(
                esb.termsQuery(
                    "log.level",
                    request.level
                )
            );
        }

        //------------------------------------
        // service
        //------------------------------------
        if (request.service?.length) {
            bool.filter(
                esb.termsQuery(
                    "service.name",
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
                    "host.name",
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
                    "trace.id",
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
                    "span.id",
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
        if (request.fields?.length) {
            body.source(request.fields);
        }

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
        return body.toJSON();
    }
}