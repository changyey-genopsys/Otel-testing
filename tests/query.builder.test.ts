import { describe, expect, it } from "vitest";

import { QueryBuilder, type SearchRequest } from "../src/search/query.builder.ts";

describe("QueryBuilder", () => {

    const builder = new QueryBuilder();

    it("should build empty query", () => {

        const body = builder.build({});

        expect(body).toEqual({
            _source: [
                '@timestamp',
                'log.level',
                'message',
                'service.name',
                'trace.id',
                'span.id'
            ],
            query: { bool: {} },
            from: 0,
            size: 20,
            sort: [{ "@timestamp": "desc" }],
            track_total_hits: true
        });

    });

    it("should create keyword query", () => {
        const body: any = builder.build({
            keywordSearches:
                [{
                    field: "message",
                    keyword: "error",
                }]
        });

        expect(body.query.bool.must).toMatchObject({
            term: {
                "message": "error"
            }
        });
    });

    it("should build time range", () => {

        const body: any = builder.build({
            startTime: new Date("2026-01-01"),
            endTime: new Date("2026-01-02")
        });

        expect(body.query.bool.filter).toEqual({
            range: {
                '@timestamp': {
                    gte: '2026-01-01T00:00:00.000Z',
                    lte: '2026-01-02T00:00:00.000Z'
                }
            }
        });
    });

    it("should build level filter", () => {

        const body: any = builder.build({
            level: ["ERROR", "WARN"]
        });

        expect(body.query.bool.filter).toEqual({
            terms: {
                "log.level": ["ERROR", "WARN"]
            }
        });
    });

    it("should create service filter", () => {
        const body: any = builder.build({
            service: ["payment"]
        });

        expect(body.query.bool.filter).toEqual({
            terms: {
                "service.name": ["payment"]
            }
        });
    });

    it("should create trace filter", () => {
        const body: any = builder.build({
            traceId: "abc123"
        });

        expect(body.query.bool.filter).toEqual({
            term: {
                "trace.id": "abc123"
            }
        });
    });

    it("should build paging", () => {
        const body: any = builder.build({
            page: 3,
            pageSize: 50
        });

        expect(body.from).toBe(100);
        expect(body.size).toBe(50);
    });

    it("should build sort", () => {
        const body: any = builder.build({
            sortField: "log.level",
            sortOrder: "asc"
        });

        expect(body.sort).toEqual([
            {
                "log.level": "asc"
            }
        ]);
    });

    it("should use default source", () => {

        const body: any = builder.build({});

        expect(body._source)
            .toEqual([
                "@timestamp",
                "log.level",
                "message",
                "service.name",
                "trace.id",
                "span.id"
            ]);

    });

    it("should use custom source", () => {
        const body: any = builder.build({
            fields: [
                "message",
                "trace.id"
            ]
        });

        expect(body._source).toEqual([
            "message",
            "trace.id"
        ]);
    });

});