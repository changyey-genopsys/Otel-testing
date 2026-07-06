import { describe, expect, it } from "vitest";

import { QueryBuilder } from "../../src/search/query.builder.ts";

describe("QueryBuilder", () => {

    const builder = new QueryBuilder();

    it("should combine keyword, time range and filters", () => {
        const query = builder
            .build({
                keywordSearches: [{
                    field: "message",
                    keyword: "database",
                    searchMode: "fullText",
                }],
                startTime: new Date("2026-07-01T00:00:00Z"),
                endTime: new Date("2026-07-02T00:00:00Z"),
                filters: [
                    {
                        field: "service.name",
                        value: "api",
                    },
                    {
                        field: "status",
                        operator: "gte",
                        value: 500,
                    },
                ],
            });


        expect((query as any).query.bool.must).toEqual(
            {
                match: {
                    message: "database",
                },
            },
        );

        expect((query as any).query.bool.filter).toEqual([
            {
                range: {
                    "@timestamp": {
                        gte: "2026-07-01T00:00:00.000Z",
                        lte: "2026-07-02T00:00:00.000Z",
                    },
                },
            },
            {
                term: {
                    "service.name": "api",
                },
            },
            {
                range: {
                    status: {
                        gte: 500,
                    },
                },
            },
        ]);
    });
})