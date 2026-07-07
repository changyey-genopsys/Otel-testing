import { LogSearchService, type SearchRequest } from "./search/index.ts"
import { errors } from '@elastic/elasticsearch';


const ALL_LOG = "logs-*";

function getIndexByService(service: string): string {
    switch (service) {
        case "testrun":
        case "controller":
            return `${process.env.TEST_INDEX}`
    }
    return `${process.env.SYSTEM_INDEX}`
}

export async function getLogByServiceAndLevel(service: string, level: string) {
    const index = getIndexByService(service);

    const option: SearchRequest = {
        filters: [{ field: "service.name", value: service },
        { field: "level", value: level }]
    };
    try {
        const res = await new LogSearchService().search(index, option);
        if (res._shards.failed)
            console.log("warning, shard error");
        return res.hits.hits;
    } catch (error) {
        errorHandling(error);
        return;
    }
}

export async function getLogByTime(startTime: string, endTime: string) {
    const option: SearchRequest = {
        startTime: new Date(startTime), endTime: new Date(endTime)
    };
    try {
        const res = await new LogSearchService().search(ALL_LOG, option);
        if (res._shards.failed)
            console.log("warning, shard error");
        return res.hits.hits;
    } catch (error) {
        errorHandling(error);
        return;
    }
}

function errorHandling(err: unknown) {
    // 1. Handle API/Server Errors (Bad queries, structural problems, missing indices)
    if (err instanceof errors.ResponseError) {
        console.error(`Elasticsearch API Error [${err.statusCode}]:`, err.message);

        // Inspecting the exact Elasticsearch cluster response payload
        const rootCause = err.body?.error?.root_cause?.[0];
        if (rootCause) {
            console.error(`Reason: ${rootCause.reason} (Type: ${rootCause.type})`);
        }
        return;
    }

    // 2. Handle Connection Issues (Cluster down, incorrect IP/credentials)
    if (err instanceof errors.ConnectionError) {
        console.error('Network error: Could not reach the Elasticsearch cluster.', err.message);
        // Trigger a retry policy or failover system here
        return;
    }

    // 3. Handle Timeouts
    if (err instanceof errors.TimeoutError) {
        console.error('Query timed out before completing.');
        return;
    }

    // 4. Handle generic or unknown structural errors
    if (err instanceof Error) {
        console.error('Unexpected generic client error:', err.message);
        return;
    }

    console.error('An entirely unknown error format was caught:', err);
}
