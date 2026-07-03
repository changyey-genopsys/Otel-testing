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


export const SearchFields = {

    defaultKeyword: [

        EcsFields.message,

        EcsFields.serviceName,

        EcsFields.hostName,

        EcsFields.traceId,

    ],

    defaultSource: [

        EcsFields.timestamp,

        EcsFields.level,

        EcsFields.message,

        EcsFields.serviceName,

        EcsFields.traceId,

        EcsFields.spanId,

    ],

} as const;