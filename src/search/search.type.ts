export const EcsFields = {
    timestamp: "@timestamp",
    message: "message",
    level: "log.level",
    serviceName: "service.name",
    serviceVersion: "service.version",
    hostName: "host.name",
    traceId: "trace.id",
    spanId: "span.id",
    transactionId: "transaction.id",
    eventDataset: "event.dataset",
    eventAction: "event.action",
    processPid: "process.pid",
    processName: "process.name",
    userName: "user.name",
} as const;


// export const SearchFields = {
//     defaultKeyword: [
//         EcsFields.message,
//         EcsFields.serviceName,
//         EcsFields.hostName,
//         EcsFields.traceId,
//     ],

//     defaultSource: [
//         EcsFields.timestamp,
//         EcsFields.level,
//         EcsFields.message,
//         EcsFields.serviceName,
//         EcsFields.traceId,
//         EcsFields.spanId,
//     ],
// } as const;

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "notIn"
  | "exists"
  | "notExists";

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

export interface FieldFilter {
  field: string;
  operator?: FilterOperator;
  value: unknown;
}

export interface SearchRequest {
    keywordSearches?: KeywordSearch[];
    filters?: FieldFilter[];

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