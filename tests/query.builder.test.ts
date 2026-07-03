import { describe, expect, it } from "vitest";

import { QueryBuilder } from "../src/search/query.builder.ts";

describe("QueryBuilder", () => {

    const builder = new QueryBuilder();

    it("should build empty query", () => {

        const body = builder.build({});

        expect(body).toEqual({
            query: { bool: {} },
            from: 0,
            size: 20,
            sort: [{ "@timestamp": "desc" }],
            track_total_hits: true
        });

    });

    it("should create keyword query", () => {
        const body: any = builder.build({
            keyword: "error",
            keywordFields: ["message"]
        });

        expect(body.query.bool.must).toMatchObject({
            multi_match: {
                query: "error",
                fields: ["message"]
            }
        });
    });

    it("should build time range", () => {

        const body: any = builder.build({
            startTime: new Date("2026-01-01"),
            endTime: new Date("2026-01-02")
        });

        expect(body.query.bool.filter).toContainEqual({
            range: {
                "@timestamp": {
                    gte: "2026-01-01T00:00:00.000Z",
                    lte: "2026-01-02T00:00:00.000Z"
                }
            }
        });
    });

    it("should build level filter", () => {

        const body: any = builder.build({
            level: ["ERROR", "WARN"]
        });

        expect(body.query.bool.filter).toContainEqual({
            terms: {
                "log.level": ["ERROR", "WARN"]
            }
        });
    });

    it("should create service filter", () => {
        const body: any = builder.build({
            service: ["payment"]
        });

        expect(body.query.bool.filter).toContainEqual({
            terms: {
                "service.name": ["payment"]
            }
        });
    });

    it("should create trace filter", () => {
        const body: any = builder.build({
            traceId: "abc123"
        });

        expect(body.query.bool.filter).toContainEqual({
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

    it("should combine all conditions", () => {
        const body: any = builder.build({
            keyword: "database",
            level: ["ERROR"],
            service: ["payment"],
            traceId: "abc",
            page: 2,
            pageSize: 10
        });

        expect(body.query.bool.must).toHaveLength(1);

        expect(body.query.bool.filter).toHaveLength(3);

        expect(body.from).toBe(10);

        expect(body.size).toBe(10);

    });

});