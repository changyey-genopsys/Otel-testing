import { Client } from "@elastic/elasticsearch";

// export const DATA_STREAM = "logs-ts-app-default";

export class ElasticBulkBuffer {
    private readonly client: Client;
    private readonly index: string;
    private readonly maxBufferSize: number;
    private readonly flushInterval: number;

    private readonly buffer: object[] = [];

    private flushing = false;
    private timer: NodeJS.Timeout;

    constructor(options: {
        client: Client;
        index: string;
        maxBufferSize?: number;
        flushInterval?: number;
    }) {
        this.client = options.client;
        this.index = options.index;
        this.maxBufferSize = options.maxBufferSize ?? 200;
        this.flushInterval = options.flushInterval ?? 5000;
        this.timer = setInterval(() => {
            this.flush().catch(console.error);
        }, this.flushInterval);
    }

    public async add(document: object) {
        this.buffer.push(document);
        if (this.buffer.length >= this.maxBufferSize) {
            await this.flush();
        }
    }

    public async flush() {
        if (this.flushing || this.buffer.length === 0)
            return;

        this.flushing = true;

        try {
            const logs = this.buffer.splice(0);
            const operations = [];

            for (const log of logs) {
                operations.push({
                    create: {
                        _index: this.index
                    }
                });
                operations.push(log);
            }
            const res = await this.client.bulk({
                refresh: false,
                operations
            });
            // Retry setting not yet
        }
        finally {
            this.flushing = false;
        }
    }

    public async close() {
        clearInterval(this.timer);
        await this.flush();
    }
}